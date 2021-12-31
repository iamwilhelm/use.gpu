import {
  TypedArray, DeepPartial, UseRenderingContextGPU,
  ShaderModuleDescriptor, ShaderStageDescriptor,
} from './types';

export const makeShaderModule = (
  [code, hash]: [TypedArray | string, number | string],
  entryPoint: string = 'main'
): ShaderModuleDescriptor => ({code, hash, entryPoint});

export const makeShaderStage = (device: GPUDevice, descriptor: ShaderModuleDescriptor, extra: any = {}): ShaderStageDescriptor => {
  const {code, entryPoint} = descriptor;

  const gpuDescriptor = {code} as GPUShaderModuleDescriptor;
  const module = device.createShaderModule(gpuDescriptor);

  return {module, entryPoint, ...extra};
}

export const makeRenderPipeline = (
  renderContext: UseRenderingContextGPU,
  vertexShader: ShaderModuleDescriptor,
  fragmentShader: ShaderModuleDescriptor,
  descriptor: DeepPartial<GPURenderPipelineDescriptor> = {},
) => {
  const {device, colorStates, depthStencilState, samples} = renderContext;

  const pipelineDescriptor: GPURenderPipelineDescriptor = {
    depthStencil: depthStencilState,
    ...descriptor,
    multisample: {
      count: samples,
      ...descriptor.multisample,
    },
    vertex: makeShaderStage(device, vertexShader, {
      ...descriptor.vertex,
    }),
    fragment: makeShaderStage(device, fragmentShader, {
      targets: colorStates,
      ...descriptor.fragment,
    }),
  } as any as GPURenderPipelineDescriptor;

  return device.createRenderPipeline(pipelineDescriptor);
}
