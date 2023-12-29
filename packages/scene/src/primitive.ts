import type { LiveComponent, PropsWithChildren } from '@use-gpu/live';
import type { DataBounds } from '@use-gpu/core';

import { memo, provide, useCallback, useOne } from '@use-gpu/live';
import { bundleToAttributes } from '@use-gpu/shader/wgsl';
import { vec3, mat3, mat4 } from 'gl-matrix';

import { MatrixContext, TransformContext, useMatrixContext, useCombinedMatrixTransform } from '@use-gpu/workbench';

import { getCartesianPosition } from '@use-gpu/wgsl/transform/cartesian.wgsl';
import { getMatrixDifferential } from '@use-gpu/wgsl/transform/diff-matrix.wgsl';

const MATRIX_BINDING = bundleToAttributes(getCartesianPosition, 'getTransformMatrix')[0];

export type PrimitiveProps = {
  _?: number,
};

export const Primitive: LiveComponent<PrimitiveProps> = memo((props: PropsWithChildren<PrimitiveProps>) => {
  const {children} = props;

  const [context] = useCombinedMatrixTransform();

  return (
    provide(TransformContext, context, children)
  );
}, 'Primitive');
