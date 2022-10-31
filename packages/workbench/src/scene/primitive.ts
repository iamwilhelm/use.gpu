import type { LiveComponent, PropsWithChildren } from '@use-gpu/live';
import { memo, provide, useOne } from '@use-gpu/live';
import { bundleToAttributes } from '@use-gpu/shader/wgsl';
import { mat3, mat4 } from 'gl-matrix';

import { TransformContext, DifferentialContext } from '../providers/transform-provider';
import { useShaderRef } from '../hooks/useShaderRef';
import { useBoundShader } from '../hooks/useBoundShader';
import { useCombinedTransform } from '../hooks/useCombinedTransform';

import { useMatrixContext, MatrixContext } from '../providers/matrix-provider';

import { getCartesianPosition } from '@use-gpu/wgsl/transform/cartesian.wgsl';
import { getMatrixDifferential } from '@use-gpu/wgsl/transform/diff-matrix.wgsl';

const MATRIX_BINDINGS = bundleToAttributes(getCartesianPosition);
const NORMAL_BINDINGS = bundleToAttributes(getMatrixDifferential);

export type PrimitiveProps = {
  _?: number,
};

export const Primitive: LiveComponent<PrimitiveProps> = memo((props: PropsWithChildren<PrimitiveProps>) => {
  const {children} = props;

  const matrix = useMatrixContext();
  const normalMatrix = useOne(() => mat3.normalFromMat4(mat3.create(), matrix), matrix);

  const matrixRef = useShaderRef(matrix);
  const normalMatrixRef = useShaderRef(normalMatrix);

  const boundPosition = useBoundShader(getCartesianPosition, MATRIX_BINDINGS, [matrixRef]);
  const boundDifferential = useBoundShader(getMatrixDifferential, NORMAL_BINDINGS, [matrixRef, normalMatrixRef]);

  const [transform, differential] = useCombinedTransform(boundPosition, boundDifferential);

  return (
    provide(TransformContext, transform,
      provide(DifferentialContext, differential, children)
    )
  );
}, 'Primitive');
