import {TYPED_ARRAYS} from './constants';
import {TypedArrayConstructor, TypedArray} from './types';

export const getTypedArrayConstructor = <T>(t: TypedArray): TypedArrayConstructor => {
  for (let constructor of TYPED_ARRAYS) if (t instanceof constructor) return constructor;
  throw new Error("Unknown typed array");
}

export const makeVertexBuffers = (device: GPUDevice, datas: TypedArray[]) =>
  datas.map((data: TypedArray) => makeVertexBuffer(device, data));

export const makeVertexBuffer = (device: GPUDevice, data: TypedArray) => {
  const vertices = device.createBuffer({
    size: data.byteLength,
    usage: GPUBufferUsage.VERTEX,
    mappedAtCreation: true,
  });

  const ArrayType = getTypedArrayConstructor(data);
  if (ArrayType) new ArrayType(vertices.getMappedRange()).set(data);

  vertices.unmap();

  return vertices;
}

export const makeUniformBuffer = (device: GPUDevice, data: ArrayBuffer) =>
  device.createBuffer({
    size: data.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

export const uploadBuffer = (
  device: GPUDevice,
  buffer: GPUBuffer,
  data: ArrayBuffer,
) => {
  device.queue.writeBuffer(buffer, 0, data, 0, data.byteLength);
}