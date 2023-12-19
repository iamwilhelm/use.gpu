import type { StorageSource, UniformAttribute } from '@use-gpu/core';

import { useMemo } from '@use-gpu/live';
import { explode, structType, bindEntryPoint } from '@use-gpu/shader/wgsl';
import { getBoundShader } from './useBoundShader';
import { getBoundSource } from './useBoundSource';

export const useStructSources = (
  uniforms: UniformAttribute[],
  source: StorageSource,
  name?: string,
) => (
  useMemo(() => getStructSources(uniforms, source, name), [uniforms, source, name])
);

export const getStructSources = (
  uniforms: UniformAttribute[],
  source: StorageSource,
  name?: string,
) => {
  
  const type = structType(uniforms, name);
  const bound = getBoundSource({name: 'storage', format: type, args: null}, source);
  const exploded = explode(type, bound);

  const sources = {};
  for (const {name} of uniforms) {
    sources[name] = bindEntryPoint(exploded, name);
  };

  return sources;
};
