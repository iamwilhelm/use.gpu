import type { LiveElement } from '@use-gpu/live';
import type { AggregateSchema, AggregateValue } from '@use-gpu/core';
import type { ShaderSource } from '@use-gpu/shader/wgsl';

import { useDeviceContext } from '../providers/device-provider';
import { useLog, useMemo, useOne } from '@use-gpu/live';
import {
  schemaToAggregate,
  toGPUAggregate,
  updateAggregateFromSchema,
  uploadAggregateFromSchema,
  uploadAggregateFromSchemaRefs,

  getAggregateSummary,
  updateAggregateBuffer,
  updateAggregateIndex,
} from '@use-gpu/core';
import { useBufferedSize } from '../hooks/useBufferedSize';
import { getInstancedAggregate, combineInstances } from '../hooks/useInstancedSources';
import { getStructAggregate } from '../hooks/useStructSources';

const DEBUG = false;

export const useAggregator = (
  schema: AggregateSchema,
  items: Record<string, AggregateValue>[],
) => {
  const device = useDeviceContext();
  const {archetype, count, indexed, instanced, offsets} = useOne(() => getAggregateSummary(items), items);

  const allocInstances = useBufferedSize(instanced);
  const allocVertices = useBufferedSize(count);
  const allocIndices = useBufferedSize(indexed);

  const aggregate = useMemo(() => (
    makeAggregator(schema)(device, items, allocInstances, allocVertices, allocIndices)),
    [archetype, allocInstances, allocVertices, allocIndices]
  );

  return useOne(() => aggregate(items, count, indexed, instanced, offsets), items);
};

export const makeAggregator = (
  schema: AggregateSchema,
) => (
  device: GPUDevice,
  initialItems: Record<string, AggregateValue>[],
  allocInstances: number,
  allocVertices: number,
  allocIndices: number,
) => {
  const [item] = initialItems;
  const {attributes, refs} = item;

  const cpuAggregate = schemaToAggregate(schema, attributes, refs, allocInstances, allocVertices, allocIndices);
  const aggregate = toGPUAggregate(device, cpuAggregate);

  const {aggregateBuffers, refBuffers, byRefs, byInstances, byVertices, byIndices, bySelfs} = aggregate;
  const {instances} = aggregateBuffers;

  const refSources  = byRefs && getInstancedAggregate(byRefs, instances);
  const itemSources = byInstances && getInstancedAggregate(byInstances, instances);

  const sources = {
    ...combineInstances(refSources, itemSources),
    ...(byVertices ? getStructAggregate(byVertices) : undefined),
    ...(byIndices  ? getStructAggregate(byIndices)  : undefined),
    ...bySelfs.sources,
  };

  let itemCount = initialItems.length;
  const uploadRefs = byRefs ? () => {
    uploadAggregateFromSchemaRefs(device, schema, aggregate, itemCount);
  } : null;

  DEBUG && console.log('useAggregator', {initialItems, aggregate, allocInstances, allocVertices, allocIndices});

  return (items: ArrowAggregate[], count: number, indexed: number, instanced: number, offsets: number[]) => {
    itemCount = items.length;

    updateAggregateFromSchema(schema, aggregate, items, count, indexed, instanced, offsets);
    uploadAggregateFromSchema(device, schema, aggregate);

    return {count: indexed, sources, uploadRefs};
  };
};
