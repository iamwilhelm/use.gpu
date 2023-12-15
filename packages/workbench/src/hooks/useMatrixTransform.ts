import type { DataBounds, StorageSource, LambdaSource, TextureSource, TypedArray, UniformAttributeValue } from '@use-gpu/core';
import type { ShaderSource, ShaderModule } from '@use-gpu/shader';
import type { RefObject } from '@use-gpu/live';
import type { TransformContextProps, TransformBounds } from '../providers/transform-provider';
import type { MatrixRefs } from '../layers/types';

import { useCallback, useMemo, useOne, useVersion, useNoCallback, useNoMemo, useNoOne, useNoVersion } from '@use-gpu/live';
import { bundleToAttributes, getBundleKey } from '@use-gpu/shader/wgsl';
import { useMatrixContext, useNoMatrixContext } from '../providers/matrix-provider';
import { getBoundShader } from './useBoundShader';
import { getBoundSource } from './useBoundSource';

import { useCombinedTransform } from './useCombinedTransform';

import { vec3, mat3, mat4 } from 'gl-matrix';

import { getCartesianPosition } from '@use-gpu/wgsl/transform/cartesian.wgsl';
import { getMatrixDifferential } from '@use-gpu/wgsl/transform/diff-matrix.wgsl';

const NO_MATRIX = mat4.create();
const MATRIX_BINDINGS = bundleToAttributes(getCartesianPosition);

const TRANSFORM_BINDING = { name: 'getPosition', format: 'vec4<f32>', args: ['u32'], value: [0, 0, 0, 0] } as UniformAttributeValue;

export const useCombinedMatrix = (
  matrix?: mat4 | null,
  bounds?: TransformBounds | null,
): mat4 => {
  const parent = useMatrixContext();
  const version = useVersion(parent) + useVersion(matrix);

  return useOne(
    () => {
      if (!matrix) return parent;
      return parent ? mat4.multiply(mat4.create(), parent, matrix) : matrix;
    },
    version
  );
};

export const useNoCombinedMatrix = () => {
  useNoMatrixContext();
  useNoVersion();
  useNoVersion();
  useNoOne();
};

export const useMatrixTransform = (
  matrix?: mat4 | null,
  bounds?: TransformBounds | null,
): [
  TransformContextProps,
  MatrixRefs,
] => {
  const refs: RefObject<MatrixRefs> = useOne(() => ({
    matrix: {current: matrix ?? NO_MATRIX},
    normalMatrix: {current: mat3.create()},
  }));

  useOne(() => {
    const m = matrix ?? NO_MATRIX;
    refs.matrix.current = m;
    mat3.normalFromMat4(refs.normalMatrix.current, m);
  }, matrix);

  return useOne(() => {
    const boundMatrix = getBoundSource(MATRIX_BINDINGS[0], refs.matrix);

    const transform = getBoundShader(getCartesianPosition, [boundMatrix]);
    const differential = getBoundShader(getMatrixDifferential, [boundMatrix, refs.normalMatrix]);

    const key = getBundleKey(transform) ^ getBundleKey(differential);
    return [{key, transform, differential}, refs];
  });
};

export const useNoMatrixTransform = () => {
  useNoOne();
  useNoOne();
  useNoOne();
};

export const useMatrixBounds = (
  matrix: mat4,
  bounds?: TransformBounds | null,
): TransformBounds | null => {
  const refs = useOne(() => ({
    bounds: { center: vec3.create(), radius: 0, min: vec3.create(), max: vec3.create() } as DataBounds,
    matrix,
    scale3: vec3.create(),
    scale: 0,
  }));

  useOne(() => {
    const {scale3} = refs;
    mat4.getScaling(scale3, matrix);
    refs.matrix = matrix;
    refs.scale = Math.max(Math.abs(scale3[0]), Math.abs(scale3[1]), Math.abs(scale3[2]));
  }, matrix);

  const getBounds = useCallback((b: DataBounds) => {
    const {matrix, bounds, scale} = refs;
    vec3.transformMat4(bounds.center as any, b.center as any, matrix);
    bounds.radius = scale * b.radius;

    // Bounds checking is ephemeral so return same object every time
    return bounds;
  });

  return getBounds;
}

export const useNoMatrixBounds = () => {
  useNoOne();
  useNoOne();
  useNoCallback();
};
