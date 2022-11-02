import type { MeshData } from '@use-gpu/core';
import { makeDataEmitter } from '@use-gpu/core';

export const makePlaneGeometry = (
  width: number = 1,
  height: number = width,
  axes: string = 'xy',
) => {
  const count = 6;

  const positions = new Float32Array(count * 4);
  const normals = new Float32Array(count * 4);
  const uvs = new Float32Array(count * 4);

  const {emit: positionEmitter} = makeDataEmitter(positions, 4);
  const {emit: normalEmitter} = makeDataEmitter(normals, 4);
  const {emit: uvEmitter} = makeDataEmitter(uvs, 4);

  const [first, second] = axes.split('');

  const emitPosition = (x: number, y: number) => {
    let xx = 0;
    let yy = 0;
    let zz = 0;

    if      (first === 'x') xx = x * width;
    else if (first === 'y') yy = x * width;
    else if (first === 'z') zz = x * width;

    if      (second === 'x') xx = y * height;
    else if (second === 'y') yy = y * height;
    else if (second === 'z') zz = y * height;

    positionEmitter(xx, yy, zz, 1);
  };

  const emitNormal = (x: number, y: number, z: number) =>
    normalEmitter(x, y, z, 0);

  const emitUV = (x: number, y: number) =>
    uvEmitter(x, y, 0, 0);

  emitPosition(0, 0);
  emitPosition(0, 1);
  emitPosition(1, 0);

  emitPosition(1, 0);
  emitPosition(0, 1);
  emitPosition(1, 1);

  const nx = +axes.indexOf('x') === -1;
  const ny = +axes.indexOf('x') === -1;
  const nz = +axes.indexOf('x') === -1;
  for (let i = 0; i < 6; ++i) emitNormal(nx, ny, nz);

  emitUV(0, 0);
  emitUV(0, 1);
  emitUV(1, 0);

  emitUV(1, 0);
  emitUV(0, 1);
  emitUV(1, 1);

  return {
    count,
    attributes: {positions, normals, uvs},
    formats: {positions: 'vec4<f32>', normals: 'vec4<f32>', uvs: 'vec4<f32>'},
  };
}
