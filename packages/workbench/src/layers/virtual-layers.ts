import type { LiveComponent, LiveFunction, LiveElement } from '@use-gpu/live';
import type { AggregateBuffer, UniformType, TypedArray, StorageSource } from '@use-gpu/core';
import type { LayerAggregator, LayerAggregate, PointAggregate, LineAggregate, FaceAggregate } from './types';

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

export type VirtualLayersProps = {
  items?: Record<string, LayerAggregate[]>,
  children: LiveElement,
};

const allCount = (a: number, b: LayerAggregate): number => a + b.count;

const allIndices = (a: number, b: LayerAggregate): number => a + (b.indices || 0);

const allKeys = (a: Set<string>, b: LayerAggregate): Set<string> => {
  for (let k in b) a.add(k);
  return a;
}

const getItemSummary = (items: LayerAggregate[]) => {
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
  aggregates: Record<string, LayerAggregate[]>,
) => useOne(() => {
  const els: LiveElement[] = [];

  for (const type in aggregates) {
    const items = aggregates[type];
    if (!items.length) continue;

    if (type === 'layer') {
      els.push(items);
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
  items: LayerAggregate[],
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

const makePointAccumulator = (
  device: GPUDevice,
  items: PointAggregate[],
  alloc: number,
) => {
  const [{attributes}] = items;
  const aggregate = schemaToAggregate(device, POINT_SCHEMA, attributes, alloc);

  return (items: PointAggregate[], count: number) => {
    const [item] = items;
    const {transform} = item;
    const props = {count, ...item.flags} as Record<string, any>;

    updateAggregateFromSchema(device, POINT_SCHEMA, aggregate, items, props, count);
    console.log('point', {props, aggregate});
    
    const layer = use(PointLayer, props);

    const hasTransform = transform?.key;
    return hasTransform ? provide(TransformContext, transform, layer) : layer;
  };
}

const makeLineAccumulator = (
  device: GPUDevice,
  items: LineAggregate[],
  alloc: number,
) => {
  const [{attributes}] = items;
  const aggregate = schemaToAggregate(device, LINE_SCHEMA, attributes, alloc);

  return (items: LineAggregate[], count: number) => {
    const [item] = items;
    const {transform} = item;
    const props = {count, ...item.flags} as Record<string, any>;

    updateAggregateFromSchema(device, LINE_SCHEMA, aggregate, items, props, count);
    console.log('line', {props, aggregate});
    
    const layer = use(LineLayer, props);
    const hasTransform = transform?.key;
    return hasTransform ? provide(TransformContext, transform, layer) : layer;
  };
};

const makeArrowAccumulator = (
  device: GPUDevice,
  items: LineAggregate[],
  alloc: number,
) => {
  const [{attributes}] = items;
  const aggregate = schemaToAggregate(device, ARROW_SCHEMA, attributes, alloc);

  return (items: ArrowAggregate[], count: number) => {
    const [item] = items;
    const {transform} = item;
    const props = {count, ...item.flags} as Record<string, any>;

    updateAggregateFromSchema(device, ARROW_SCHEMA, aggregate, items, props, count);
    console.log('arrow', {props, aggregate});
    
    const layer = use(ArrowLayer, props);
    const hasTransform = transform?.key;
    return hasTransform ? provide(TransformContext, transform, layer) : layer;
  };
};

const makeFaceAccumulator = (
  device: GPUDevice,
  items: LineAggregate[],
  allocCount: number,
  allocIndices: number,
) => {
  /*
  const storage = {} as Record<string, AggregateBuffer>;

  const hasPosition = keys.has('positions') || keys.has('position');
  const hasIndex = keys.has('indices') || keys.has('index');
  const hasSegment = keys.has('segments') || keys.has('segment');
  const hasColor = keys.has('colors') || keys.has('color');
  const hasZBias = keys.has('zBiases') || keys.has('zBias');
  const hasID = keys.has('id') || keys.has('ids');
  const hasLookup = keys.has('lookup') || keys.has('lookups');
  const hasCullMode = keys.has('cullMode');

  if (hasIndex) storage.indices = makeAggregateBuffer(device, 'u32', allocIndices);
  else storage.segments = makeAggregateBuffer(device, 'i32', allocCount);

  if (hasPosition) storage.positions = makeAggregateBuffer(device, 'vec4<f32>', allocCount);
  if (hasColor) storage.colors = makeAggregateBuffer(device, 'vec4<f32>', allocCount);
  if (hasZBias) storage.zBiases = makeAggregateBuffer(device, 'f32', allocCount);
  if (hasID) storage.ids = makeAggregateBuffer(device, 'u32', allocCount);
  if (hasLookup) storage.lookups = makeAggregateBuffer(device, 'u32', allocCount);

  return (items: FaceAggregate[], count: number, indices: number) => {
    const props = {count} as Record<string, any>;

    const {chunks, loops} = gatherItemChunks(items);
    const offsets = accumulate(chunks);

    if (hasIndex) {
      props.count = indices / 3;
      props.indices = updateAggregateIndex(device, storage.indices, items, indices, offsets, 'index', 'indices');
    }
    else {
      if (hasSegment) props.segments = updateAggregateBuffer(device, storage.segments, items, count, 'segment', 'segments');
      //else props.segments = updateAggregateFaces(device, storage.segments, chunks, loops, count);
    }

    if (hasPosition) props.positions = updateAggregateBuffer(device, storage.positions, items, count, 'position', 'positions');
    if (hasColor) props.colors = updateAggregateBuffer(device, storage.colors, items, count, 'color', 'colors');
    if (hasZBias) props.zBiases = updateAggregateBuffer(device, storage.zBiases, items, count, 'zBias', 'zBiases');
    if (hasID) props.ids = updateAggregateBuffer(device, storage.ids, items, count, 'id', 'ids');
    if (hasLookup) props.lookups = updateAggregateBuffer(device, storage.lookups, items, count, 'lookup', 'lookups');

    if (hasCullMode) props.pipeline = {primitive: {cullMode: items[0]?.cullMode}};

    return use(FaceLayer, props);
  };
  */
};

const AGGREGATORS = {
  'arrow': makeArrowAccumulator,
  'face': makeFaceAccumulator,
  'line': makeLineAccumulator,
  'point': makePointAccumulator,
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

const getItemTypeKey = (item: LayerAggregate) =>
  ('transform' in item
    ? (item.transform?.key || 0)
    : 0) ^
  mixBits53(item.archetype, item.zIndex ?? 0);

type Partition = {
  key: number,
  items: LayerAggregate[],
};

const makePartitioner = () => {
  const layers: Partition[] = [];
  const map = new Map<number, Partition>();

  const push = (item: LayerAggregate) => {
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
