import type { StorageSource, UniformAttribute } from '@use-gpu/core';

import { useMemo } from '@use-gpu/live';
import { instanceWith, bindEntryPoint } from '@use-gpu/shader/wgsl';
import { getShader } from './useShader';
import { getSource } from './useSource';
import { getStructAggregate } from './useStructSources';

const INDEX = {name: 'instances', format: 'u32'};

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
    sources[name] = bindEntryPoint(instances, name);
  };

  return [sources, instances];
};

export const useInstancedAggregate = (
  aggregateBuffer: MultiAggregateBuffer,
  instances?: StorageSource,
) => {
  return useMemo(() => getInstancedAggregate(aggregateBuffer, instances), [aggregateBuffer, instances]);
};

export const getInstancedAggregate = (
  aggregateBuffer: MultiAggregateBuffer,
  instances?: StorageSource,
) => {
  const sources = getStructAggregate(aggregateBuffer);
  if (!instances) return sources;

  const {layout: {attributes}} = aggregateBuffer;
  const [instanced, loadInstance] = getInstancedSources(attributes, INDEX, sources, instances.source);
  instanced.instances = loadInstance;

  return instanced;
};
