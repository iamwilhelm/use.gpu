import type { StorageSource, UniformAttribute } from '@use-gpu/core';

import { useMemo, useOne } from '@use-gpu/live';
import { explode, structType, bindEntryPoint } from '@use-gpu/shader/wgsl';
import { getBoundShader } from './useBoundShader';
import { getBoundSource } from './useBoundSource';

const toTitleCase = (s: string) => s.slice(0, 1).toUpperCase() + s.slice(1);

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

  name = name ?? 'get' + uniforms.map(u => toTitleCase(u.name)).join('');

  const type = structType(uniforms, name);
  const bound = getBoundSource({name: name ?? 'storage', format: type, args: null}, source);
  const exploded = explode(type, bound);

  const sources = {};
  for (const {name} of uniforms) {
    sources[name] = bindEntryPoint(exploded, name);
  };

  return sources;
};

export const useStructAggregate = (
  aggregateBuffer: MultiAggregateBuffer,
) => {
  return useOne(() => getStructAggregate(aggregateBuffer), aggregateBuffer)
};

export const getStructAggregate = (
  aggregateBuffer: MultiAggregateBuffer,
) => {
  const {layout: {attributes}, source} = aggregateBuffer;
  const sources = getStructSources(attributes, source);
  return sources;
};

