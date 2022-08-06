import type { StorageSource, LambdaSource, TextureSource, TypedArray, UniformAttributeValue } from '@use-gpu/core';
import type { ShaderModule } from '@use-gpu/shader';

import { useOne, useVersion } from '@use-gpu/live';
import { makeShaderBinding } from '@use-gpu/core';
import { chainTo, sourceToModule, bindingToModule } from '@use-gpu/shader/wgsl';
import { useTransformContext } from '../providers/transform-provider';

const TRANSFORM_BINDING = { name: 'getPosition', format: 'vec4<f32>', args: ['u32'], value: [0, 0, 0, 0] } as UniformAttributeValue;

export const useApplyTransform = (
  positions?: StorageSource | LambdaSource | TextureSource | ShaderModule | TypedArray | number[] | {current: any},
) => {
  const transform = useTransformContext();
  const version = useVersion(positions) + useVersion(transform);

  return useOne(() => {
    if (transform == null) return positions;
    if (positions == null) return transform;
    
    const getPosition = sourceToModule(positions) ?? bindingToModule(makeShaderBinding(TRANSFORM_BINDING, positions));
    return chainTo(getPosition, transform);
  }, version);
};
