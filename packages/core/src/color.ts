export const makeColorState = (format: GPUTextureFormat): GPUColorStateDescriptor => ({
  format,
});

export const makeColorAttachment = (loadValue: GPUColor): GPURenderPassColorAttachmentDescriptor => ({
  attachment: null,
  loadValue
} as unknown as GPURenderPassColorAttachmentDescriptor);