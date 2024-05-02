import type { StorageSource, LambdaSource, UniformAttribute, StructAggregateBuffer } from '@use-gpu/core';

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
const NO_SIZE = {size: [0], length: 0};

export const useInstancedSources = (
  uniforms: UniformAttribute[],
  index: UniformAttribute,
  values: Record<string, StorageSource>,
  indices?: StorageSource | null,
) => (
  useMemo(() => getInstancedSources(uniforms, index, values, indices), [uniforms, index, values, indices])
);

export const getInstancedSources = (
  uniforms: UniformAttribute[],
  index: UniformAttribute,
  values: Record<string, StorageSource>,
  indices?: StorageSource | null,
): [
  Record<string, LambdaSource>,
  LambdaSource,
] => {
  const boundValues = uniforms.map((uniform) => getSource(uniform, values[uniform.name]));
  const boundIndices = indices ? getSource(index, indices) : null;

  const instances = instanceWith(boundValues, boundIndices);

  const sources: Record<string, LambdaSource> = {};
  for (const {name} of uniforms) {
    sources[name] = getLambdaSource(bindEntryPoint(instances, name), indices ?? NO_SIZE);
  };

  return [sources, instances];
};

export const useInstancedAggregate = (
  aggregateBuffer: StructAggregateBuffer,
  instances?: StorageSource | null,
  format?: 'u16' | 'u32',
) => {
  return useMemo(() => getInstancedAggregate(aggregateBuffer, instances, format), [aggregateBuffer, instances, format]);
};

export const getInstancedAggregate = (
  aggregateBuffer: StructAggregateBuffer,
  instances?: StorageSource | null,
  format: 'u16' | 'u32' = 'u32',
) => {
  const sources = getStructAggregate(aggregateBuffer);
  if (!instances) return sources;

  const {layout: {attributes}} = aggregateBuffer;
  const [instanced, loadInstance] = getInstancedSources(attributes, INDEX[format], sources, instances);
  instanced.instances = loadInstance;

  return instanced;
};

export const combineInstances = (
  a?: Record<string, ShaderModule>,
  b?: Record<string, ShaderModule>,
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
