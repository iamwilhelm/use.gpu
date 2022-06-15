import {
  TypedArray, DeepPartial, UseRenderingContextGPU,
  ShaderModuleDescriptor, ShaderStageDescriptor,
} from './types';

import { patch } from '@use-gpu/state';

export const makeShaderModule = (
  code: TypedArray | string,
  hash: string,
  entryPoint: string = 'main'
): ShaderModuleDescriptor => ({code, hash, entryPoint});

export const makeShaderStage = (device: GPUDevice, descriptor: ShaderModuleDescriptor, extra: any = {}): ShaderStageDescriptor => {
  const {code, entryPoint} = descriptor;

  const gpuDescriptor = {code} as GPUShaderModuleDescriptor;
  const module = device.createShaderModule(gpuDescriptor);

  return {module, entryPoint, ...extra};
}

export const makeRenderPipeline = (
  device: GPUDevice,
  vertexShader: ShaderModuleDescriptor,
  fragmentShader: ShaderModuleDescriptor,
  colorStates: GPUColorTargetState[],
  depthStencilState: GPUDepthStencilState | undefined,
  samples: number,
  descriptor: DeepPartial<GPURenderPipelineDescriptor> = {},
) => {
  const pipelineDescriptor: GPURenderPipelineDescriptor = patch({
    layout: 'auto',
    depthStencil: depthStencilState,
    multisample: { count: samples },
    vertex: makeShaderStage(device, vertexShader),
    fragment: makeShaderStage(device, fragmentShader, {
      targets: colorStates,
    }),
  } as any, descriptor) as any as GPURenderPipelineDescriptor;

  return device.createRenderPipeline(pipelineDescriptor);
}

export const makeRenderPipelineAsync = (
  device: GPUDevice,
  vertexShader: ShaderModuleDescriptor,
  fragmentShader: ShaderModuleDescriptor,
  colorStates: GPUColorTargetState[],
  depthStencilState: GPUDepthStencilState | undefined,
  samples: number,
  descriptor: DeepPartial<GPURenderPipelineDescriptor> = {},
) => {
  const pipelineDescriptor: GPURenderPipelineDescriptor = patch({
    layout: 'auto',
    depthStencil: depthStencilState,
    multisample: { count: samples },
    vertex: makeShaderStage(device, vertexShader),
    fragment: makeShaderStage(device, fragmentShader, {
      targets: colorStates,
    }),
  } as any, descriptor) as any as GPURenderPipelineDescriptor;

  return device.createRenderPipelineAsync(pipelineDescriptor);
}
