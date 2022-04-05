import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { UniformAttributeValue } from '@use-gpu/core/types';
import { VectorLike, Swizzle } from '../types';

import { use, provide, makeContext, useOptionalContext, useOne, useMemo } from '@use-gpu/live';
import { TransformContext } from '../../providers/transform-provider';
import { makeShaderBinding } from '@use-gpu/core';
import { bindBundle, bindingToModule, chainTo } from '@use-gpu/shader/wgsl';
import { parseAxes, parseMatrix, parsePosition, parseRotation, parseQuaternion, parseScale, parseRanges } from '../util/parse';
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

const useProp = <T>(value: T, parse: (t?: T) => T): T => useOne(() => value && parse(value), value);
const useRequiredProp = <T>(value: T, parse: (t?: T) => T): T => useOne(() => parse(value), value);

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
  
  const p = useProp(position, parsePosition);
  const s = useProp(scale, parseScale);
  const q = useProp(quaternion, parseQuaternion);
  const r = useProp(rotation, parseRotation);
  const m = useProp(matrix, parseMatrix);

  const g = useRequiredProp(range, parseRanges);
  const a = useRequiredProp(axes, parseAxes);
  // const e = parseEulerOrder(eulerOrder);

  const x = g[0].x;
  const y = g[1].x;
  const z = g[2].x;
  const dx = (g[0].y - x) || 1;
  const dy = (g[1].y - y) || 1;
  const dz = (g[2].y - z) || 1;

  const transform = mat4.create();
  mat4.set(transform,
    2/dx, 0, 0, -(2*x+dx)/dx,
    0, 2/dy, 0, -(2*y+dy)/dy,
    0, 0, 2/dz, -(2*z+dz)/dz,
    0, 0, 0, 1,
  );

  if (a !== 'xyzw') {
    const t = mat4.create();
    swizzleMatrix(t, a);
    mat4.multiply(transform, t, transform);
  }

  if (p || r || q || s) {
    const t = mat4.create();
    composeTransform(t, p, r, q, s);
    mat4.multiply(transform, transform, t);
  }

  const [bound, ref] = useMemo(() => {
    const ref = { current: m };
    const binding = {
      uniform: MATRIX_BINDING,
      constant: ref,
    };

    const getMatrix = bindingToModule(binding);
    const bound = bindBundle(getCartesianPosition, {getMatrix});

    return [bound, ref];      
  }, []);

  ref.current = transform;

  const {transform: parent} = useOptionalContext(TransformContext);
  const context = useOne(() => ({
    range: g,
    transform: parent ? chainTo(bound, parent) : bound,
  }), parent);

  return provide(TransformContext, context, children ?? []);
};
