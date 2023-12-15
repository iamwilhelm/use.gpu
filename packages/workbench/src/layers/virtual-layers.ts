import type { LiveComponent, LiveFunction, LiveElement } from '@use-gpu/live';
import type { AggregateBuffer, UniformType, TypedArray, StorageSource } from '@use-gpu/core';
import type { LayerAggregator, LayerAggregate } from './types';

import { DeviceContext } from '../providers/device-provider';
import { TransformContext } from '../providers/transform-provider';
import { use, keyed, fragment, quote, yeet, provide, signal, multiGather, memo, useContext, useOne, useMemo } from '@use-gpu/live';
import { toMurmur53, scrambleBits53, mixBits53, getObjectKey } from '@use-gpu/state';
import { getBundleKey } from '@use-gpu/shader';
import {
  filterSchema,
  schemaToAggregate,
  updateAggregateFromSchema,
  updateAggregateFromSchemaRefs,
  
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

type AccumulatorOptions = {
  _unused?: boolean,
};

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
  const {zBias, items, children} = props;
  const options = {zBias};
  return items ? Resume(options)(items) : children ? multiGather(children, Resume(options)) : null;
};

const provideTransform = (element: LiveElement, transform?: TransformContextProps) => {
  if (!element) return null;

  const hasTransform = transform?.key;
  let view = element;
  if (hasTransform) {
    view = provide(TransformContext, transform, view, element.key);
  }
  return view;
};

const Resume = (
  options: VirtualLayersOptions,
) => (
  aggregates: Record<string, LayerAggregate[]>,
) => useOne(() => {
  const els: LiveElement[] = [signal()];

  for (const type in aggregates) {
    const items = aggregates[type];
    if (!items.length) continue;

    if (type === 'layer') {
      for (const item of items) {
        const {transform, element} = item;
        const layer = provideTransform(element, transform);
        els.push(layer);
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
      group.push(keyed(Aggregate, layer.key, makeAggregator(options), layer.items));
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

  const allocItems = useBufferedSize(items.length);
  const allocCount = useBufferedSize(count);
  const allocIndices = useBufferedSize(indices);

  const render = useMemo(() =>
    makeAggregator(device, items, allocItems, allocCount, allocIndices),
    [archetype, allocItems, allocCount, allocIndices]
  );

  return render(items, count, indices);
};

const makeSchemaAggregator = (
  schema: AggregateSchema,
  Component: LiveComponent,
) => (
  options: AccumulatorOptions,
) => (
  device: GPUDevice,
  items: LineAggregate[],
  allocItems: number,
  allocCount: number,
  allocIndices: number,
) => {
  const [item] = items;
  const {attributes, refs} = item;

  const aggregate = schemaToAggregate(device, schema, attributes, refs, allocItems, allocCount, allocIndices);

  const refSchema = filterSchema(schema, (f) => f.ref);
  const refCount = Object.keys(refSchema).length;

  const uploadRefs = () => {
    console.log('update aggregator refs', Component.name, refSchema, aggregate);
    updateAggregateFromSchemaRefs(device, refSchema, aggregate);
  };
  
  const upload = quote(yeet(uploadRefs));

  return (items: ArrowAggregate[], count: number, indices: number) => {
    const [item] = items;
    const {transform} = item;
    const props = {count, ...item.flags} as Record<string, any>;

    updateAggregateFromSchema(device, schema, aggregate, props, items, count, indices);
    DEBUG && console.log(Component.name, {props, items, aggregate});

    const element = use(Component, props);
    const layer = provideTransform(element, transform);

    if (refCount) return [upload, layer];
    return layer;
  };
};

const AGGREGATORS = {
  'arrow': makeSchemaAggregator(ARROW_SCHEMA, ArrowLayer),
  'face': makeSchemaAggregator(FACE_SCHEMA, FaceLayer),
  'line': makeSchemaAggregator(LINE_SCHEMA, LineLayer),
  'point': makeSchemaAggregator(POINT_SCHEMA, PointLayer),
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
