import type { LiveComponent, LiveFunction, LiveElement } from '@use-gpu/live';
import type { AggregateBuffer, UniformType, TypedArray, StorageSource } from '@use-gpu/core';
import type { ShaderSource } from '@use-gpu/shader/wgsl';
import type { LayerAggregator, LayerAggregate } from './types';

import { DeviceContext } from '../providers/device-provider';
import { TransformContext } from '../providers/transform-provider';
import { use, keyed, fragment, quote, yeet, provide, signal, multiGather, extend, useMemo, useOne } from '@use-gpu/live';
import { toMurmur53, scrambleBits53, mixBits53, getObjectKey } from '@use-gpu/state';
import { getBundleKey } from '@use-gpu/shader';

import { useAggregator } from '../hooks/useAggregator';

import { IndexedTransform } from './indexed-transform';
import { FaceLayer } from './face-layer';
import { LineLayer } from './line-layer';
import { PointLayer } from './point-layer';
import { ArrowLayer } from './arrow-layer';

import { LINE_SCHEMA, POINT_SCHEMA, ARROW_SCHEMA, FACE_SCHEMA, INSTANCE_SCHEMA } from './schemas';

const DEBUG = true;

export type VirtualLayersProps = {
  items?: Record<string, LayerAggregate[]>,
  children: LiveElement,
};

const AGGREGATORS = {
  'arrow': { schema: ARROW_SCHEMA, component: ArrowLayer },
  'face':  { schema: FACE_SCHEMA,  component: FaceLayer  },
  'line':  { schema: LINE_SCHEMA,  component: LineLayer  },
  'point': { schema: POINT_SCHEMA, component: PointLayer },
  //'label': () => () => {},
} as Record<string, LayerAggregator>;

/** Aggregate (point / line / face) geometry from children to produce merged layers. */
export const VirtualLayers: LiveComponent<VirtualLayersProps> = (props: VirtualLayersProps) => {
  const {zBias, items, children} = props;
  return items ? Resume(items) : children ? multiGather(children, Resume) : null;
};

const provideTransform = (
  element: LiveElement,
  transform?: TransformContextProps,
  refSources?: Record<string, ShaderSource>,
) => {
  if (!element) return null;

  const hasRefTransform = !!refSources?.matrices;
  const hasTransform = !!transform?.key;

  let view = element;
  if (hasRefTransform) {
    view = use(IndexedTransform, {...refSources, children: view});
  }
  if (hasTransform) {
    view = provide(TransformContext, transform, view, element.key);
  }
  return view;
};

const Resume = (
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

    // Pass on unknown types, probably raw draw calls
    const layerAggregator = AGGREGATORS[type];
    if (!layerAggregator) {
      els.push(yeet({[type]: items}));
      continue;
    }

    const partitioner = makePartitioner();
    for (let item of items) if (item) {
      partitioner.push(item);
    }
    const layers = partitioner.resolve();

    const group = [];
    for (const layer of layers) {
      group.push(keyed(Aggregate, layer.key, layerAggregator, layer.items));
    }

    els.push(fragment(group, type));
  }

  return els;
}, aggregates);

const Aggregate: LiveFunction<any> = (
  layerAggregator: LayerAggregator,
  items: LayerAggregate[],
) => {
  const {schema, component} = layerAggregator;

  const {count, sources, item, uploadRefs} = useAggregator(schema, items);
  const {transform, flags} = item;

  return useMemo(() => {
    const {matrices, normalMatrices, ...rest} = sources;
    const props = {count, ...rest, ...flags};

    DEBUG && console.log(component.name, {props, items, sources});

    const element = use(component, props);
    const layer = provideTransform(element, transform, sources);

    const upload = useOne(() => uploadRefs ? quote(yeet(uploadRefs)) : null, uploadRefs);
    return upload ? [upload, layer] : layer;
  }, [count, sources, transform, flags, uploadRefs]);
};

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
