import { LiveComponent, LiveFunction, LiveElement } from '@use-gpu/live/types';
import { AggregateBuffer, Atlas, TextureSource, UniformType, TypedArray, StorageSource } from '@use-gpu/core/types';
import { UIAggregate } from './types';

import { DeviceContext } from '../providers/device-provider';
import { DebugContext } from '../providers/debug-provider';
import { SDFFontProvider, SDF_FONT_ATLAS } from '../text/providers/sdf-font-provider';
import { ScrollConsumer } from '../consumers/scroll-consumer';
import { useBufferedSize } from '../hooks/useBufferedSize';
import { use, keyed, wrap, fragment, yeet, useCallback, useContext, useOne, useMemo } from '@use-gpu/live';
import { getNumberHash, getObjectKey } from '@use-gpu/state';
import {
  makeAggregateBuffer,
  updateAggregateBuffer,
  updateAggregateSegments,
} from '@use-gpu/core';

import { UIRectangles } from '../primitives/ui-rectangles';

export type UIProps = {
  children: LiveElement<any>,
};

const allCount = (a: number, b: UIAggregate): number => a + b.count + ((b as any).isLoop ? 3 : 0);

const allKeys = (a: Set<string>, b: UIAggregate): Set<string> => {
  for (let k in b) a.add(k);
  return a;
}

const getItemSummary = (items: UIAggregate[]) => {
  const keys = items.reduce(allKeys, new Set());
  const count = items.reduce(allCount, 0);
  const memoKey = Array.from(keys).join('/');

  return {keys, count, memoKey};
}

export const UI: LiveComponent<UIProps> = (props) => {
  const {children} = props;

  return (
    wrap(ScrollConsumer, 
      use(SDFFontProvider, {
        children,
        then: Resume,
      })
    )
  );
};

const Resume = (
  atlas: Atlas,
  source: TextureSource,
  items: (UIAggregate | null)[],
) => {
  const partitioner = makePartitioner();

  for (let item of items) if (item) {
    if (item.texture === SDF_FONT_ATLAS) {
      item = {
        ...item,
        texture: source,
      };
    }
    partitioner.push(item);
  }

  const layers = partitioner.resolve();

  const els = layers.flatMap((layer, i) => {
    if (layer[0]?.f) return layer;
    return keyed(Layer, layer[0]?.id, layer);
  });
  els.push(yeet());

  return fragment(els);
};

const Layer: LiveFunction<any> = (
  items: UIAggregate[],
) => {
  const device = useContext(DeviceContext);
  const {keys, count, memoKey} = getItemSummary(items);

  const {sdf2d: {contours}} = useContext(DebugContext);

  const size = useBufferedSize(count);
  const render = useMemo(() =>
    makeUIAccumulator(device, items, keys, size, contours),
    [memoKey, size, contours]
  );

  return render(items);
};

const makeUIAccumulator = (
  device: GPUDevice,
  items: UIAggregate[],
  keys: Set<string>,
  count: number,
  debugContours?: boolean,
) => {
  const storage = {} as Record<string, AggregateBuffer>;

  const hasRectangle = keys.has('rectangles') || keys.has('rectangle');
  const hasRadius = keys.has('radiuses') || keys.has('radius');
  const hasBorder = keys.has('borders') || keys.has('border');
  const hasStroke = keys.has('strokes') || keys.has('stroke');
  const hasFill = keys.has('fills') || keys.has('fill');
  const hasUV = keys.has('uvs') || keys.has('uv');
  const hasRepeat = keys.has('repeats') || keys.has('repeat');
  const hasSDF = keys.has('sdfs') || keys.has('sdf');

  const hasTexture = keys.has('texture');
  const hasTransform = keys.has('transform');

  if (hasRectangle) storage.rectangles = makeAggregateBuffer(device, 'vec4<f32>', count);
  if (hasRadius) storage.radiuses = makeAggregateBuffer(device, 'vec4<f32>', count);
  if (hasBorder) storage.borders = makeAggregateBuffer(device, 'vec4<f32>', count);
  if (hasStroke) storage.strokes = makeAggregateBuffer(device, 'vec4<f32>', count);
  if (hasFill) storage.fills = makeAggregateBuffer(device, 'vec4<f32>', count);
  if (hasUV) storage.uvs = makeAggregateBuffer(device, 'vec4<f32>', count);
  if (hasRepeat) storage.repeats = makeAggregateBuffer(device, 'i32', count);
  if (hasSDF) storage.sdfs = makeAggregateBuffer(device, 'vec4<f32>', count);

  return (items: UIAggregate[]) => {
    const count = items.reduce(allCount, 0);
    if (!count) return null;

    const props = {count, debugContours} as Record<string, any>;

    if (hasRectangle) props.rectangles = updateAggregateBuffer(device, storage.rectangles, items, count, 'rectangle', 'rectangles');
    if (hasRadius) props.radiuses = updateAggregateBuffer(device, storage.radiuses, items, count, 'radius', 'radiuses');
    if (hasBorder) props.borders = updateAggregateBuffer(device, storage.borders, items, count, 'border', 'borders');
    if (hasStroke) props.strokes = updateAggregateBuffer(device, storage.strokes, items, count, 'stroke', 'strokes');
    if (hasFill) props.fills = updateAggregateBuffer(device, storage.fills, items, count, 'fill', 'fills');
    if (hasUV) props.uvs = updateAggregateBuffer(device, storage.uvs, items, count, 'uv', 'uvs');
    if (hasRepeat) props.repeats = updateAggregateBuffer(device, storage.repeats, items, count, 'repeat', 'repeats');
    if (hasSDF) props.sdfs = updateAggregateBuffer(device, storage.sdfs, items, count, 'sdf', 'sdfs');

    if (hasTexture) props.texture = items[0].texture;
    if (hasTransform) props.transform = items[0].transform;

    return use(UIRectangles, props);
  };
};

const getItemTypeKey = (item: UIAggregate) =>
  item.f ? -1 :
  getNumberHash(getObjectKey(item.texture)) ^
  getNumberHash(getObjectKey(item.transform));

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

    const i = last.get(key);
    const n = layers.length;
    const layer = layers[i];

    if (i != null) {
      let blocked = false;
      if (bounds) {
        for (let j = i + 1; j < n; ++j) {
          if (overlapBounds(layers[j].bounds, bounds)) {
            blocked = true;
            break;
          }
        }
      }
      if (!blocked) {
        layer.items.push(item);
        if (bounds) layer.bounds = joinBounds(layer.bounds, bounds);
        return;
      }
    }

    const partition = {key, items: [item], bounds: bounds ?? [0, 0, 0, 0]};
    last.set(key, layers.length);
    layers.push(partition);
  };

  const resolve = () => layers.map(l => l.items);
  return {push, resolve};
}

const intersectRange = (minA: number, maxA: number, minB: number, maxB: number) => !(minA >= maxB || minB >= maxA);

const overlapBounds = (a: Rectangle, b: Rectangle) => {
  const [al, at, ar, ab] = a;
  const [bl, bt, br, bb] = b;

  return intersectRange(al, ar, bl, br) && intersectRange(at, ab, bt, bb);
}

const joinBounds = (a: Rectangle, b: Rectangle) => {
  const [al, at, ar, ab] = a;
  const [bl, bt, br, bb] = b;
  return [
    Math.min(al, bl),
    Math.min(at, bt),
    Math.max(ar, br),
    Math.max(ab, bb),
  ];
};
