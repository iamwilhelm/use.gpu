import type { AggregateBuffer, AggregateValue, MultiAggregateBuffer, UniformType, VirtualAggregateBuffer } from './types';

import { resolve } from './lazy';
import { makeStorageBuffer, uploadBuffer } from './buffer';
import { incrementVersion } from './id';
import {
  alignSizeTo,
  castRawArray,
  makeRawArray,
  makeDataArray,
  copyNumberArray,
  fillNumberArray,
  offsetNumberArray,
  unweldNumberArray,
  spreadNumberArray,
} from './data';
import { makeUniformLayout, toCPUDims, toGPUDims } from './uniform';
import { toMurmur53, mixBits53 } from '@use-gpu/state';

export const getAggregateArchetype = (
  formats: Record<string, string>,
  unwelded?: Record<string, boolean>,
) => mixBits53(toMurmur53(formats), toMurmur53(unwelded));

export const getAggregateSummary = (items: AggregateItem[]) => {
  const n = items.length;
  const archetype = items[0]?.archetype ?? 0;

  let indexOffsets = [];

  let allCount = 0;
  let allIndexed = 0;
  let allInstanced = 0;

  for (let i = 0; i < n; ++i) {
    const {count, indexed, instanced} = items[i];
    if (indexed != null) indexOffsets.push(allCount);
    allCount += count;
    allIndexed += indexed ?? count;
    allInstanced += instanced ?? 1;
  }
  
  return {archetype, count: allCount, indexed: allIndexed, instanced: allInstanced, offsets: indexOffsets};
};

export const makeAggregateBuffer = (
  device: GPUDevice,
  format: UniformType,
  length: number,
): AggregateBuffer => {
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

export const makeMultiAggregateBuffer = (
  device: GPUDevice,
  uniforms: UniformAttribute[],
  length: number,
  keys?: string[],
): MultiAggregateBuffer => {
  const layout = makeUniformLayout(uniforms);

  const {length: bytes} = layout;
  const raw = makeRawArray(bytes * length);

  const buffer = makeStorageBuffer(device, bytes * length);
  const source = {
    buffer,
    format: uniforms,
    length,
    size: [length],
    version: 0,
  };

  keys = keys ?? layout.attributes.map(({name}) => name);

  return {buffer, raw, source, layout, keys};
}

export const makeMultiAggregateFields = (aggregateBuffer: AggregateBuffer) => {
  const {layout: {length, attributes}, buffer, raw} = aggregateBuffer;

  const out: Record<string, VirtualAggregateBuffer> = {};
  for (const {name, offset, format} of attributes) {
    const {array, dims} = castRawArray(raw, format);

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

export const updateAggregateBuffer = (
  device: GPUDevice,
  aggregate: AggregateBuffer | VirtualAggregateBuffer,
  items: AggregateItem[],
  key: string,
  unwelded?: boolean,
  single?: boolean,
  offsets?: number[],
) => {
  const {buffer, array, source, dims, base, stride} = aggregate;
  
  // vec3/mat3 to vec4/mat4 extension
  // 3.5 = 3to4, 7.5 = 6to8, 11.5 = 9to12, 15.5 = 12to16
  const dimsIn = toCPUDims(dims);
  const dimsOut = toGPUDims(dims);
  const step = stride ?? dimsOut;

  let i = 0;
  let b = base || 0;
  for (const item of items) {
    const {
      count,
      indexed = count,
      instanced = 1,
      attributes: {
        [key]: values,
      },
    } = item;

    const c = single ? instanced : unwelded ? indexed : count;

    if (typeof values === 'function') values(array, b, c, stride);
    else if (offsets && offsets !== true) offsetNumberArray(values, array, offsets[i], dimsIn, dimsOut, 0, b, c, stride);
    else copyNumberArray(values, array, dimsIn, dimsOut, 0, b, c, stride);

    b += c * step;
    i++;
  }

  if (buffer) uploadStorage(device, source, array.buffer, b);
}

export const updateAggregateInstances = (
  device: GPUDevice,
  aggregate: AggregateBuffer,
  items: AggregateItem[],
  count: number,
) => {
  const {array, source, layout} = aggregate;
  const slices = [];

  for (const {count, indexed, slices: s} of items) {
    if (s) slices.push(...s);
    else slices.push(indexed ?? count);
  }

  spreadNumberArray(null, array, slices);
  uploadStorage(device, source, array.buffer, count);
  return source;
}

export const updateMultiAggregateBuffer = (
  device: GPUDevice,
  aggregate: AggregateBuffer,
  count: number,
) => {
  const {buffer, raw, source, layout} = aggregate;
  uploadStorage(device, source, raw, count);
  return source;
}

export const updateAggregateRefs = (
  device: GPUDevice,
  aggregate: AggregateBuffer,
  refs: Lazy<any>[],
  count: number,
) => {
  const {buffer, array, source, dims, base, stride} = aggregate;
  const step = stride || dims;

  let b = base || 0;
  for (const ref of refs) {
    copyNumberArray(resolve(ref), array, toCPUDims(dims), toGPUDims(dims), 0, b, 1, stride);
    b += step;
  }

  if (buffer) uploadStorage(device, source, array.buffer, count);
}

export const uploadStorage = (
  device: GPUDevice,
  source: StorageStorage,
  arrayBuffer: ArrayBuffer,
  count: number,
  size?: number,
) => {
  uploadBuffer(device, source.buffer, arrayBuffer);

  if (size) source.size = size;
  else source.size[0] = count;

  source.length = count;
  source.version = incrementVersion(source.version);
};
