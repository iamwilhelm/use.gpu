import { ShaderModule } from '@use-gpu/shader/types';

import { useOne, useVersion } from '@use-gpu/live';
import { useTransformContext } from '../providers/transform-provider';
import { chainTo } from '@use-gpu/shader/wgsl';

export const useCombinedTransform = (
  shader?: ShaderModule | null,
) => {
  const transform = useTransformContext();
  const version = useVersion(transform) + useVersion(shader);

  return useOne(
    () => transform && shader ? chainTo(shader, transform) : transform ?? shader,
    version,
  );
};
