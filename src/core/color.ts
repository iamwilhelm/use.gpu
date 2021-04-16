export const makeDepthTexture = (
  device: GPUDevice,
  width: number,
  height: number,
  format: GPUTextureFormat,
): GPUTexture => {
  const depthTexture = device.createTexture({
    size: { width, height, depth: 1 },
    format,
    usage: GPUTextureUsage.OUTPUT_ATTACHMENT,
  });

  return depthTexture;
}

export const makeColorState = (format: GPUTextureFormat): GPUColorStateDescriptor => ({
  format,
});

export const makeColorAttachment = (loadValue: GPUColor): GPURenderPassColorAttachmentDescriptor => ({
  attachment: null,
  loadValue
} as unknown as GPURenderPassColorAttachmentDescriptor);