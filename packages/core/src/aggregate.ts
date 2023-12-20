import type { AggregateBuffer, MultiAggregateBuffer, UniformType, VirtualAggregateBuffer } from './types';

import { resolve } from './lazy';
import { makeStorageBuffer, uploadBuffer } from './buffer';
import { incrementVersion } from './id';
import {
  alignSizeTo,
  castRawArray2,
  makeRawArray2,
  makeDataArray2,
  copyNumberArray2,
  fillNumberArray2,
  unweldNumberArray2,
} from './data2';
import { makeUniformLayout } from './uniform';
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

export const makeMultiAggregateBuffer = (device: GPUDevice, uniforms: UniformAttribute[], length: number): MultiAggregateBuffer => {
  const layout = makeUniformLayout(uniforms);

  const {length: bytes} = layout;
  const raw = makeRawArray2(bytes, length);

  const buffer = makeStorageBuffer(device, bytes);
  const source = {
    buffer,
    format: uniforms,
    length,
    size: [length],
    version: 0,
  };

  return {buffer, raw, source, layout};
}

export const makeMultiAggregateFields = (aggregateBuffer: AggregateBuffer) => {
  const {layout: {length, attributes}, buffer, raw} = aggregateBuffer;

  const out: Record<string, VirtualAggregateBuffer> = {};
  for (const {name, offset, format} of attributes) {
    const {array, dims} = castRawArray2(raw, format);

    const elementSize = array.byteLength / array.length;
    const base = offset / elementSize;
    const stride = length / elementSize;

    if (base !== (base|0) || stride !== (stride|0)) throw new Error('Unaligned field data');

    out[name] = {
      array,
      base,
      stride,
      dims,
    };
  }
  return out;
};

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
  aggregate: AggregateBuffer | VirtualAggregateBuffer,
  items: Record<string, any>[],
  count: number,
  key: string,
  keys: string,
) => {
  const {buffer, array, source, dims, base, stride} = aggregate;

  let i = 0;
  let b = base;
  for (const item of items) {
    const {
      count,
      attributes: {
        [key]: single,
        [keys]: multiple,
      },
    } = item as any;

    //if (stride > 1) debugger;
    //if (key === 'color' && 'width' in item.attributes) debugger;

    if (multiple != null) {
      if (typeof multiple === 'function') multiple(array, b, count, stride);
      else copyNumberArray2(multiple, array, dims, 0, b, count, stride);
    }
    else if (single != null) {
      if (typeof single === 'function') {
        single(array, b, count);
      }
      else fillNumberArray2(single, array, dims, 0, b, count, stride);
    }

    b += count;
    i++;
  }

  if (buffer) uploadSource(device, source, array.buffer, count);
}

export const updateMultiAggregateBuffer = (
  device: GPUDevice,
  aggregate: AggregateBuffer,
  count: number,
) => {
  const {buffer, raw, source, layout} = aggregate;
  uploadSource(device, source, raw, count);
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

  if (buffer) uploadSource(device, source, array.buffer, count);
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

  if (buffer) uploadSource(device, source, array.buffer, count);
}

