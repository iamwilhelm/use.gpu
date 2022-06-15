import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { UniformAttributeValue } from '@use-gpu/core/types';
import { AxesTrait, ObjectTrait, Swizzle } from '../types';

import { use, provide, useContext, useOne, useMemo } from '@use-gpu/live';
import { bundleToAttributes, chainTo } from '@use-gpu/shader/wgsl';

import { TransformContext } from '../../providers/transform-provider';
import { RangeContext } from '../../providers/range-provider';
import { useShaderRef } from '../../hooks/useShaderRef';
import { useBoundShader } from '../../hooks/useBoundShader';
import { useCombinedTransform } from '../../hooks/useCombinedTransform';
import { composeTransform } from '../util/compose';
import { recenterAxis } from '../util/axis';
import { swizzleMatrix } from '../util/swizzle';
import { mat4 } from 'gl-matrix';

import { parseMatrix, parsePosition, parseRotation, parseQuaternion, parseScale } from '../../traits/parse';
import { useAxesTrait, useObjectTrait } from '../traits';

import { getSphericalPosition } from '@use-gpu/wgsl/transform/spherical.wgsl';

const POLAR_BINDINGS = bundleToAttributes(getSphericalPosition);

export type SphericalProps = Partial<AxesTrait> & Partial<ObjectTrait> & {
  bend?: number,
  helix?: number,

  children?: LiveElement<any>,
};

export const Spherical: LiveComponent<SphericalProps> = (props) => {
  const {
    bend = 1,
    helix = 0,
    children,
  } = props;

  const {range: g, axes: a} = useAxesTrait(props);
  const {position: p, scale: s, quaterion: q, rotation: r, matrix: m} = useObjectTrait(props);

  const [focus, aspectX, aspectY, scaleY, matrix, range] = useMemo(() => {
    const x = g[0][0];
    let   y = g[1][0];
    let   z = g[2][0];
    const dx = (g[0][1] - x) || 1;
    let   dy = (g[1][1] - y) || 1;
    let   dz = (g[2][1] - z) || 1;
    const sx = s[0];
    const sy = s[1];
    const sz = s[2];

    // Watch for negative scales.
    const idx = dx > 0 ? 1 : -1;
    const idy = dy > 0 ? 1 : -1;

    // Recenter viewport on origin the more it's bent
    [y, dy] = recenterAxis(y, dy, bend);
    [z, dz] = recenterAxis(z, dz, bend);

    // Adjust viewport range for spherical transform.
    // As the viewport goes spherical, the X/Y-ranges are interpolated to the Z-range,
    // creating a perfectly spherical viewport.
    const adz = Math.abs(dz);
    const fdx = dx + (adz * idx - dx) * bend;
    const fdy = dy + (adz * idy - dy) * bend;
    const sdx = fdx / sx;
    const sdy = fdy / sz;
    const sdz = dz  / sz;
    
    const aspectX = Math.abs(sdx / sdz);
    const aspectY = Math.abs(sdy / sdz / aspectX);

    // Scale Y coordinates before transforming, but cap at aspectY/alpha to prevent from poking through the poles mid-transform.
    // Factor of 2 due to the fact that in the Y direction we only go 180º from pole to pole.
    const aspectZ = dy / dx * sx / sy * 2
    const scaleY = Math.min(aspectY / bend, 1 + (aspectZ - 1) * bend);

    const focus = bend > 0 ? 1 / bend - 1 : 0;

    const matrix = mat4.create();
    mat4.set(matrix,
      2/fdx, 0, 0, 0,
      0, 2/fdy, 0, 0,
      0,  0, 2/dz, 0,

      -(2*x+dx)/dx,
      -(2*y+dy)/dy,
      -(2*z+dz)/dz,
      1,
    );

    if (a !== 'xyzw') {
      const t = mat4.create();
      swizzleMatrix(t, a);
      mat4.multiply(matrix, matrix, t);
    }

    if (p || r || q || s) {
      const t = mat4.create();
      composeTransform(t, p, r, q, s);
      mat4.multiply(matrix, t, matrix);
    }

    const range = g.slice();
    if (bend > 0) {
      const [from, to] = range[2];
      const max = Math.max(Math.abs(from), Math.abs(to));
      const min = Math.max(-focus / aspectX, from);
      range[2] = [min, max];
    }

    return [focus, aspectX, aspectY, scaleY, matrix, range];
  }, [g, a, p, r, q, s, bend, helix]);

  const b = useShaderRef(bend);
  const f = useShaderRef(focus);
  const u = useShaderRef(aspectX);
  const v = useShaderRef(aspectY);
  const c = useShaderRef(scaleY);
  const t = useShaderRef(matrix);

  const bound = useBoundShader(getSphericalPosition, POLAR_BINDINGS, [b, f, u, v, c, t]);
  const transform = useCombinedTransform(bound);

  return (
    provide(TransformContext, transform,
      provide(RangeContext, range, children ?? [])
    )
  );
};
