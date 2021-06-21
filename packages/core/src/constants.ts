import {TypedArrayConstructor, UniformType} from './types';

export const TYPED_ARRAYS: TypedArrayConstructor[] = [
  Int8Array, Uint8Array,
  Int16Array, Uint16Array,
  Int32Array, Uint32Array,
  Uint8ClampedArray,
  Float32Array, Float64Array,
];

export const VERTEX_SIZES = {
  "uint8x2": 2,
  "uint8x4": 4,
  "sint8x2": 2,
  "sint8x4": 4,
  "unorm8x2": 2,
  "unorm8x4": 4,
  "snorm8x2": 2,
  "snorm8x4": 4,
  "uint16x2": 4,
  "uint16x4": 8,
  "sint16x2": 4,
  "sint16x4": 8,
  "unorm16x2": 4,
  "unorm16x4": 8,
  "snorm16x2": 4,
  "snorm16x4": 8,
  "float16x2": 4,
  "float16x4": 8,
  "float32": 4,
  "float32x2": 8,
  "float32x3": 12,
  "float32x4": 16,
  "uint32": 4,
  "uint32x2": 8,
  "uint32x3": 12,
  "uint32x4": 16,
  "sint32": 4,
  "sint32x2": 8,
  "sint32x3": 12,
  "sint32x4": 16,
};

export const UNIFORM_SIZES = {
  "bool":    1,
  "bvec2":   2,
  "bvec3":   3,
  "bvec4":   4,

  "uint":    4,
  "uvec2":   8,
  "uvec3":   12,
  "uvec4":   16,

  "int":     4,
  "ivec2":   8,
  "ivec3":   12,
  "ivec4":   16,

  "float":   4,
  "vec2":    8,
  "vec3":    12,
  "vec4":    16,

  "double":  8,
  "dvec2":   16,
  "dvec3":   24,
  "dvec4":   32,

  "mat2":    16,
  "mat2x2":  16,
  "mat3x2":  24,
  "mat2x3":  24,
  "mat2x4":  32,
  "mat4x2":  32,
  "mat3":    36,
  "mat3x3":  36,
  "mat3x4":  48,
  "mat4x3":  48,
  "mat4":    64,
  "mat4x4":  64,

  "dmat2":   32,
  "dmat2x2": 32,
  "dmat3x2": 48,
  "dmat2x3": 48,
  "dmat2x4": 64,
  "dmat4x2": 64,
  "dmat3":   72,
  "dmat3x3": 72,
  "dmat3x4": 96,
  "dmat4x3": 96,
  "dmat4":   128,
  "dmat4x4": 128,
};

// @ts-ignore
export const VERTEX_ATTRIBUTE_SIZES = VERTEX_SIZES as {[t in GPUVertexFormat]: number};

export const UNIFORM_ATTRIBUTE_SIZES = UNIFORM_SIZES as {[t in UniformType]: number};
