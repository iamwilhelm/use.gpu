import { LiveComponent, LiveFunction, LiveElement } from '@use-gpu/live/types';
import { AggregateBuffer, UniformType, TypedArray, StorageSource } from '@use-gpu/core/types';
import { UIAggregate } from './types';

import { DeviceContext } from '../providers/device-provider';
import { SDFFontProvider, SDF_FONT_ATLAS } from '../text/providers/sdf-font-provider';
import { ScrollConsumer } from '../consumers/scroll-consumer';
import { useBufferedSize } from '../hooks/useBufferedSize';
import { use, keyed, wrap, useCallback, useContext, useOne, useMemo } from '@use-gpu/live';
import {
  makeAggregateBuffer,
  updateAggregateBuffer,
  updateAggregateSegments,
} from '@use-gpu/core';

import { UIRectangles } from '../primitives/ui-rectangles';

export type AggregateProps = {
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

export const UI: LiveComponent<AggregateProps> = (props) => {
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
  const layers = [] as UIAggregate[][];
  const ids = [] as number[];

  const {width, height} = atlas;

  let layer = null;
  let texture = null;
  let transform = null;

  for (let item of items) if (item) {

    if (item.texture === SDF_FONT_ATLAS) {
      item = {
        ...item,
        texture: source,
      };
    }

    if (!layer || item.texture !== texture || item.transform !== transform) {
      texture = item.texture;
      transform = item.transform;

      layer = [] as UIAggregate[];
      layers.push(layer);
      ids.push(item.id);
    }
    layer.push(item);
  }

  return layers.map((layer, i) => keyed(Layer, ids[i], layer));
};

const Layer: LiveFunction<any> = (
  items: LayerAggregate[],
) => {
  const device = useContext(DeviceContext);
  const {keys, count, memoKey} = getItemSummary(items);

  const size = useBufferedSize(count);
  const render = useMemo(() =>
    makeUIAccumulator(device, items, keys, size),
    [memoKey, size]
  );

  return render(items);
};

const makeUIAccumulator = (
  device: GPUDevice,
  items: UIAggregate[],
  keys: Set<string>,
  count: number,
) => {
  const storage = {} as Record<string, AggregateBuffer>;

  const hasRectangle = keys.has('rectangles') || keys.has('rectangle');
  const hasRadius = keys.has('radiuses') || keys.has('radius');
  const hasBorder = keys.has('borders') || keys.has('border');
  const hasStroke = keys.has('strokes') || keys.has('stroke');
  const hasFill = keys.has('fills') || keys.has('fill');
  const hasUV = keys.has('uvs') || keys.has('uv');
  const hasRepeat = keys.has('repeats') || keys.has('repeat');

  const hasTexture = keys.has('texture');
  const hasTransform = keys.has('transform');

  if (hasRectangle) storage.rectangles = makeAggregateBuffer(device, UniformType['vec4<f32>'], count);
  if (hasRadius) storage.radiuses = makeAggregateBuffer(device, UniformType['vec4<f32>'], count);
  if (hasBorder) storage.borders = makeAggregateBuffer(device, UniformType['vec4<f32>'], count);
  if (hasStroke) storage.strokes = makeAggregateBuffer(device, UniformType['vec4<f32>'], count);
  if (hasFill) storage.fills = makeAggregateBuffer(device, UniformType['vec4<f32>'], count);
  if (hasUV) storage.uvs = makeAggregateBuffer(device, UniformType['vec4<f32>'], count);
  if (hasRepeat) storage.repeats = makeAggregateBuffer(device, UniformType['i32'], count);

  return (items: RectangleAggregate[]) => {
    const count = items.reduce(allCount, 0);
    if (!count) return null;

    const props = {count} as Record<string, any>;

    if (hasRectangle) props.rectangles = updateAggregateBuffer(device, storage.rectangles, items, count, 'rectangle', 'rectangles');
    if (hasRadius) props.radiuses = updateAggregateBuffer(device, storage.radiuses, items, count, 'radius', 'radiuses');
    if (hasBorder) props.borders = updateAggregateBuffer(device, storage.borders, items, count, 'border', 'borders');
    if (hasStroke) props.strokes = updateAggregateBuffer(device, storage.strokes, items, count, 'stroke', 'strokes');
    if (hasFill) props.fills = updateAggregateBuffer(device, storage.fills, items, count, 'fill', 'fills');
    if (hasUV) props.uvs = updateAggregateBuffer(device, storage.uvs, items, count, 'uv', 'uvs');
    if (hasRepeat) props.repeats = updateAggregateBuffer(device, storage.repeats, items, count, 'repeat', 'repeats');

    if (hasTexture) props.texture = items[0].texture;
    if (hasTransform) props.transform = items[0].transform;

    return use(UIRectangles, props);
  };
};
