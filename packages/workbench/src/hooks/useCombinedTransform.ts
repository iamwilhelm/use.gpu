import { ArrowFunction } from '@use-gpu/live/types';
import { ShaderModule } from '@use-gpu/shader/types';

import { useOne, useVersion } from '@use-gpu/live';
import { useTransformContext } from '../providers/transform-provider';
import { chainTo } from '@use-gpu/shader/wgsl';
import { vec4 } from 'gl-matrix';

type XF = (pos: vec4) => vec4;
const IDENT = (pos: vec4) => pos;
const chain = (f: XF, g: XF) => (x: vec4) => g(f(x));

export const useCombinedTransform = (
  shader?: ShaderModule | null,
  apply?: (pos: vec4) => vec4 = IDENT,
) => {
  const context = useTransformContext();
  const version = useVersion(context) + useVersion(shader);

  return useOne(
    () => {
      if (!context) return shader;
      return shader
        ? chainTo(shader, context.shader)
        : context.shader;
    },
    version,
  );
};
