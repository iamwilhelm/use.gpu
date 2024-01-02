import type { StorageSource, UniformAttribute } from '@use-gpu/core';

import { useMemo } from '@use-gpu/live';
import { chainTo, instanceWith, bindEntryPoint } from '@use-gpu/shader/wgsl';
import { getShader } from './useShader';
import { getSource } from './useSource';
import { getStructAggregate } from './useStructSources';
import { getLambdaSource } from './useLambdaSource';

const NO_AGGREGATE: Record<string, StorageSource> = {};
const INDEX = {
  u16: {name: 'instances', format: 'u16'},
  u32: {name: 'instances', format: 'u32'},
};

export const useInstancedSources = (
  uniforms: UniformAttribute[],
  index: UniformAttribute,
  values: Record<string, StorageSource>,
  indices: StorageSource,
) => (
  useMemo(() => getInstancedSources(uniforms, index, values, indices), [uniforms, index, values, indices])
);

export const getInstancedSources = (
  uniforms: UniformAttribute[],
  index: UniformAttribute,
  values: Record<string, StorageSource>,
  indices: StorageSource,
) => {
  const boundValues = uniforms.map((uniform) => getSource(uniform, values[uniform.name]));
  const boundIndices = getSource(index, indices);

  const instances = instanceWith(boundValues, boundIndices);

  const sources = {};
  for (const {name} of uniforms) {
    sources[name] = getLambdaSource(bindEntryPoint(instances, name), indices);
  };

  return [sources, instances];
};

export const useInstancedAggregate = (
  aggregateBuffer: MultiAggregateBuffer,
  instances?: StorageSource,
  format?: 'u16' | 'u32',
) => {
  return useMemo(() => getInstancedAggregate(aggregateBuffer, instances, format), [aggregateBuffer, instances, format]);
};

export const getInstancedAggregate = (
  aggregateBuffer: MultiAggregateBuffer,
  instances?: StorageSource,
  format: 'u16' | 'u32' = 'u32',
) => {
  const sources = getStructAggregate(aggregateBuffer);
  if (!instances) return sources;

  const {layout: {attributes}} = aggregateBuffer;
  const [instanced, loadInstance] = getInstancedSources(attributes, INDEX[format], sources, instances.source);
  instanced.instances = loadInstance;

  return instanced;
};

export const combineInstances = (
  a?: Record<string, StorageSource>,
  b?: Record<string, StorageSource>,
) => {
  const {instances: ai} = a ?? NO_AGGREGATE;
  const {instances: bi} = b ?? NO_AGGREGATE;

  return ai && bi ? {
    ...a,
    ...b,
    instances: chainTo(ai, bi),
  } : {
    ...a,
    ...b,
  };
};
