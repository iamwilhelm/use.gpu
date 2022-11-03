import type { MeshData } from '@use-gpu/core';
import { makeDataEmitter } from '@use-gpu/core';

export const makeBoxGeometry = (
  sizeX: number = 1,
  sizeY: number = sizeX,
  sizeZ: number = sizeX,
) => {
  const count = 36;

  const positions = new Float32Array(count * 4);
  const normals = new Float32Array(count * 4);
  const uvs = new Float32Array(count * 4);

  const {emit: positionEmitter} = makeDataEmitter(positions, 4);
  const {emit: normalEmitter} = makeDataEmitter(normals, 4);
  const {emit: uvEmitter} = makeDataEmitter(uvs, 4);

  const emitPosition = (x: number, y: number, z: number) =>
    positionEmitter(x * sizeX / 2, y * sizeY / 2, z * sizeZ / 2, 1);

  const emitNormal = (x: number, y: number, z: number) =>
    normalEmitter(x, y, z, 0);

  const emitUV = (x: number, y: number) =>
    uvEmitter(x, y, 0, 0);

  emitPosition(1, 1, -1);
  emitPosition(-1, -1, -1);
  emitPosition(-1, 1, -1);
  emitPosition(1, -1, -1);
  emitPosition(-1, -1, -1);
  emitPosition(1, 1, -1);

  emitPosition(1, 1, 1);
  emitPosition(1, -1, -1);
  emitPosition(1, 1, -1);
  emitPosition(1, -1, 1);
  emitPosition(1, -1, -1);
  emitPosition(1, 1, 1);

  emitPosition(-1, 1, 1);
  emitPosition(1, -1, 1);
  emitPosition(1, 1, 1);
  emitPosition(-1, -1, 1);
  emitPosition(1, -1, 1);
  emitPosition(-1, 1, 1);

  emitPosition(-1, 1, -1);
  emitPosition(-1, -1, 1);
  emitPosition(-1, 1, 1);
  emitPosition(-1, -1, -1);
  emitPosition(-1, -1, 1);
  emitPosition(-1, 1, -1);

  emitPosition(1, 1, 1);
  emitPosition(-1, 1, -1);
  emitPosition(-1, 1, 1);
  emitPosition(-1, 1, -1);
  emitPosition(1, 1, 1);
  emitPosition(1, 1, -1);

  emitPosition(1, -1, -1);
  emitPosition(-1, -1, 1);
  emitPosition(-1, -1, -1);
  emitPosition(1, -1, 1);
  emitPosition(-1, -1, 1);
  emitPosition(1, -1, -1);
  
  for (let i = 0; i < 6; ++i) emitNormal( 0, 0,-1);
  for (let i = 0; i < 6; ++i) emitNormal( 1, 0, 0);
  for (let i = 0; i < 6; ++i) emitNormal( 0, 0, 1);
  for (let i = 0; i < 6; ++i) emitNormal(-1, 0, 0);
  for (let i = 0; i < 6; ++i) emitNormal( 0, 1, 0);
  for (let i = 0; i < 6; ++i) emitNormal( 0,-1, 0);

  emitUV(0, 0);
  emitUV(1, 1);
  emitUV(1, 0);
  emitUV(0, 1);
  emitUV(1, 1);
  emitUV(0, 0);

  emitUV(0, 0);
  emitUV(1, 1);
  emitUV(1, 0);
  emitUV(0, 1);
  emitUV(1, 1);
  emitUV(0, 0);

  emitUV(0, 0);
  emitUV(1, 1);
  emitUV(1, 0);
  emitUV(0, 1);
  emitUV(1, 1);
  emitUV(0, 0);

  emitUV(0, 0);
  emitUV(1, 1);
  emitUV(1, 0);
  emitUV(0, 1);
  emitUV(1, 1);
  emitUV(0, 0);

  emitUV(0, 0);
  emitUV(1, 1);
  emitUV(1, 0);
  emitUV(1, 1);
  emitUV(0, 0);
  emitUV(0, 1);

  emitUV(0, 0);
  emitUV(1, 1);
  emitUV(1, 0);
  emitUV(0, 1);
  emitUV(1, 1);
  emitUV(0, 0);

  return {
    count,
    attributes: {positions, normals, uvs},
    formats: {positions: 'vec4<f32>', normals: 'vec4<f32>', uvs: 'vec4<f32>'},
  };
}
