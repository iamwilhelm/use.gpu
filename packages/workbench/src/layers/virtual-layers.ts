import type { LiveComponent, LiveFunction, LiveElement } from '@use-gpu/live';
import type { AggregateBuffer, UniformType, TypedArray, StorageSource } from '@use-gpu/core';
import type { LayerAggregator, VirtualLayerAggregate, LayerAggregate } from './types';

import { DeviceContext } from '../providers/device-provider';
import { TransformContext } from '../providers/transform-provider';
import { use, keyed, fragment, signal, provide, multiGather, memo, useContext, useOne, useMemo } from '@use-gpu/live';
import { toMurmur53, scrambleBits53, mixBits53, getObjectKey } from '@use-gpu/state';
import { getBundleKey } from '@use-gpu/shader';
import {
  schemaToAggregate,
  updateAggregateFromSchema,
  
  makeAggregateBuffer,
  updateAggregateBuffer,
  updateAggregateIndex,
} from '@use-gpu/core';
import { useBufferedSize } from '../hooks/useBufferedSize';

import { FaceLayer } from './face-layer';
import { LineLayer } from './line-layer';
import { PointLayer } from './point-layer';
import { ArrowLayer } from './arrow-layer';

import { LINE_SCHEMA, POINT_SCHEMA, ARROW_SCHEMA, FACE_SCHEMA } from './schemas';

const DEBUG = true;

export type VirtualLayersProps = {
  items?: Record<string, VirtualLayerAggregate[]>,
  children: LiveElement,
};

const allCount = (a: number, b: VirtualLayerAggregate): number => a + b.count;

const allIndices = (a: number, b: VirtualLayerAggregate): number => a + (b.indices || 0);

const allKeys = (a: Set<string>, b: VirtualLayerAggregate): Set<string> => {
  for (let k in b) a.add(k);
  return a;
}

const getItemSummary = (items: VirtualLayerAggregate[]) => {
  const n = items.length;
  const archetype = items[0]?.archetype ?? 0;

  let allCount = 0;
  let allIndices = 0;
  for (let i = 0; i < n; ++i) {
    const {count, indices} = items[i];
    allCount += count;
    allIndices += indices;
  }
  
  return {archetype, count: allCount, indices: allIndices};
}

/** Aggregate (point / line / face) geometry from children to produce merged layers. */
export const VirtualLayers: LiveComponent<VirtualLayersProps> = (props: VirtualLayersProps) => {
  const {items, children} = props;
  return items ? Resume(items) : children ? multiGather(children, Resume) : null;
};

const Resume = (
  aggregates: Record<string, VirtualLayerAggregate[]>,
) => useOne(() => {
  const els: LiveElement[] = [];

  for (const type in aggregates) {
    const items = aggregates[type];
    if (!items.length) continue;

    if (type === 'layer') {
      for (const item of items) {
        const {transform, element} = item;
        const hasTransform = transform?.key;
        els.push(hasTransform ? provide(TransformContext, transform, element, element.key) : element);
      }
      continue;
    }

    const partitioner = makePartitioner();
    for (let item of items) if (item) {
      partitioner.push(item);
    }
    const layers = partitioner.resolve();

    const group = [];
    const makeAggregator = AGGREGATORS[type]!;
    for (const layer of layers) {
      group.push(keyed(Aggregate, layer.key, makeAggregator, layer.items));
    }

    els.push(fragment(group, type));
  }

  return els;
}, aggregates);

const Aggregate: LiveFunction<any> = (
  makeAggregator: LayerAggregator,
  items: VirtualLayerAggregate[],
) => {
  const device = useContext(DeviceContext);
  const {archetype, count, indices} = getItemSummary(items);

  const allocCount = useBufferedSize(count);
  const allocIndices = useBufferedSize(indices);

  const render = useMemo(() =>
    makeAggregator(device, items, allocCount, allocIndices),
    [archetype, allocCount, allocIndices]
  );

  return render(items, count, indices);
};

const makeSchemaAccumulator = (
  schema: AggregateSchema,
  Component: LiveComponent,
) => (
  device: GPUDevice,
  items: LineAggregate[],
  allocCount: number,
  allocIndices: number,
) => {
  const [{attributes}] = items;
  const aggregate = schemaToAggregate(device, schema, attributes, allocCount, allocIndices);

  return (items: ArrowAggregate[], count: number) => {
    const [item] = items;
    const {transform} = item;
    const props = {count, ...item.flags} as Record<string, any>;

    updateAggregateFromSchema(device, schema, aggregate, items, props, count);
    DEBUG && console.log(Component.name, {props, aggregate});
    
    const layer = use(Component, props);
    const hasTransform = transform?.key;
    return hasTransform ? provide(TransformContext, transform, layer) : layer;
  };
};

const AGGREGATORS = {
  'arrow': makeSchemaAccumulator(ARROW_SCHEMA, ArrowLayer),
  'face': makeSchemaAccumulator(FACE_SCHEMA, FaceLayer),
  'line': makeSchemaAccumulator(LINE_SCHEMA, LineLayer),
  'point': makeSchemaAccumulator(POINT_SCHEMA, PointLayer),
  'label': () => () => {},
} as Record<string, LayerAggregator>;

const accumulate = (xs: number[]): number[] => {
  let out: number[] = [];
  let n = xs.length;
  let accum = 0;
  for (let i = 0; i < n; ++i) {
    out.push(accum);
    accum += xs[i];
  }
  return out;
}

const getItemTypeKey = (item: VirtualLayerAggregate) =>
  ('transform' in item
    ? (item.transform?.key || 0)
    : 0) ^
  mixBits53(item.archetype, item.zIndex ?? 0);

type Partition = {
  key: number,
  items: VirtualLayerAggregate[],
};

const makePartitioner = () => {
  const layers: Partition[] = [];
  const map = new Map<number, Partition>();

  const push = (item: VirtualLayerAggregate) => {
    const {zIndex = 0} = item;
    const key = getItemTypeKey(item);
    const existing = map.get(key);
    if (existing) {
      existing.items.push(item);
    }
    else {
      const partition = {key, zIndex, items: [item]};
      map.set(key, partition);
      layers.push(partition);
    }
  };

  const resolve = () => {
    layers.sort((a, b) => a.zIndex - b.zIndex);
    return layers;
  };

  return {push, resolve};
}
