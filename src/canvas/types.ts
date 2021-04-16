export type GPUDeviceMount = {
  adapter: GPUAdapter,
  device: GPUDevice,
};

export type GPUMount = GPUDeviceMount & {
  canvas: HTMLCanvasElement,
};

export type CanvasRenderingContextGPU = {
  swapChain: GPUSwapChain,
  colorStates: GPUColorStateDescriptor[],
  colorAttachments: GPURenderPassColorAttachmentDescriptor[],
  depthTexture: GPUTexture,
  depthStencilState: GPUDepthStencilStateDescriptor,
  depthStencilAttachment: GPURenderPassDepthStencilAttachmentDescriptor,
};