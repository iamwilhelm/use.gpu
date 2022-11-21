import type { DataBounds, DeepPartial, Lazy, RenderPassMode, StorageSource, TextureSource } from '@use-gpu/core';
import type { Light } from '../../lights/types';

export type Culler = (bounds: DataBounds) => number | boolean;
export type LightEnv = {
  lights: Light[],
  shadows: Light[],
  storage: StorageSource,
  texture: TextureSource,
};

export type Renderable = {
  draw: RenderToPass,
  bounds?: Lazy<DataBounds>,
};

export type RenderCounter = (v: number, t: number) => void;
export type RenderToPass = (
  passEncoder: GPURenderPassEncoder,
  countGeometry: RenderCounter,
) => void;

export type ComputeCounter = (d: number) => void;
export type ComputeToPass = (
  passEncoder: GPUComputePassEncoder,
  countDispatch: ComputeCounter,
) => void;

export type CommandToBuffer = () => GPUCommandBuffer;

export type AggregatedCalls = {
  compute?: ComputeToPass[],
  opaque?: Renderable[],
  transparent?: Renderable[],
  debug?: Renderable[],
  picking?: Renderable[],
  shadow?: Renderable[],
  post?: CommandToBuffer[],
  readback?: ArrowFunction[],
};

export type VirtualDraw = {
  pipeline: DeepPartial<GPURenderPipelineDescriptor>,
  defines: Record<string, any>,
  mode?: RenderPassMode | string,
  id?: number,

  vertexCount?: Lazy<number>,
  instanceCount?: Lazy<number>,
  bounds?: Lazy<DataBounds>,
  indirect?: StorageSource,

  renderer?: string,
  links?: Record<string, ShaderModule>,
};
