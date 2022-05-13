import { UniformAttribute, UniformAttributeValue } from '@use-gpu/core/types';
import { ShaderSource, ShaderModule } from '@use-gpu/shader/types';

import { useOne, useMemo, useVersion } from '@use-gpu/live';
import { makeShaderBinding } from '@use-gpu/core';
import { bindingToModule } from '@use-gpu/shader/wgsl';

type Ref<T> = { current: T };

const NO_SOURCES: any[] = [];

// Turn a shader source/constant/lambda into a virtual shader module
export const useBoundSource = <T = any>(
  def: UniformAttribute | UniformAttributeValue,
  source: ShaderSource | T,
) => {
  return useMemo(() => {
    const s = source as any;

    // ParsedBundle | ParsedModule
    if (s.module || s.table) return s;

    // LambdaSource
    if (s.shader) return s.shader;

    const binding = makeShaderBinding<ShaderModule>(def, s);
    return bindingToModule(binding);
  }, [source, def]);
}
