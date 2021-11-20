import { TYPED_ARRAYS, TEXTURE_FORMAT_SIZES, TEXTURE_FORMAT_DIMS } from './constants';
import { TypedArrayConstructor, TypedArray } from './types';

type BufferArray = TypedArray | number[] | ArrayBuffer | number;

export const getByteSize = (data: BufferArray): number => {
  if (+data === data) return +data;
  return (data as any).byteLength as number;
}

export const getTypedArrayConstructor = (t: TypedArray): TypedArrayConstructor => {
  for (const constructor of TYPED_ARRAYS) if (t instanceof constructor) return constructor;
  throw new Error("Unknown typed array");
}

export const makeVertexBuffers = (device: GPUDevice, datas: TypedArray[]): GPUBuffer[] =>
  datas.map((data: TypedArray) => makeVertexBuffer(device, data));

export const makeVertexBuffer = (device: GPUDevice, data: TypedArray): GPUBuffer => {
  const vertices = device.createBuffer({
    size: getByteSize(data),
    usage: GPUBufferUsage.VERTEX,
    mappedAtCreation: true,
  });

  const ArrayType = getTypedArrayConstructor(data);
  if (ArrayType) new ArrayType(vertices.getMappedRange()).set(data);

  vertices.unmap();

  return vertices;
}

export const makeUniformBuffer = (device: GPUDevice, data: BufferArray): GPUBuffer =>
  device.createBuffer({
    size: getByteSize(data),
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

export const makeStorageBuffer = (device: GPUDevice, data: BufferArray): GPUBuffer =>
  device.createBuffer({
    size: getByteSize(data),
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });

export const makeTextureReadbackBuffer = (
  device: GPUDevice,
  width: number,
  height: number,
  format: GPUTextureFormat,
): GPUBuffer => {
  const s = TEXTURE_FORMAT_SIZES[format] || 1;
  const d = TEXTURE_FORMAT_DIMS[format] || 1;
  const minBytes = width * s;

  const partialBlock = minBytes % 256;
  const paddingSize = partialBlock ? 256 - partialBlock : 0;

  const bytesPerRow = minBytes + paddingSize;
  const itemsPerRow = bytesPerRow / d / s;

  if (itemsPerRow !== Math.round(itemsPerRow)) throw new Error("Readback size not a multiple of item size");

  const n = bytesPerRow * height * s;
  const buffer = device.createBuffer({
    size: n,
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
  });

  return [buffer, bytesPerRow, itemsPerRow];
}

export const uploadBuffer = (
  device: GPUDevice,
  buffer: GPUBuffer,
  data: ArrayBuffer,
): void => {
  // @ts-ignore
  device.queue.writeBuffer(buffer, 0, data, 0, data.byteLength);
}