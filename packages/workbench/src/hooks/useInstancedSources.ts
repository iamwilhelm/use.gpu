import type { ArchetypeSchema, StorageSource, UniformAttribute } from '@use-gpu/core';

import { useMemo } from '@use-gpu/live';
import { schemaToUniform } from '@use-gpu/core';
import { instanceWith, bindEntryPoint } from '@use-gpu/shader/wgsl';
import { getBoundShader } from './useBoundShader';
import { getBoundSource } from './useBoundSource';
import { getStructAggregate } from './useStructSources';
import { INSTANCE_SCHEMA } from '../layers/schemas';

const INDEX = schemaToUniform(INSTANCE_SCHEMA, 'instances');

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
  const boundValues = uniforms.map((uniform) => getBoundSource(uniform, values[uniform.name]));
  const boundIndices = getBoundSource(index, indices);

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
  return useMemo(() => getInstancedAggregate(aggregateBuffer, values), [aggregateBuffer, values])
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
