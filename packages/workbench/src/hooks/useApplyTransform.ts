import type { DataBounds, StorageSource, LambdaSource, TextureSource, TypedArray, UniformAttributeValue } from '@use-gpu/core';
import type { ShaderSource, ShaderModule } from '@use-gpu/shader';
import type { TransformBounds } from '../providers/transform-provider';
import type { Ref } from '@use-gpu/live';

import { useOne, useVersion, useNoOne, useNoVersion } from '@use-gpu/live';
import { makeShaderBinding } from '@use-gpu/core';
import { chainTo, sourceToModule, bindingToModule } from '@use-gpu/shader/wgsl';
import { useTransformContext, useNoTransformContext } from '../providers/transform-provider';
import { useScissorContext, useNoScissorContext } from '../providers/scissor-provider';

import { chainTransform } from './useCombinedTransform';
import { useMatrixBounds, useNoMatrixBounds, useMatrixTransform, useNoMatrixTransform } from './useMatrixTransform';

import { mat3 } from 'gl-matrix';

const TRANSFORM_BINDING = { name: 'getPosition', format: 'vec4<f32>', args: ['u32'], value: [0, 0, 0, 0] } as UniformAttributeValue;

export const useApplyTransform = (
  positions?: StorageSource | LambdaSource | TextureSource | ShaderModule | Ref<TypedArray | number[]> | (() => TypedArray | number[]) | null,
): {
  positions: ShaderSource | null,
  scissor: ShaderSource | null,
  bounds: TransformBounds | null,
} => {
  const context = useTransformContext();
  const scissor = useScissorContext();
  
  const {matrix, transform, bounds} = context;
  const version = useVersion(matrix) + useVersion(positions) + useVersion(transform) + useVersion(scissor) + useVersion(bounds);

  const matrixBounds = matrix && bounds ? useMatrixBounds(matrix) : useNoMatrixBounds();
  const matrixTransform = matrix ? useMatrixTransform(matrix, matrixBounds) : useNoMatrixTransform();

  return useOne(() => {
    if (positions == null) return {
      positions: null,
      scissor: null,
      bounds: null
    };

    const getPosition = sourceToModule(positions) ?? bindingToModule(makeShaderBinding(TRANSFORM_BINDING, positions));
    if (matrix == null && transform == null && scissor == null) return {
      positions: getPosition,
      scissor: null,
      bounds,
    };

    let xform = context;
    if (matrixTransform) xform = chainTransform(matrixTransform, xform);

    return {
      positions: xform?.transform ? chainTo(getPosition, xform.transform) : getPosition,
      scissor: scissor ? chainTo(getPosition, scissor) : null,
      bounds,
    };
  }, version);
};

export const useNoApplyTransform = () => {
  useNoTransformContext();
  useNoScissorContext();
  useNoVersion();
  useNoVersion();
  useNoVersion();
  useNoVersion();
  useNoVersion();
  useNoMatrixBounds();
  useNoMatrixTransform();
  useNoOne();
};
