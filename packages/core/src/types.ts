import { vec2, vec3, mat4 } from 'gl-matrix';

export type Point = [number, number];
export type Rectangle = [number, number, number, number];

export type Dictionary<T = string> = Record<string, T>;

export type DeepPartial<T> = T | {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export type UseRenderingContextGPU = {
  width: number,
  height: number,
  pixelRatio: number,
  samples: number,

  device: GPUDevice,
  gpuContext: GPUCanvasContext,
  colorSpace: ColorSpace,
  colorInput: ColorSpace,
  colorStates: GPUColorTargetState[],
  colorAttachments: GPURenderPassColorAttachment[],
  depthTexture: GPUTexture,
  depthStencilState: GPUDepthStencilState,
  depthStencilAttachment: GPURenderPassDepthStencilAttachment,

  swapView: (view: GPUTextureView) => void,
};

export type ColorSpace = 'linear' | 'srgb' | 'p3';

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

export type UniformType =
  | "bool"
  | "vec2<bool>"
  | "vec3<bool>"
  | "vec4<bool>"

  | "u32"
  | "vec2<u32>"
  | "vec3<u32>"
  | "vec4<u32>"

  | "i32"
  | "vec2<i32>"
  | "vec3<i32>"
  | "vec4<i32>"

  | "f32"
  | "vec2<f32>"
  | "vec3<f32>"
  | "vec4<f32>"

  | "f64"
  | "vec2<f64>"
  | "vec3<f64>"
  | "vec4<f64>"

  | "mat2x2<f32>"
  | "mat3x2<f32>"
  | "mat2x3<f32>"
  | "mat2x4<f32>"
  | "mat4x2<f32>"
  | "mat3x3<f32>"
  | "mat3x4<f32>"
  | "mat4x3<f32>"
  | "mat4x4<f32>"

  | "mat2x2<f64>"
  | "mat3x2<f64>"
  | "mat2x3<f64>"
  | "mat2x4<f64>"
  | "mat4x2<f64>"
  | "mat3x3<f64>"
  | "mat3x4<f64>"
  | "mat4x3<f64>"
  | "mat4x4<f64>"
;

// Vertex attributes
export type VertexData = {
  count: number,
  vertices: TypedArray[],
  attributes: GPUVertexBufferLayout[],
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
  format: UniformType,
  args?: UniformType[],
};

export type UniformAttributeValue = UniformAttribute & {
  value: any,
};

export type UniformAttributeDescriptor = {
  name: string,
  offset: number,
  format: UniformType,
};

export type UniformLayout = {
  length: number,
  attributes: UniformAttributeDescriptor[],
  offsets: number[],
};

// Uniform bindings
export type UniformPipe = {
  layout: UniformLayout,
  data: ArrayBuffer,
  fill: UniformFiller,
};

export type UniformAllocation = {
  pipe: UniformPipe,
  buffer: GPUBuffer,
  bindGroup: GPUBindGroup,
};

export type ResourceAllocation = {
  bindGroup: GPUBindGroup,
};

export type VirtualAllocation = {
  pipe?: UniformPipe,
  buffer?: GPUBuffer,
  bindGroup?: GPUBindGroup,
};

export type UniformFiller = (items: any) => void;
export type UniformByteSetter = (view: DataView, offset: number, data: any) => void;

// Storage bindings
export type StorageSource = {
  buffer: GPUBuffer,
  format: string,
  length: number,
  size: number[],
  version: number,
};

export type LambdaSource<T = any> = {
  shader: T,
  length?: number,
  version?: number,
  size?: number[],
};

export type TextureSource = {
  texture: GPUTexture,
  view: GPUTexture | GPUTextureView,
  sampler: GPUSampler | GPUSamplerDescriptor,
  layout: string,
  format: string,
  variant?: string,
  absolute?: boolean,
  colorSpace?: ColorSpace,
  size: [number, number] | [number, number, number],
  version: number,
};

export type DataTexture = {
  data: TypedArray,
  format: GPUTextureFormat,
  size: [number, number] | [number, number, number],
};

// Shaders
export type ShaderModuleDescriptor = {
  code: TypedArray | string,
  entryPoint: string,
  hash: string | number,
};

export type ShaderStageDescriptor = {
  module: GPUShaderModule,
  entryPoint: string,
};

// Projection pipeline
export type ViewUniforms = {
  projectionMatrix: { current: mat4 },
  viewMatrix: { current: mat4 },
  viewPosition: { current: vec3 | [number, number, number] | number[] },
  viewNearFar: { current: vec2 | [number, number] | number[] },
  viewResolution: { current: vec2 | [number, number] | number[] },
  viewSize: { current: vec2 | [number, number] | number[] },
  viewWorldUnit: { current: number },
  viewPixelRatio: { current: number },
};

export type PickingUniforms = {
  pickingId: { value: number },
};

// Data

export type ChunkLayout = {
  chunks: number[],
  loops?: boolean[],
  starts?: boolean[],
  ends?: boolean[],
  count: number,
};

export type Tuples<N extends number, T = number> = {
  array: T[],
  get: (i: number, j: number) => T,
  iterate: (f: (...args: T[]) => void, start?: number, end?: number) => void;
  dims: number,
  length: number,
};

export type Emitter = (...args: number[]) => void;
export type Accessor = (o: any) => any;
export type EmitterExpression = (emit: Emitter, ...args: any[]) => any;

export type ArrayLike = any[] | TypedArray;

export type AccessorSpec = string | Accessor | ArrayLike;
export type DataField = [string, AccessorSpec];
export type DataBinding<T = any, S = any> = {
  uniform: UniformAttribute,
  storage?: StorageSource,
  texture?: TextureSource,
  lambda?: LambdaSource<S>,
  constant?: Prop<T>,
};

export type Prop<T> = T | (() => T) | {expr: () => T} | {current: T};

export type AggregateBuffer = {
  buffer: GPUBuffer,
  array: TypedArray,
  source: StorageSource,
  dims: number,
};

export type Atlas = {
  place: (key: number, w: number, h: number) => void,
  map: Map<number, Rectangle>,
  width: number,
  height: number,
  version: number,
};

// Passes

export enum RenderPassMode {
  Opaque = 'o',
  Transparent = 't',
  Picking = 'p',
  Debug = 'd',
};
