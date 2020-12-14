import {TypedArrayConstructor, UniformType} from './types';

export const TYPED_ARRAYS: TypedArrayConstructor[] = [
  Int8Array, Uint8Array,
  Int16Array, Uint16Array,
  Int32Array, Uint32Array,
  Uint8ClampedArray,
  Float32Array, Float64Array,
];

export const VERTEX_SIZES = {
  "uchar2": 2,
  "uchar4": 4,
  "uchar2norm": 2,
  "uchar4norm": 4,
  "char2": 2,
  "char4": 4,
  "char2norm": 2,
  "char4norm": 4,
  "ushort2": 4,
  "ushort4": 8,
  "ushort2norm": 4,
  "ushort4norm": 8,
  "short2": 4,
  "short4": 8,
  "short2norm": 4,
  "short4norm": 8,
  "half2": 4,
  "half4": 8,
  "float": 4,
  "float2": 8,
  "float3": 12,
  "float4": 16,
  "uint": 4,
  "uint2": 8,
  "uint3": 12,
  "uint4": 16,
  "int": 4,
  "int2": 8,
  "int3": 12,
  "int4": 16,
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

export const VERTEX_ATTRIBUTE_SIZES = VERTEX_SIZES as {[t in GPUVertexFormat]: number};

export const UNIFORM_ATTRIBUTE_SIZES = UNIFORM_SIZES as {[t in UniformType]: number};
