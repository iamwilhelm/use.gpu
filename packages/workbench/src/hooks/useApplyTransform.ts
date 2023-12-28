import type { DataBounds, StorageSource, LambdaSource, TextureSource, TypedArray, UniformAttribute } from '@use-gpu/core';
import type { ShaderSource, ShaderModule } from '@use-gpu/shader';
import type { TransformBounds } from '../providers/transform-provider';
import type { Ref } from '@use-gpu/live';

import { useOne, useVersion, useNoOne, useNoVersion } from '@use-gpu/live';
import { chainTo } from '@use-gpu/shader/wgsl';
import { getSource } from '../hooks/useSource';
import { useTransformContext, useNoTransformContext } from '../providers/transform-provider';
import { useScissorContext, useNoScissorContext } from '../providers/scissor-provider';

import { chainTransform } from './useCombinedTransform';
import { useMatrixBounds, useNoMatrixBounds, useMatrixTransform, useNoMatrixTransform } from './useMatrixTransform';

import { mat3 } from 'gl-matrix';

const TRANSFORM_BINDING = { name: 'getPosition', format: 'vec4<f32>', args: ['u32'] } as UniformAttribute;

export const useApplyTransform = (
  positions?: StorageSource | LambdaSource | TextureSource | ShaderModule | Ref<TypedArray | number[]> | (() => TypedArray | number[]) | null,
): {
  positions: ShaderSource | null,
  scissor: ShaderSource | null,
  bounds: TransformBounds | null,
} => {
  const context = useTransformContext();
  const scissor = useScissorContext();

  const {transform, bounds} = context;
  const version = useVersion(positions) + useVersion(transform) + useVersion(scissor) + useVersion(bounds);

  return useOne(() => {
    if (positions == null) return {
      positions: null,
      scissor: null,
      bounds: null
    };

    const getPosition = getSource(TRANSFORM_BINDING, positions);
    if (transform == null && scissor == null) return {
      positions: getPosition,
      scissor: null,
      bounds,
    };

    let xform = context;
    return {
      positions: transform ? chainTo(getPosition, transform) : getPosition,
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
