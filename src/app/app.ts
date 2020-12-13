import {cubeVertexArray, cubeAttributes} from './cube';

export const cube = (device: GPUDevice) => {

  const vertices = device.createBuffer({
     size: cubeVertexArray.byteLength,
     usage: GPUBufferUsage.VERTEX,
     mappedAtCreation: true,
   });

   new Float32Array(vertices.getMappedRange()).set(cubeVertexArray);

   vertices.unmap();

   const attributes = cubeAttributes;

   return {vertices, attributes};
}