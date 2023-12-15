import type { AggregateBuffer, UniformType } from './types';

import { resolve } from './lazy';
import { makeStorageBuffer, uploadBuffer } from './buffer';
import {
  alignSizeTo,
  makeDataArray2,
  copyNumberArray2,
  fillNumberArray2,
  unweldNumberArray2,
} from './data2';
import { incrementVersion } from './id';
import { toMurmur53, mixBits53 } from '@use-gpu/state';

export const getAggregateArchetype = (
  formats: Record<string, string>,
  unwelded?: Record<string, boolean>,
) => mixBits53(toMurmur53(formats), toMurmur53(unwelded));

export const makeAggregateBuffer = (device: GPUDevice, format: UniformType, length: number): AggregateBuffer => {
  const {array, dims} = makeDataArray2(format, length);

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

export const uploadSource = (
  device: GPUDevice,
  source: StorageStorage,
  arrayBuffer: ArrayBuffer,
  count: number,
) => {
  uploadBuffer(device, source.buffer, arrayBuffer);
  source.length = count;
  source.size = [count];
  source.version = incrementVersion(source.version);
};

export const updateAggregateBuffer = (
  device: GPUDevice,
  aggregate: AggregateBuffer,
  items: Record<string, any>[],
  count: number,
  key: string,
  keys: string,
) => {
  const {buffer, array, source, dims} = aggregate;

  let i = 0;
  let base = 0;
  for (const item of items) {
    const {
      count,
      attributes: {
        [key]: single,
        [keys]: multiple,
      },
    } = item as any;

    //if (key === 'color' && 'width' in item.attributes) debugger;
    if (multiple != null) {
      if (typeof multiple === 'function') multiple(array, base, count);
      else copyNumberArray2(multiple, array, dims, 0, base, count);
    }
    else if (single != null) {
      if (typeof single === 'function') {
        single(array, base, count);
      }
      else fillNumberArray2(single, array, dims, 0, base, count);
    }

    base += count;
    i++;
  }

  uploadSource(device, source, array.buffer, count);
  return source;
}

export const updateAggregateRefs = (
  device: GPUDevice,
  aggregate: AggregateBuffer,
  refs: Lazy<any>[],
  count: number,
) => {
  const {buffer, array, source, dims} = aggregate;

  let i = 0;
  let base = 0;
  for (const ref of refs) {
    copyNumberArray2(resolve(ref), array, dims, 0, base, 1);
    base++;
    i++;
  }

  uploadSource(device, source, array.buffer, count);
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

    //if (multiple) copyNumberArrayCompositeRange(multiple, array, 0, pos, dims, count, false, offsets[i]);
    //else if (single) copyNumberArrayRepeatedRange(single, array, 0, pos, dims, count, false, offsets[i]);

    pos += count * dims;
    i++;
  }

  uploadSource(device, source, array.buffer, count);
  return source;
}

