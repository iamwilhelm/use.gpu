import type { StorageSource, LambdaSource, TextureSource, TypedArray, UniformAttributeValue } from '@use-gpu/core';
import type { ShaderModule } from '@use-gpu/shader';

import { useOne, useVersion, useNoOne, useNoVersion } from '@use-gpu/live';
import { makeShaderBinding } from '@use-gpu/core';
import { chainTo, sourceToModule, bindingToModule } from '@use-gpu/shader/wgsl';
import { useTransformContext, useNoTransformContext } from '../providers/transform-provider';
import { useScissorContext, useNoScissorContext } from '../providers/scissor-provider';

const TRANSFORM_BINDING = { name: 'getPosition', format: 'vec4<f32>', args: ['u32'], value: [0, 0, 0, 0] } as UniformAttributeValue;

export const useApplyTransform = (
  positions?: StorageSource | LambdaSource | TextureSource | ShaderModule | TypedArray | number[] | {current: any},
) => {
  const {transform, bounds} = useTransformContext();
  const scissor = useScissorContext();
  const version = useVersion(positions) + useVersion(transform) + useVersion(scissor);

  return useOne(() => {
    if (positions == null) return [null, null];
    if (transform == null && scissor == null) return [positions, null, bounds];

    const getPosition = sourceToModule(positions) ?? bindingToModule(makeShaderBinding(TRANSFORM_BINDING, positions));
    return [
      transform ? chainTo(getPosition, transform) : getPosition,
      scissor ? chainTo(getPosition, scissor) : null,
      bounds,
    ];
  }, version);
};

export const useNoApplyTransform = () => {
  useNoTransformContext();
  useNoScissorContext();
  useNoVersion();
  useNoVersion();
  useNoVersion();
  useNoOne();
};
