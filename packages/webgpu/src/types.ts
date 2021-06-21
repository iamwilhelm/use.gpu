export type GPUDeviceMount = {
  adapter: GPUAdapter,
  device: GPUDevice,
};

export type GPUMount = GPUDeviceMount & {
  canvas: HTMLCanvasElement,
};

export type CanvasRenderingContextGPU = {
  width: number,
  height: number,

  swapChain: GPUSwapChain,
  colorStates: GPUColorStateDescriptor[],
  colorAttachments: GPURenderPassColorAttachmentDescriptor[],
  depthTexture: GPUTexture,
  depthStencilState: GPUDepthStencilStateDescriptor,
  depthStencilAttachment: GPURenderPassDepthStencilAttachmentDescriptor,
};