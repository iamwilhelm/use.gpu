import type { VertexData, DataTexture } from '@use-gpu/core';
import { makeVertexAttributeLayout } from '@use-gpu/core';

export const makeMesh = (): VertexData => {
  const vertices   = [meshVertexArray]
  const attributes = [meshAttributes];

  return {vertices, attributes, count: 36};
}

export const makeTexture = (): DataTexture => {
  return rawTextureRGBA;
}

export const rawTextureRGBA: DataTexture = {
  data: new Uint8Array([
    0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 
    0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 
    0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 
    0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 
    255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255,
    255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255,
    255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255,
    255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255,
  ]),
  format: "rgba8unorm",
  size: [8, 8],
};

export const meshAttributes = makeVertexAttributeLayout([
  // @ts-ignore
  { name: 'position', format: 'float32x4' },
  // @ts-ignore
  { name: 'normal', format: 'float32x4' },
  // @ts-ignore
  { name: 'color', format: 'float32x4' },
  // @ts-ignore
  { name: 'uv', format: 'float32x2' },
]);

export const meshVertexArray = new Float32Array([
  // float4 position, float4 normal, float4 color, float2 uv,
  1, -1, 1, 1,   0, -1, 0, 0,  1, 0, 1, 1,  1, 1,
  -1, -1, 1, 1,  0, -1, 0, 0,  0, 0, 1, 1,  0, 1,
  -1, -1, -1, 1, 0, -1, 0, 0,  0, 0, 0, 1,  0, 0,
  1, -1, -1, 1,  0, -1, 0, 0,  1, 0, 0, 1,  1, 0,
  1, -1, 1, 1,   0, -1, 0, 0,  1, 0, 1, 1,  1, 1,
  -1, -1, -1, 1, 0, -1, 0, 0,  0, 0, 0, 1,  0, 0,

  1, 1, 1, 1,    1, 0, 0, 0,   1, 1, 1, 1,  1, 1,
  1, -1, 1, 1,   1, 0, 0, 0,   1, 0, 1, 1,  0, 1,
  1, -1, -1, 1,  1, 0, 0, 0,   1, 0, 0, 1,  0, 0,
  1, 1, -1, 1,   1, 0, 0, 0,   1, 1, 0, 1,  1, 0,
  1, 1, 1, 1,    1, 0, 0, 0,   1, 1, 1, 1,  1, 1,
  1, -1, -1, 1,  1, 0, 0, 0,   1, 0, 0, 1,  0, 0,

  -1, 1, 1, 1,   0, 1, 0, 0,   0, 1, 1, 1,  1, 1,
  1, 1, 1, 1,    0, 1, 0, 0,   1, 1, 1, 1,  0, 1,
  1, 1, -1, 1,   0, 1, 0, 0,   1, 1, 0, 1,  0, 0,
  -1, 1, -1, 1,  0, 1, 0, 0,   0, 1, 0, 1,  1, 0,
  -1, 1, 1, 1,   0, 1, 0, 0,   0, 1, 1, 1,  1, 1,
  1, 1, -1, 1,   0, 1, 0, 0,   1, 1, 0, 1,  0, 0,

  -1, -1, 1, 1,  -1, 0, 0, 0,  0, 0, 1, 1,  1, 1,
  -1, 1, 1, 1,   -1, 0, 0, 0,  0, 1, 1, 1,  0, 1,
  -1, 1, -1, 1,  -1, 0, 0, 0,  0, 1, 0, 1,  0, 0,
  -1, -1, -1, 1, -1, 0, 0, 0,  0, 0, 0, 1,  1, 0,
  -1, -1, 1, 1,  -1, 0, 0, 0,  0, 0, 1, 1,  1, 1,
  -1, 1, -1, 1,  -1, 0, 0, 0,  0, 1, 0, 1,  0, 0,

  1, 1, 1, 1,    0, 0, 1, 0,   1, 1, 1, 1,  1, 1,
  -1, 1, 1, 1,   0, 0, 1, 0,   0, 1, 1, 1,  0, 1,
  -1, -1, 1, 1,  0, 0, 1, 0,   0, 0, 1, 1,  0, 0,
  -1, -1, 1, 1,  0, 0, 1, 0,   0, 0, 1, 1,  0, 0,
  1, -1, 1, 1,   0, 0, 1, 0,   1, 0, 1, 1,  1, 0,
  1, 1, 1, 1,    0, 0, 1, 0,   1, 1, 1, 1,  1, 1,

  1, -1, -1, 1,  0, 0, -1, 0,  1, 0, 0, 1,  1, 1,
  -1, -1, -1, 1, 0, 0, -1, 0,  0, 0, 0, 1,  0, 1,
  -1, 1, -1, 1,  0, 0, -1, 0,  0, 1, 0, 1,  0, 0,
  1, 1, -1, 1,   0, 0, -1, 0,  1, 1, 0, 1,  1, 0,
  1, -1, -1, 1,  0, 0, -1, 0,  1, 0, 0, 1,  1, 1,
  -1, 1, -1, 1,  0, 0, -1, 0,  0, 1, 0, 1,  0, 0,
]);
