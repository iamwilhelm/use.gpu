import type { UniformAttribute, UniformAttributeValue } from '@use-gpu/core';
import type { ShaderSource, ShaderModule } from '@use-gpu/shader';

import { useOne, useMemo, useNoMemo, useVersion } from '@use-gpu/live';
import { makeShaderBinding } from '@use-gpu/core';
import { bindingToModule, bundleToAttribute } from '@use-gpu/shader/wgsl';

type Ref<T> = { current: T };

const NO_SOURCES: any[] = [];

// Turn a shader source/constant/lambda into a virtual shader module
export const useSource = <T = any>(
  def: UniformAttribute | UniformAttributeValue,
  source: ShaderSource | T,
) => {
  return useMemo(() => getSource(def, source), [def, source]);
}

// Turn a shader source/constant/lambda into a virtual shader module
export const getSource = <T = any>(
  def: UniformAttribute | UniformAttributeValue,
  source: ShaderSource | T,
) => {
  const s = source as any;
  let shader;

  // ParsedBundle | ParsedModule
  if (s.module || s.table) shader = s as ShaderModule;

  // LambdaSource
  if (s.shader) shader = s.shader;

  // If shader return type matches, bind directly, otherwise make a binding with a cast
  if (shader) {
    const {format} = bundleToAttribute(shader);
    if (format === def.format) return shader;
    console.warn(format, def.format)
  }

  const binding = makeShaderBinding<ShaderModule>(def, s);
  return bindingToModule(binding);
};

export const useNoSource = useNoMemo;

