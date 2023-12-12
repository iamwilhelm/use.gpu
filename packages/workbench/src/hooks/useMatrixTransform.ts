import type { DataBounds, StorageSource, LambdaSource, TextureSource, TypedArray, UniformAttributeValue } from '@use-gpu/core';
import type { ShaderSource, ShaderModule } from '@use-gpu/shader';
import type { Ref } from '@use-gpu/live';
import type { TransformContextProps, TransformBounds } from '../providers/transform-provider';

import { useCallback, useFiber, useOne, useVersion, useNoCallback, useNoOne, useNoVersion } from '@use-gpu/live';
import { makeShaderBinding } from '@use-gpu/core';
import { bundleToAttributes } from '@use-gpu/shader/wgsl';
import { useTransformContext, useNoTransformContext } from '../providers/transform-provider';
import { getBoundShader } from './useBoundShader';
import { getBoundSource } from './useBoundSource';
import { scrambleBits53, mixBits53 } from '@use-gpu/state';

import { vec3, mat3, mat4 } from 'gl-matrix';

import { getCartesianPosition } from '@use-gpu/wgsl/transform/cartesian.wgsl';
import { getMatrixDifferential } from '@use-gpu/wgsl/transform/diff-matrix.wgsl';

const MATRIX_BINDINGS = bundleToAttributes(getCartesianPosition);

const TRANSFORM_BINDING = { name: 'getPosition', format: 'vec4<f32>', args: ['u32'], value: [0, 0, 0, 0] } as UniformAttributeValue;

export const useCombinedMatrixTransform = (
  matrix?: mat4 | null,
): TransformContextProps => {
  const context = useTransformContext();
  const {matrix: parent} = context;

  const {id} = useFiber();
  const normalMatrix = useOne(() => mat3.create());
  const version = useVersion(parent) + useVersion(matrix);

  return useOne(
    () => {
      if (!matrix) return context;

      const m = parent ? mat4.multiply(mat4.create(), parent, matrix) : matrix;
      mat3.normalFromMat4(normalMatrix, m);

      const key = scrambleBits53(mixBits53(context.key, id));
      return {...context, key, matrix: m, normalMatrix};
    },
    version
  );
};

export const useNoCombinedMatrixTransform = () => {
  useNoOne();
  useNoVersion();
  useNoVersion();
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
    return bounds;
  });

  return getBounds;
}

export const useNoMatrixBounds = () => {
  useNoOne();
  useNoOne();
  useNoCallback();
};

export const useMatrixTransform = (
  matrix: mat4,
  bounds?: TransformBounds | null,
): {
  transform: ShaderSource | null,
  differential: ShaderSource | null,
} => {
  const refs = useOne(() => ({
    matrix: {current: matrix},
    normalMatrix: {current: mat3.create()},
  }));

  useOne(() => {
    refs.matrix = matrix;
    mat3.normalFromMat4(refs.normalMatrix, matrix);
  }, matrix);

  return useOne(() => {
    const boundMatrix = getBoundSource(MATRIX_BINDINGS[0], refs.matrix);

    const transform = getBoundShader(getCartesianPosition, [boundMatrix]);
    const differential = getBoundShader(getMatrixDifferential, [boundMatrix, refs.normalMatrix]);

    return {transform, differential};
  });
};

export const useNoMatrixTransform = () => {
  useNoOne();
  useNoOne();
  useNoOne();
};
