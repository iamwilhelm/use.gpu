import type { LC, LiveFunction, LiveElement } from '@use-gpu/live';
import type { AggregateBuffer, Atlas, Rectangle, TextureSource, UniformType, TypedArray, StorageSource } from '@use-gpu/core';
import type { UIAggregate } from './types';

import {
  useDeviceContext, useDebugContext,
  useAggregator, useBufferedSize,
  SDFFontProvider,
  UIRectangles,
  QueueReconciler,
  UI_SCHEMA,
} from '@use-gpu/workbench';
import { use, keyed, wrap, fragment, yeet, gather, useCallback, useContext, useOne, useMemo } from '@use-gpu/live';
import { mixBits53, hashBits53, getObjectKey } from '@use-gpu/state';
import { getBundleKey } from '@use-gpu/shader';
import { overlapBounds, joinBounds } from './lib/util';

const {signal} = QueueReconciler;

const DEBUG = true;

export type UIProps = {
  children: LiveElement,
};

export type UILayersProps = {
  items: (UIAggregate | null)[],
};

export const UI: LC<UIProps> = (props) => {
  const {children} = props;

  return (
    gather(
      wrap(SDFFontProvider, children),
      (items: (UIAggregate | null)[]) => {
        if (!Array.isArray(items)) items = [items];
        return UILayers({items});
      },
    )
  );
};

export const UILayers: LC<UILayersProps> = ({
  items,
}: UILayersProps) => {
  if (items.length === 0) return null;

  const partitioner = makePartitioner();

  items.sort((a, b) => a.zIndex - b.zIndex);
  for (let item of items) if (item) {
    partitioner.push(item);
  }
  const layers = partitioner.resolve();

  console.log('-------')
  const els = layers.flatMap((layer, i): LiveElement => {
    if ((layer.items[0] as any)?.f) return (layer.items as any);
    return keyed(Layer, layer.key, layer.items);
  });
  els.push(signal());

  return fragment(els);
};

const Layer: LiveFunction<any> = (
  items: LayerAggregate[],
) => {
  const [item] = items;
  const {transform, clip, mask, texture} = item;

  const {count, sources} = useAggregator(UI_SCHEMA, items);
  const {sdf2d: {contours}} = useDebugContext();

  return useMemo(() => {
    const props = {count, transform, clip, mask, texture, debugContours: contours, ...sources};

    DEBUG && console.log('UIRectangles', {props, items, sources});

    return use(UIRectangles, props);
    // Exclude flags and contexts because they are factored into the archetype
  }, [count, sources, contours]);
};

const getItemTypeKey = (item: LayerAggregate) =>
  ('texture' in item && item.texture
    ? hashBits53(getObjectKey(item.texture))
    : 0) ^
  ('clip' in item && item.clip
    ? getBundleKey(item.clip)
    : 0) ^
  ('mask' in item && item.mask
    ? getBundleKey(item.mask)
    : 0) ^
  ('transform' in item && item.transform
    ? getBundleKey(item.transform)
    : 0) ^
  mixBits53(item.archetype, item.zIndex || 0);

type Partition = {
  key: number,
  items: UIAggregate[],
  bounds: Rectangle,
};

const makePartitioner = () => {
  const layers: Partition[] = [];
  const last = new Map<number, number>();

  const push = (item: UIAggregate) => {
    const key = getItemTypeKey(item);
    const {bounds} = item;

    const i = last.get(key)!;
    const n = layers.length;
    const layer = layers[i];

    if (i != null) {
      let blocked = !bounds;
      if (bounds) {
        for (let j = i + 1; j < n; ++j) {
          if (overlapBounds(layers[j].bounds, bounds)) {
            blocked = true;
            break;
          }
        }
      }
      if (!blocked || i === n - 1) {
        layer.items.push(item);
        if (bounds) layer.bounds = joinBounds(layer.bounds, bounds);
        return;
      }
    }

    const partition = {key: layer ? layer.key + 1 : key, items: [item], bounds: bounds ?? [0, 0, 0, 0]};
    last.set(key, layers.length);
    layers.push(partition);
  };

  const resolve = () => layers;
  return {push, resolve};
}
