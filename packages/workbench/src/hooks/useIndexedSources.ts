import type { StorageSource, UniformAttribute } from '@use-gpu/core';

import { useMemo } from '@use-gpu/live';
import { indexWith, bindEntryPoint } from '@use-gpu/shader/wgsl';
import { getBoundShader } from './useBoundShader';
import { getBoundSource } from './useBoundSource';

export const useIndexedSources = (
  uniforms: UniformAttribute[],
  index: UniformAttribute,
  values: Record<string, StorageSource>,
  indices: StorageSource,
) => (
  useMemo(() => getIndexedSources(uniforms, index, values, indices), [uniforms, index, values, indices])
);

export const getIndexedSources = (
  uniforms: UniformAttribute[],
  index: UniformAttribute,
  values: Record<string, StorageSource>,
  indices: StorageSource,
) => {

  const boundValues = uniforms.map((uniform) => getBoundSource(uniform, values[uniform.name]));
  const boundIndices = getBoundSource(index, values[index.name]);

  const indexed = indexWith(boundValues, boundIndices);
  const loadInstance = getBoundShader(indexed, boundValues);

  const sources = {};
  for (const {name} of uniforms) {
    sources[name] = bindEntryPoint(loadInstance, name);
  };

  return [loadInstance, sources];
};
