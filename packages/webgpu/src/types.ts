export type GPUPresentationContext = {
  configure: (descriptor: any) => {},
};

export type GPUDeviceMount = {
  adapter: GPUAdapter,
  device: GPUDevice,
};

export type GPUMount = GPUDeviceMount & {
  canvas: HTMLCanvasElement,
};

export type CanvasRenderingContextGPU = {
  element: HTMLCanvasElement,
  width: number,
  height: number,
  samples: number,

  device: GPUDevice,
  compileGLSL?: any,

  gpuContext: GPUPresentationContext,
  colorStates: GPUColorStateDescriptor[],
  colorAttachments: GPURenderPassColorAttachmentDescriptor[],
  depthTexture: GPUTexture,
  depthStencilState: GPUDepthStencilStateDescriptor,
  depthStencilAttachment: GPURenderPassDepthStencilAttachmentDescriptor,
};