
export const makeDepthTexture = (device: GPUDevice, width: number, height: number, format: GPUTextureFormat) => {
  const depthTexture = device.createTexture({
    size: { width, height, depth: 1 },
    format,
    usage: GPUTextureUsage.OUTPUT_ATTACHMENT,
  });

  return depthTexture;
}