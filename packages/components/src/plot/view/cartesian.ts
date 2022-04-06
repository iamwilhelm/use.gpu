import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { UniformAttributeValue } from '@use-gpu/core/types';
import { VectorLike, Swizzle } from '../types';

import { use, provide, useContext, useOne, useMemo } from '@use-gpu/live';
import { makeRefBinding } from '@use-gpu/core';
import { bindBundle, bindingToModule, chainTo } from '@use-gpu/shader/wgsl';

import { TransformContext } from '../../providers/transform-provider';
import { parseAxes, parseMatrix, parsePosition, parseRotation, parseQuaternion, parseScale, parseRanges } from '../util/parse';
import { useOptional, useRequired } from '../prop';
import { composeTransform } from '../util/compose';
import { swizzleMatrix } from '../util/swizzle';
import { mat4 } from 'gl-matrix';

import { getCartesianPosition } from '@use-gpu/wgsl/transform/cartesian.wgsl';

const MATRIX_BINDING = { name: 'getMatrix', format: 'mat4x4<f32>', value: mat4.create() };

export type CartesianProps = {
  range?: VectorLike[],
  axes?: Swizzle,

  position?:   VectorLike
  quaternion?: VectorLike,
  rotation?:   VectorLike,
  scale?:      VectorLike,
  matrix?:     VectorLike,
  // eulerOrder?: string,

  children?: LiveElement<any>,
};

export const Cartesian: LiveComponent<CartesianProps> = (props) => {
  const {
    position,
    scale,
    quaternion,
    rotation,
    matrix,

    range,
    axes,
  //eulerOrder,
  
    children,
  } = props;

  const p = useOptional(position, parsePosition);
  const s = useOptional(scale, parseScale);
  const q = useOptional(quaternion, parseQuaternion);
  const r = useOptional(rotation, parseRotation);
  const m = useOptional(matrix, parseMatrix);

  const g = useRequired(range, parseRanges);
  const a = useRequired(axes, parseAxes);
  // const e = parseEulerOrder(eulerOrder);

  const combined = useMemo(() => {
    const x = g[0][0];
    const y = g[1][0];
    const z = g[2][0];
    const dx = (g[0][1] - x) || 1;
    const dy = (g[1][1] - y) || 1;
    const dz = (g[2][1] - z) || 1;

    const matrix = mat4.create();
    mat4.set(matrix,
      2/dx, 0, 0, -(2*x+dx)/dx,
      0, 2/dy, 0, -(2*y+dy)/dy,
      0, 0, 2/dz, -(2*z+dz)/dz,
      0, 0, 0, 1,
    );

    if (a !== 'xyzw') {
      const t = mat4.create();
      swizzleMatrix(t, a);
      mat4.multiply(matrix, t, matrix);
    }

    if (p || r || q || s) {
      const t = mat4.create();
      composeTransform(t, p, r, q, s);
      mat4.multiply(matrix, matrix, t);
    }

    return matrix;
  }, [g, a, p, r, q, s]);

  const {transform: parent} = useContext(TransformContext);

  const [transform, ref] = useMemo(() => {
    const ref = { current: combined };

    const binding = makeRefBinding(MATRIX_BINDING, ref);
    const getMatrix = bindingToModule(binding);
    const bound = bindBundle(getCartesianPosition, {getMatrix});
    const transform = parent ? chainTo(bound, parent) : bound;

    return [transform, ref];
  }, [parent]);

  ref.current = combined;

  const context = useMemo(() => ({
    range: g,
    transform,
  }), [g, transform]);

  return provide(TransformContext, context, children ?? []);
};
