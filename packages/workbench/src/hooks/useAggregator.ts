import type { LiveElement } from '@use-gpu/live';
import type { AggregateValue } from '@use-gpu/core';
import type { ShaderSource } from '@use-gpu/shader/wgsl';

import { useDeviceContext } from '../providers/device-provider';
import { useMemo } from '@use-gpu/live';
import {
  schemaToAggregate,
  updateAggregateFromSchema,
  updateAggregateFromSchemaRefs,

  getAggregateSummary,
  updateAggregateBuffer,
  updateAggregateIndex,
} from '@use-gpu/core';
import { useBufferedSize } from '../hooks/useBufferedSize';
import { getInstancedAggregate, combineInstances } from '../hooks/useInstancedSources';
import { getStructAggregate } from '../hooks/useStructSources';

export const useAggregator = (
  schema: AggregateSchema,
  items: Record<string, AggregateValue>[],
) => {
  const device = useDeviceContext();
  const {archetype, count, indices} = getAggregateSummary(items);

  const allocItems = useBufferedSize(items.length);
  const allocVertices = useBufferedSize(count);
  const allocIndices = useBufferedSize(indices);

  const aggregate = useMemo(() =>
    makeAggregator(schema)(device, items, allocItems, allocVertices, allocIndices),
    [archetype, allocItems, allocVertices, allocIndices]
  );

  return aggregate(items, count, indices);
};

export const makeAggregator = (
  schema: AggregateSchema,
) => (
  device: GPUDevice,
  initialItems: Record<string, AggregateValue>[],
  allocItems: number,
  allocVertices: number,
  allocIndices: number,
) => {
  const [item] = initialItems;
  const {attributes, refs} = item;

  const aggregate = schemaToAggregate(device, schema, attributes, refs, allocItems, allocVertices, allocIndices);
  const {aggregateBuffers, refBuffers, byRefs, byItems, byVertices, byIndices, bySelfs} = aggregate;
  const {instances} = aggregateBuffers;

  const refSources  = byRefs && getInstancedAggregate(byRefs, instances);
  const itemSources = byItems && getInstancedAggregate(byItems, instances);

  const sources = {
    ...combineInstances(refSources, itemSources),
    ...(byVertices ? getStructAggregate(byVertices) : undefined),
    ...(byIndices  ? getStructAggregate(byIndices)  : undefined),
    ...bySelfs,
  };

  let itemCount = initialItems;

  const uploadRefs = byRefs ? () => {
    updateAggregateFromSchemaRefs(device, schema, aggregate, itemCount);
  } : null;

  return (items: ArrowAggregate[], count: number, indices: number) => {
    const [item] = items;
    itemCount = items.length;

    updateAggregateFromSchema(device, schema, aggregate, items, count, indices);

    return {count, sources, item, uploadRefs};
  };
};
