export type TypedArray =
  Int8Array |
  Uint8Array |
  Int16Array |
  Uint16Array |
  Int32Array |
  Uint32Array |
  Uint8ClampedArray |
  Float32Array |
  Float64Array;

export type TypedArrayConstructor =
  Int8ArrayConstructor |
  Uint8ArrayConstructor |
  Int16ArrayConstructor |
  Uint16ArrayConstructor |
  Int32ArrayConstructor |
  Uint32ArrayConstructor |
  Uint8ClampedArrayConstructor |
  Float32ArrayConstructor |
  Float64ArrayConstructor;

export enum UniformType {
  "bool" = "bool",
  "bvec2" = "bvec2",
  "bvec3" = "bvec3",
  "bvec4" = "bvec4",

  "uint" = "uint",
  "uvec2" = "uvec2",
  "uvec3" = "uvec3",
  "uvec4" = "uvec4",

  "int" = "int",
  "ivec2" = "ivec2",
  "ivec3" = "ivec3",
  "ivec4" = "ivec4",

  "float" = "float",
  "vec2" = "vec2",
  "vec3" = "vec3",
  "vec4" = "vec4",

  "double" = "double",
  "dvec2" = "dvec2",
  "dvec3" = "dvec3",
  "dvec4" = "dvec4",

  "mat2" = "mat2",
  "mat2x2" = "mat2x2",
  "mat3x2" = "mat3x2",
  "mat2x3" = "mat2x3",
  "mat2x4" = "mat2x4",
  "mat4x2" = "mat4x2",
  "mat3" = "mat3",
  "mat3x3" = "mat3x3",
  "mat3x4" = "mat3x4",
  "mat4x3" = "mat4x3",
  "mat4" = "mat4",
  "mat4x4" = "mat4x4",

  "dmat2" = "dmat2",
  "dmat2x2" = "dmat2x2",
  "dmat3x2" = "dmat3x2",
  "dmat2x3" = "dmat2x3",
  "dmat2x4" = "dmat2x4",
  "dmat4x2" = "dmat4x2",
  "dmat3" = "dmat3",
  "dmat3x3" = "dmat3x3",
  "dmat3x4" = "dmat3x4",
  "dmat4x3" = "dmat4x3",
  "dmat4" = "dmat4",
  "dmat4x4" = "dmat4x4",
};

// Vertex attributes
export type VertexData = {
  vertices: TypedArray[],
  attributes: GPUVertexBufferLayoutDescriptor[],
  index?: TypedArray,
  indexFormat?: GPUIndexFormat,
};

export type VertexAttribute = {
  name: string,
  format: GPUVertexFormat,
};

// Uniform buffers
export type UniformAttribute = {
  name: string,
  format: UniformType
};

export type UniformAttributeDescriptor = {
  name: string,
  offset: number,
  format: UniformType,
};

export type UniformLayout = {
  length: number,
  attributes: UniformAttributeDescriptor[],
};

// Uniform bindings
export type UniformBinding = {
  resource: GPUBindingResource
};

// Shaders
export enum ShaderLanguage {
  GLSL = 'glsl',
};

export type ShaderLanguages = {[k in ShaderLanguage]: any};

export type ShaderModuleDescriptor = {
  code: string,
  entryPoint: string,
};
