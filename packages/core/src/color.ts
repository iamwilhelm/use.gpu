export const makeColorState = (format: GPUTextureFormat, blend?: GPUBlendState): GPUColorTargetState => ({
  format,
  blend,
});

export const makeColorAttachment = (
  texture: GPUTextureView | null,
  resolve: GPUTextureView | null,
  clearValue: GPUColor = [0, 0, 0, 0],
  loadOp: GPULoadOp = 'clear',
  storeOp: GPUStoreOp = 'store',
): GPURenderPassColorAttachment => ({
  view: texture ? texture.createView() : null,
  resolveTarget: resolve ? resolve.createView() : undefined,
  clearValue,
  loadOp,
  storeOp,
} as unknown as GPURenderPassColorAttachment);

export const makeColorAttachmentWithFormat = (
  texture: GPUTextureView | null,
  resolve: GPUTextureView | null,
  format: GPUTextureFormat,
  clearValue: GPUColor = [0, 0, 0, 0],
  loadOp: GPULoadOp = 'clear',
  storeOp: GPUStoreOp = 'store',
): GPURenderPassColorAttachment => ({
  view: texture ? texture.createView({ format }) : null,
  resolveTarget: resolve ? resolve.createView() : undefined,
  clearValue,
  loadOp,
  storeOp,
} as unknown as GPURenderPassColorAttachment);