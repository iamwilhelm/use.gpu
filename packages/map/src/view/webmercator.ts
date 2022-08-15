import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { AxesTrait, ObjectTrait, Axes, Swizzle } from '@use-gpu/plot';
import type { GeographicTrait } from '../types';

import { parseMatrix, parsePosition, parseRotation, parseQuaternion, parseScale } from '@use-gpu/traits';
import { use, provide, signal, useContext, useOne, useMemo } from '@use-gpu/live';
import { bundleToAttributes, chainTo, swizzleTo } from '@use-gpu/shader/wgsl';
import {
  TransformContext, DifferentialContext,
  useLayoutContext,
  useShaderRef, useBoundShader, useCombinedTransform,
} from '@use-gpu/workbench';

import {
  RangeContext,
  composeTransform, swizzleMatrix, toBasis, rotateBasis, invertBasis,
  useAxesTrait, useObjectTrait,
} from '@use-gpu/plot';
import { mat4 } from 'gl-matrix';

import { useGeographicTrait } from '../traits';

import { getWebMercatorPosition } from '@use-gpu/wgsl/transform/webmercator.wgsl';

const π = Math.PI;
const toRad = π / 180;

const lerp = (a: number, b: number, t: number) => a * (1 - t) + b * t;

const MERCATOR_BINDINGS = bundleToAttributes(getWebMercatorPosition);

export type WebMercatorProps = Partial<AxesTrait> & Partial<GeographicTrait> & Partial<ObjectTrait> & {
  bend?: number,
  on?: Swizzle,
  centered?: boolean,

  children?: LiveElement,
};

export const WebMercator: LiveComponent<WebMercatorProps> = (props) => {
  const {
    on = 'xyz',
    bend = 1,
    centered = false,
    radius = 40_075_017,
    children,
  } = props;

  const layout = useLayoutContext;
  const flipY = layout[1] > layout[3];

  const {axes: a, range: g} = useAxesTrait(props);
  const {long, lat, zoom} = useGeographicTrait(props);
  const {position: p, scale: s, quaternion: q, rotation: r, matrix: m} = useObjectTrait(props);

  const [matrix, swizzle, origin, range, epsilon] = useMemo(() => {
    const matrix = mat4.create();

    // Get X/Y/Z/W scale
    const dx = (g[0][1] - g[0][0]) / 2;
    const dy = (g[1][1] - g[1][0]) / 2;
    const dz = (g[2][2] - g[2][0]) / 2;
    const dw = (g[3][2] - g[3][0]) / 2;

    // Get 2D bounding box
    const [ox, oy] = projectMercator([long, lat]);
    const origin = [ox, oy, toRad * lat];
    const span = 1/zoom;

    // Epsilon for differential transport
    const epsilon = span / 100;

    const left = origin[0] + span * g[0][0];
    const right = origin[0] + span * g[0][1];
    const top = Math.max(-1, origin[1] + span * g[1][0]);
    const bottom = Math.min(1, origin[1] + span * g[1][1]);

    // Unproject and set lat/long range + conformal Z
    const tl = unprojectMercator([left, top]);
    const br = unprojectMercator([right, bottom]);

    let range = [[tl[0], br[0]], [tl[1], br[1]], [span*g[2][0], span*g[2][1]], g[3]];

    // Swizzle output axes
    if (a !== 'xyzw') {
      const t = mat4.create();
      swizzleMatrix(t, a);
      mat4.multiply(matrix, t, matrix);
    }

    // Then apply transform (so these are always relative to the world basis, not the internal basis)
    if (p || r || q || s) {
      const t = mat4.create();
      composeTransform(t, p, r, q, s);
      mat4.multiply(matrix, t, matrix);
    }

    // Swizzle active spherical axes
    let swizzle: string | null = null;
    if (on.slice(0, 3) !== 'xyz') {
      const order = invertBasis(swizzle = rotateBasis(toBasis(on), 2));
      const t = mat4.create();
      // Apply inverse spherical basis as part of view matrix (right multiply)
      swizzleMatrix(t, order);
      mat4.multiply(matrix, matrix, t);
      range = range.map((_, i) => range[order[i]]);
    }

    return [matrix, swizzle, origin, range, epsilon];
  }, [long, lat, zoom, a, g, p, r, q, s, bend]);

  const t = useShaderRef(matrix);

  const b = useShaderRef(bend);
  const o = useShaderRef(origin);
  const z = useShaderRef(zoom);
  const d = useShaderRef(radius);
  const c = useShaderRef(centered);
  const e = useShaderRef(epsilon);
  
  const bound = useBoundShader(getWebMercatorPosition, MERCATOR_BINDINGS, [t, b, o, z, d, c]);

  // Apply input basis as a cast
  const xform = useMemo(() => {
    if (!swizzle) return bound;
    return chainTo(swizzleTo('vec4<f32>', 'vec4<f32>', swizzle), bound);
  }, [bound, swizzle]);

  const [transform, differential] = useCombinedTransform(xform, null, e);

  const rangeMemo = useOne(() => range, JSON.stringify(range));

  return [
    signal(),
    provide(TransformContext, transform,
      provide(DifferentialContext, differential,
        provide(RangeContext, rangeMemo, children ?? [])
      )
    )
  ];
};

const projectMercator = ([long, lat]: [number, number]) => [long * toRad / π, Math.log(Math.tan(π/4 + lat * toRad / 2.0)) / π];
const unprojectMercator = ([x, y]: [number, number]) => [x / toRad * π, (Math.atan(Math.exp(y * π)) - π/4) / toRad * 2.0];