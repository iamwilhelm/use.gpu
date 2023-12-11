import type { AggregateBuffer, UniformType } from './types';

import { makeStorageBuffer, uploadBuffer } from './buffer';
import {
  alignSizeTo,
  makeDataArray,
  copyNumberArrayRange,
  copyNumberArrayRepeatedRange,
  copyNumberArrayCompositeRange,
  generateChunkSegments,
  generateChunkFaces,
} from './data';
import { incrementVersion } from './id';
import { toMurmur53, mixBits53 } from '@use-gpu/state';

export const getAggregateArchetype = (
  formats: Record<string, string>,
  unwelded?: Record<string, boolean>,
) => mixBits53(toMurmur53(formats), toMurmur53(unwelded));

export const makeAggregateBuffer = (device: GPUDevice, format: UniformType, length: number): AggregateBuffer => {
  const {array, dims} = makeDataArray(format, length);

  const buffer = makeStorageBuffer(device, array.byteLength);
  const source = {
    buffer,
    format,
    length,
    size: [length],
    version: 0,
  };

  return {buffer, array, source, dims};
}

export const updateAggregateBuffer = (
  device: GPUDevice,
  aggregate: AggregateBuffer,
  items: Record<string, any>[],
  count: number,
  key: string,
  keys: string,
) => {
  const {buffer, array, source, dims} = aggregate;

  let pos = 0;
  for (const item of items) {
    const {count, attributes: {[key]: single, [keys]: multiple}} = item as any;

    if (multiple) copyNumberArrayCompositeRange(multiple, array, 0, pos, dims, count);
    else if (single) copyNumberArrayRepeatedRange(single, array, 0, pos, dims, count);

    pos += count * dims;
  }

  uploadBuffer(device, buffer, array.buffer);
  source.length = count;
  source.size = [count];
  source.version = incrementVersion(source.version);

  return source;
}

export const updateAggregateIndex = (
  device: GPUDevice,
  aggregate: AggregateBuffer,
  items: Record<string, any>[],
  count: number,
  offsets: number[],
  key: string,
  keys: string,
) => {
  const {buffer, array, source, dims} = aggregate;

  let pos = 0, i = 0;
  for (const item of items) {
    const {attributes: {[key]: single, [keys]: multiple}} = item as any;
    const count = multiple?.length ?? 1;

    if (multiple) copyNumberArrayCompositeRange(multiple, array, 0, pos, dims, count, false, offsets[i]);
    else if (single) copyNumberArrayRepeatedRange(single, array, 0, pos, dims, count, false, offsets[i]);

    pos += count * dims;
    i++;
  }

  uploadBuffer(device, buffer, array.buffer);
  source.length = count;
  source.size = [count];
  source.version = incrementVersion(source.version);

  return source;
}

export const updateAggregateSegments = (
  device: GPUDevice,
  segments: AggregateBuffer,
  chunks: number[],
  loops: boolean[],
  count: number,
) => {
  const {buffer, array, source, dims} = segments;

  generateChunkSegments(array, null, chunks, loops);
  uploadBuffer(device, buffer, array.buffer);

  source.length = count;
  source.size = [count];
  source.version = incrementVersion(source.version);

  return source;
}

export const updateAggregateFaces = (
  device: GPUDevice,
  segments: AggregateBuffer,
  chunks: number[],
  loops: boolean[],
  count: number,
) => {
  const {buffer, array, source, dims} = segments;

  generateChunkFaces(array, null, chunks, loops);
  uploadBuffer(device, buffer, array.buffer);

  source.length = count;
  source.size = [count];
  source.version = incrementVersion(source.version);

  return source;
}

