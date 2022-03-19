const COLOR_SPACE = {
  'srgb': 0,
  'linear': 1,
};

const COLOR_CONVERSION = [
  [0, 1],
  [2, 0],
];

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

export const getColorSpace = (from: ColorSpace, to: ColorSpace) => {
  const f = COLOR_SPACE[from];
  const t = COLOR_SPACE[to];
  return COLOR_CONVERSION[f][t];
};
