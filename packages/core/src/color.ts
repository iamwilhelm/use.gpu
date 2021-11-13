export const makeColorState = (format: GPUTextureFormat): GPUColorTargetState => ({
  format,
});

export const makeColorAttachment = (
  texture: GPUTexture | null,
  resolve: GPUTexture | null,
  loadValue: GPUColor,
): GPURenderPassColorAttachment => ({
  view: texture ? texture.createView() : null,
  resolveTarget: resolve ? resolve.createView() : undefined,
  loadValue,
} as unknown as GPURenderPassColorAttachment);