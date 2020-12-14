export const makeDepthTexture = (device: GPUDevice, width: number, height: number, format: GPUTextureFormat) => {
  const depthTexture = device.createTexture({
    size: { width, height, depth: 1 },
    format,
    usage: GPUTextureUsage.OUTPUT_ATTACHMENT,
  });

  return depthTexture;
}

export const makeDepthStencilState = (format: GPUTextureFormat): GPUDepthStencilStateDescriptor => ({
  depthWriteEnabled: true,
  depthCompare: "less" as GPUCompareFunction,
  format,
});

export const makeDepthStencilAttachment = (depthTexture: GPUTexture) => ({
  attachment: depthTexture.createView(),
  depthLoadValue: 1.0,
  depthStoreOp: "store" as GPUStoreOp,
  stencilLoadValue: 0,
  stencilStoreOp: "store" as GPUStoreOp,
});