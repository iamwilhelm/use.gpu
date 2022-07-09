import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { AxesTrait, ObjectTrait, Axis, Swizzle } from '../types';

import { use, provide, useContext, useOne, useMemo } from '@use-gpu/live';
import { bundleToAttributes, chainTo, swizzleTo } from '@use-gpu/shader/wgsl';

import { TransformContext } from '../../providers/transform-provider';
import { RangeContext } from '../../providers/range-provider';
import { useShaderRef } from '../../hooks/useShaderRef';
import { useBoundShader } from '../../hooks/useBoundShader';
import { useCombinedTransform } from '../../hooks/useCombinedTransform';
import { composeTransform } from '../util/compose';
import { recenterAxis } from '../util/axis';
import { swizzleMatrix, toBasis, rotateBasis, invertBasis } from '../util/swizzle';
import { mat4 } from 'gl-matrix';

import { parseMatrix, parsePosition, parseRotation, parseQuaternion, parseScale } from '../../traits/parse';
import { useAxesTrait, useObjectTrait } from '../traits';

import { getStereographicPosition } from '@use-gpu/wgsl/transform/stereographic.wgsl';

const STEREOGRAPHIC_BINDINGS = bundleToAttributes(getStereographicPosition);

export type StereographicProps = Partial<AxesTrait> & Partial<ObjectTrait> & {
  bend?: number,
  normalize?: number | boolean,
  on?: Axis,

  children?: LiveElement<any>,
};

export const Stereographic: LiveComponent<StereographicProps> = (props) => {
  const {
    on = 'z',
    bend = 1,
    normalize = 1,
    children,
  } = props;

  const {range: g, axes: a} = useAxesTrait(props);
  const {position: p, scale: s, quaterion: q, rotation: r, matrix: m} = useObjectTrait(props);

  const [matrix, swizzle] = useMemo(() => {
    const x = g[0][0];
    const y = g[1][0];
    let   z = g[2][0];
    const dx = (g[0][1] - x) || 1;
    const dy = (g[1][1] - y) || 1;
    let   dz = (g[2][1] - z) || 1;

    // Make scale adjustments relative to inverse swizzled output scale
    const inv = invertBasis(a);
    const sx = s ? s[inv.indexOf('x')] : 1;
    const sy = s ? s[inv.indexOf('y')] : 1;
    const sz = s ? s[inv.indexOf('z')] : 1;

    // Recenter viewport on origin the more it's bent
    [z, dz] = recenterAxis(z, dz, bend, 1);

    const matrix = mat4.create();
    mat4.set(matrix,
      2/dx, 0, 0, 0,
      0, 2/dy, 0, 0,
      0, 0, 2/dz, 0,

      -(2*x+dx)/dx,
      -(2*y+dy)/dy,
      -(2*z+dz)/dz,
      1,
    );

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

    // Swizzle active polar axis
    let swizzle: string | null = null;
    if (on !== 'z') {
      const order = swizzle = rotateBasis(toBasis(on), 2);
      const t = mat4.create();
      // Apply inverse polar basis as part of view matrix (right multiply)
      swizzleMatrix(t, invertBasis(order));
      mat4.multiply(matrix, matrix, t);
    }

    return [matrix, swizzle];
  }, [g, a, p, r, q, s, bend]);

  const b = useShaderRef(bend);
  const n = useShaderRef(+normalize);
  const t = useShaderRef(matrix);
  
  const bound = useBoundShader(getStereographicPosition, STEREOGRAPHIC_BINDINGS, [b, n, t]);

  // Apply input basis as a cast
  const position = useMemo(() => {
    if (!swizzle) return bound;
    return chainTo(swizzleTo('vec4<f32>', 'vec4<f32>', swizzle), bound);
  }, [bound, swizzle]);

  const transform = useCombinedTransform(position);

  return (
    provide(TransformContext, transform,
      provide(RangeContext, g, children ?? [])
    )
  );
};
