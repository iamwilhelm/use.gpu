import type { LiveElement } from '@use-gpu/live';
import type { AggregateValue } from '@use-gpu/core';
import type { ShaderSource } from '@use-gpu/shader/wgsl';

import { useDeviceContext } from '../providers/device-provider';
import { quote, yeet, useMemo, useRef } from '@use-gpu/live';
import {
  schemaToAggregate,
  updateAggregateFromSchema,
  updateAggregateFromSchemaRefs,

  getAggregateSummary,
  updateAggregateBuffer,
  updateAggregateIndex,
} from '@use-gpu/core';
import { useBufferedSize } from '../hooks/useBufferedSize';
import { getInstancedAggregate } from '../hooks/useInstancedSources';
import { getStructAggregate } from '../hooks/useStructSources';

export type AggregatorProps = {
  schema: AggregateSchema,
  items: Record<string, AggregateValue>[],
  render: (
    count: number,
    sources: Record<string, ShaderSource>,
    item: Record<string, AggregateValue>,
    uploadRefs: () => void,
  ) => LiveElement,
};

export const Aggregator: LC<AggregatorProps> = (props: AggregatorProps) => {
  const {schema, items, render} = props;

  const device = useDeviceContext();
  const {archetype, count, indices} = getAggregateSummary(items);

  const allocItems = useBufferedSize(items.length);
  const allocVertices = useBufferedSize(count);
  const allocIndices = useBufferedSize(indices);

  const renderRef = useRef(render);
  renderRef.current = render;

  const aggregate = useMemo(() =>
    makeAggregator(schema)(device, items, allocItems, allocVertices, allocIndices),
    [archetype, allocItems, allocVertices, allocIndices]
  );

  const {
    count: total,
    sources,
    item,
    uploadRefs
  } = aggregate(items, count, indices);
  
  return render(total, sources, item, uploadRefs);
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

  const sources = {
    ...(byRefs     ? getInstancedAggregate(byRefs, instances)  : undefined),
    ...(byItems    ? getInstancedAggregate(byItems, instances) : undefined),
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
