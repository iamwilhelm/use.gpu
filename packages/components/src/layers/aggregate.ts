import { LiveComponent } from '@use-gpu/live/types';
import { UniformType, TypedArray, StorageSource } from '@use-gpu/core/types';
import { LayerAggregate, LayerType } from './types';

import { RenderContext } from '../providers/render-provider';
import { use, resume, multiGather, useContext } from '@use-gpu/live';
import {
  makeDataArray,
  makeStorageBuffer,
  copyNumberArrayRange,
  copyNumberArrayRepeatedRange,
  copyNumberArrayCompositeRange,
  copyChunksToSegments,
  uploadBuffer,
} from '@use-gpu/core';

import { Rectangles } from './rectangles';
import { Lines } from './lines';

export type AggregateProps = {
  mode?: RenderPassMode | string,
  id?: number,
};

const allCount = (a: number, b: number): number => a + b.count + (b.isLoop ? 3 : 0);

const allKeys = (a: Set<string>, b: LayerAggregate): Set<string> => {
  for (let k in b) a.add(k);
  return a;
}

export const Aggregate: LiveComponent<AggregateProps> = (fiber) => (props) => {
  const {render, children} = props;
  return multiGather(children ?? (render ? render() : null), Resume);
};

const Resume = resume((fiber) => (
  aggregates: Record<string, LayerAggregate[]>
) => {
  const {device} = useContext(RenderContext);

  const out = [] as LiveElement[];
  for (const type in aggregates) {
    if (type === LayerType.Line) {
      const props = aggregateLines(device, aggregates[type]);
      out.push(use(Lines)(props));      
    }
    else if (type === LayerType.Rectangle) {
      const props = aggregateRectangles(device, aggregates[type]);
      out.push(use(Rectangles)(props));
    }
  }

  return out;
}, 'Aggregate');

const aggregateLines = (
  device: GPUDevice,
  items: LineAggregate[],
) => {
  const keys = items.reduce(allKeys, new Set());
  const count = items.reduce(allCount, 0);
  const props = {count, join: 'miter'};

  const hasPosition = keys.has('positions') || keys.has('position');
  const hasSegment = keys.has('segments') || keys.has('segment');
  const hasColor = keys.has('colors') || keys.has('color');
  const hasSize = keys.has('sizes') || keys.has('size');
  const hasDepth = keys.has('depths') || keys.has('depth');

  if (hasSegment) props.segments = makeAggregateSource(device, UniformType.int, items, count, 'segment', 'segments').source;
  else props.segments = makeAggregateSegments(device, items, count).source;

  if (hasPosition) props.positions = makeAggregateSource(device, UniformType.vec4, items, count, 'position', 'positions').source;
  if (hasColor) props.colors = makeAggregateSource(device, UniformType.vec4, items, count, 'color', 'colors').source;
  if (hasSize) props.sizes = makeAggregateSource(device, UniformType.float, items, count, 'size', 'sizes').source;
  if (hasDepth) props.depth = makeAggregateSource(device, UniformType.float, items, count, 'depth', 'depths').source;

  return props;
};

const aggregateRectangles = (
  device: GPUDevice,
  items: RectangleAggregate[],
) => {
  const keys = items.reduce(allKeys, new Set());
  const count = items.reduce(allCount, 0);
  const props = {count};

  const hasRectangle = keys.has('rectangles') || keys.has('rectangle');
  const hasColor = keys.has('colors') || keys.has('color');

  if (hasRectangle) props.rectangles = makeAggregateSource(device, UniformType.vec4, items, count, 'rectangle', 'rectangles').source;
  if (hasColor) props.colors = makeAggregateSource(device, UniformType.vec4, items, count, 'color', 'colors').source;

  return props;
};

const makeAggregateSegments = (
  device: GPUDevice,
  items: LayerAggregate[],
  count: number,
) => {
  const aggregate = makeAggregateBuffer(device, 'int', count);
  const {buffer, array, source, dims} = aggregate;

  const chunks = [] as number[];
  const loops = [] as boolean[];

  for (const item of items) {
    const {count, isLoop} = item;
    chunks.push(count);
    loops.push(!!isLoop);
  }

  copyChunksToSegments(array, chunks, loops);
  uploadBuffer(device, buffer, array.buffer);
  console.log('segments', array);

  return aggregate;
}

const makeAggregateSource = (
  device: GPUDevice,
  format: UniformType,
  items: LayerAggregate[],
  count: number,
  key: string,
  keys: string,
) => {
  const aggregate = makeAggregateBuffer(device, format, count);
  const {buffer, array, source, dims} = aggregate;

  let pos = 0;
  for (const item of items) {
    const {count, [key]: single, [keys]: multiple, isLoop} = item;

    if (multiple) copyNumberArrayCompositeRange(multiple, array, 0, pos, dims, count, isLoop);
    else if (single) copyNumberArrayRepeatedRange(single, array, 0, pos, dims, count, isLoop);

    const n = count + (isLoop ? 3 : 0);
    pos += n * dims;
  }

  uploadBuffer(device, buffer, array.buffer);
  console.log(key, array);

  return aggregate;
}

const makeAggregateBuffer = (device: GPUDevice, format: UniformType, length: number) => {
  const {array, dims} = makeDataArray(format, length);
  if (dims === 3) throw new Error("Dims must be 1, 2, or 4");

  const buffer = makeStorageBuffer(device, array.byteLength);
  const source = {
    buffer,
    format,
    length,
    version: 0,
  };

  return {buffer, array, source, dims};
}
