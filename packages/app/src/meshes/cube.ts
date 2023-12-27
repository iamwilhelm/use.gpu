import type { VertexData, DataTexture, DataSchema } from '@use-gpu/core';
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

export const meshSchema = {
  positions: {format: 'vec4<f32>'},
  normals: {format: 'vec4<f32>'},
  colors: {format: 'vec4<f32>'},
  uvs: {format: 'vec2<f32>'},
} as DataSchema;

// Vertex attribute layout (only for illustration purposes)
export const meshAttributes = makeVertexAttributeLayout([
  { name: 'positions', format: 'float32x4' },
  { name: 'normals', format: 'float32x4' },
  { name: 'colors', format: 'float32x4' },
  { name: 'uvs', format: 'float32x2' },
]);

export const meshVertexArray = new Float32Array([
  // float4 position, float4 normal, float4 color, float2 uv,
  1, -1, 1, 1,   0, -1, 0, 0,  1, 0, 1, 1,  0, 1,
  -1, -1, 1, 1,  0, -1, 0, 0,  0, 0, 1, 1,  1, 1,
  -1, -1, -1, 1, 0, -1, 0, 0,  0, 0, 0, 1,  1, 0,
  1, -1, -1, 1,  0, -1, 0, 0,  1, 0, 0, 1,  0, 0,
  1, -1, 1, 1,   0, -1, 0, 0,  1, 0, 1, 1,  0, 1,
  -1, -1, -1, 1, 0, -1, 0, 0,  0, 0, 0, 1,  1, 0,

  1, 1, 1, 1,    1, 0, 0, 0,   1, 1, 1, 1,  0, 1,
  1, -1, 1, 1,   1, 0, 0, 0,   1, 0, 1, 1,  1, 1,
  1, -1, -1, 1,  1, 0, 0, 0,   1, 0, 0, 1,  1, 0,
  1, 1, -1, 1,   1, 0, 0, 0,   1, 1, 0, 1,  0, 0,
  1, 1, 1, 1,    1, 0, 0, 0,   1, 1, 1, 1,  0, 1,
  1, -1, -1, 1,  1, 0, 0, 0,   1, 0, 0, 1,  1, 0,

  -1, 1, 1, 1,   0, 1, 0, 0,   0, 1, 1, 1,  0, 1,
  1, 1, 1, 1,    0, 1, 0, 0,   1, 1, 1, 1,  1, 1,
  1, 1, -1, 1,   0, 1, 0, 0,   1, 1, 0, 1,  1, 0,
  -1, 1, -1, 1,  0, 1, 0, 0,   0, 1, 0, 1,  0, 0,
  -1, 1, 1, 1,   0, 1, 0, 0,   0, 1, 1, 1,  0, 1,
  1, 1, -1, 1,   0, 1, 0, 0,   1, 1, 0, 1,  1, 0,

  -1, -1, 1, 1,  -1, 0, 0, 0,  0, 0, 1, 1,  0, 1,
  -1, 1, 1, 1,   -1, 0, 0, 0,  0, 1, 1, 1,  1, 1,
  -1, 1, -1, 1,  -1, 0, 0, 0,  0, 1, 0, 1,  1, 0,
  -1, -1, -1, 1, -1, 0, 0, 0,  0, 0, 0, 1,  0, 0,
  -1, -1, 1, 1,  -1, 0, 0, 0,  0, 0, 1, 1,  0, 1,
  -1, 1, -1, 1,  -1, 0, 0, 0,  0, 1, 0, 1,  1, 0,

  1, 1, 1, 1,    0, 0, 1, 0,   1, 1, 1, 1,  0, 1,
  -1, 1, 1, 1,   0, 0, 1, 0,   0, 1, 1, 1,  1, 1,
  -1, -1, 1, 1,  0, 0, 1, 0,   0, 0, 1, 1,  1, 0,
  -1, -1, 1, 1,  0, 0, 1, 0,   0, 0, 1, 1,  1, 0,
  1, -1, 1, 1,   0, 0, 1, 0,   1, 0, 1, 1,  0, 0,
  1, 1, 1, 1,    0, 0, 1, 0,   1, 1, 1, 1,  0, 1,

  1, -1, -1, 1,  0, 0, -1, 0,  1, 0, 0, 1,  0, 1,
  -1, -1, -1, 1, 0, 0, -1, 0,  0, 0, 0, 1,  1, 1,
  -1, 1, -1, 1,  0, 0, -1, 0,  0, 1, 0, 1,  1, 0,
  1, 1, -1, 1,   0, 0, -1, 0,  1, 1, 0, 1,  0, 0,
  1, -1, -1, 1,  0, 0, -1, 0,  1, 0, 0, 1,  0, 1,
  -1, 1, -1, 1,  0, 0, -1, 0,  0, 1, 0, 1,  1, 0,
]);
