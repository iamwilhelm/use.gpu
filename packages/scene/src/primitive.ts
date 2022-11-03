import type { LiveComponent, PropsWithChildren } from '@use-gpu/live';
import type { DataBounds } from '@use-gpu/core';

import { memo, provide, useCallback, useOne } from '@use-gpu/live';
import { bundleToAttributes } from '@use-gpu/shader/wgsl';
import { vec3, mat3, mat4 } from 'gl-matrix';

import {
  TransformContext, DifferentialContext,
  useShaderRef, useBoundShader, useCombinedTransform,
 } from '@use-gpu/workbench';

import { useMatrixContext, MatrixContext } from './providers/matrix-provider';

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
  const [normalMatrix, matrixScale] = useOne(() => {
    const normalMatrix = mat3.normalFromMat4(mat3.create(), matrix);

    const s = mat4.getScaling(vec3.create(), matrix);
    const matrixScale = Math.max(Math.abs(s[0]), Math.abs(s[1]), Math.abs(s[2]));

    return [normalMatrix, matrixScale];
  }, matrix);

  const matrixRef = useShaderRef(matrix);
  const normalMatrixRef = useShaderRef(normalMatrix);
  const matrixScaleRef = useShaderRef(matrixScale);

  const boundPosition = useBoundShader(getCartesianPosition, MATRIX_BINDINGS, [matrixRef]);
  const boundDifferential = useBoundShader(getMatrixDifferential, NORMAL_BINDINGS, [matrixRef, normalMatrixRef]);

  const cullBounds = useOne(() => ({ center: [], radius: 0, min: [], max: [] } as DataBounds));
  const getBounds = useCallback((bounds: DataBounds) => {
    vec3.transformMat4(cullBounds.center, bounds.center, matrixRef.current);
    cullBounds.radius = matrixScaleRef.current * bounds.radius;
    return cullBounds;
  });

  const context = useCombinedTransform(boundPosition, boundDifferential, getBounds);

  return (
    provide(TransformContext, context, children)
  );
}, 'Primitive');
