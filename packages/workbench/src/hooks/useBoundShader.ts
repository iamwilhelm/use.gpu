import type { UniformAttribute, UniformAttributeValue } from '@use-gpu/core';
import type { ShaderModule } from '@use-gpu/shader';

import { useOne, useMemo, useNoMemo } from '@use-gpu/live';
import { makeShaderBindings } from '@use-gpu/core';
import { bindingsToLinks, bindBundle, bundleToAttributes } from '@use-gpu/shader/wgsl';

type Ref<T> = { current: T };

const NO_SOURCES: any[] = [];

// Bind shader sources/constants/lambdas to a loaded shader module
export const useBoundShader = (
  shader: ShaderModule,
  values: any[],
  defines?: Record<string, any>,
) => {
  return useMemo(() => getBoundShader(shader, values, defines), [shader, ...values, defines]);
}

export const getBoundShader = (
  shader: ShaderModule,
  values: any[],
  defines?: Record<string, any>,
) => {
  let attributes = (shader as any).attributes;
  if (!attributes) attributes = (shader as any).attributes = bundleToAttributes(shader);
  
  const bindings = makeShaderBindings<ShaderModule>(attributes, values);
  const links = bindingsToLinks(bindings);
  return bindBundle(shader, links, defines);
}

export const useNoBoundShader = useNoMemo;
