import type { DataTexture, ExternalTexture, DataBinding, TextureSource } from './types';
import { TYPED_ARRAYS, TEXTURE_FORMAT_SIZES, TEXTURE_FORMAT_DIMS } from './constants';

type Point = [number, number];
type Point3 = [number, number, number];

const NO_OFFSET = [0, 0, 0] as Point3;

export const makeSampler = (
  device: GPUDevice,
  descriptor?: Partial<GPUSamplerDescriptor>,
) => device.createSampler(descriptor);

export const makeTexture = (
  device: GPUDevice,
  width: number,
  height: number,
  depth: number,
  format: GPUTextureFormat,
  usage: number,
  sampleCount: number = 1,
  mipLevelCount: number = 1,
  dimension: GPUTextureDimension = '2d',
): GPUTexture => {
  if (width * height * depth === 0) throw new Error("Can't create zero-sized texture");

  const texture = device.createTexture({
    // @ts-ignore
    size: [width, height, depth],
    dimension,
    sampleCount,
    mipLevelCount,
    format,
    // @ts-ignore
    usage,
  });

  return texture;
}

export const makeMippableTexture = (
  device: GPUDevice,
  width: number,
  height: number,
  depth: number,
  format: GPUTextureFormat,
  sampleCount: number = 1,
  mipLevelCount: number = 1,
  dimension: GPUTextureDimension = '2d',
): GPUTexture => {
  const usage = GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC | GPUTextureUsage.COPY_DST;
  return makeTexture(device, width, height, depth, format, usage, sampleCount, mipLevelCount, dimension);
}

export const makeTargetTexture = (
  device: GPUDevice,
  width: number,
  height: number,
  format: GPUTextureFormat,
  sampleCount: number = 1,
  mipLevelCount: number = 1,
): GPUTexture => {
  const usage = GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC;
  return makeTexture(device, width, height, 1, format, usage, sampleCount, mipLevelCount);
}

export const makeStorageTexture = (
  device: GPUDevice,
  width: number,
  height: number,
  format: GPUTextureFormat,
  sampleCount: number = 1,
  mipLevelCount: number = 1,
): GPUTexture => {
  const usage = GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING;
  return makeTexture(device, width, height, 1, format, usage, sampleCount, mipLevelCount);
}

export const makeDestinationTexture = (
  device: GPUDevice,
  width: number,
  height: number,
  format: GPUTextureFormat,
  sampleCount: number = 1,
  mipLevelCount: number = 1,
): GPUTexture => {
  const usage = GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST;
  return makeTexture(device, width, height, 1, format, usage, sampleCount, mipLevelCount);
}

export const makeReadbackTexture = (
  device: GPUDevice,
  width: number,
  height: number,
  format: GPUTextureFormat,
  sampleCount: number = 1,
  mipLevelCount: number = 1,
): GPUTexture => {
  const usage = GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC;
  return makeTexture(device, width, height, 1, format, usage, sampleCount, mipLevelCount);
}

export const makeDynamicTexture = (
  device: GPUDevice,
  width: number,
  height: number,
  depth: number,
  format: GPUTextureFormat,
  sampleCount: number = 1,
  mipLevelCount: number = 1,
  dimension: GPUTextureDimension = '2d',
): GPUTexture => {
  const usage = GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC;
  return makeTexture(device, width, height, depth, format, usage, sampleCount, mipLevelCount, dimension);
}

export const makeRawTexture = (
  device: GPUDevice,
  dataTexture: DataTexture | ExternalTexture,
  mipLevelCount: number = 1,
) => {
  const {size, format} = dataTexture;
  const [w, h, d] = size as Point3;

  return makeDynamicTexture(device, w, h, d || 1, format ?? 'rgba8unorm', 1, mipLevelCount);
}

export const makeTextureDataLayout = (
  size: Point | Point3,
  format: GPUTextureFormat,
) => {
  const [w, h, d] = size as Point3;

  const s = TEXTURE_FORMAT_SIZES[format] || 1;

  const bytesPerRow = s * w;
  const rowsPerImage = h;

  return {
    offset: 0,
    bytesPerRow,
    rowsPerImage,
  };
};

export const uploadDataTexture = (
  device: GPUDevice,
  texture: GPUTexture,
  dataTexture: DataTexture,
): void => {
  const {data, size, format} = dataTexture;

  const layout = makeTextureDataLayout(size, format ?? 'rgba8unorm');
  uploadTexture(device, texture, data, layout, size);
}

export const uploadTexture = (
  device: GPUDevice,
  texture: GPUTexture,
  data: ArrayBuffer,
  layout: GPUImageDataLayout,
  size: Point | Point3,
  offset: Point | Point3 = NO_OFFSET,
  mipLevel: GPUIntegerCoordinate = 0,
  aspect: GPUTextureAspect = "all",
): void => {

  const [x, y, z] = offset as Point3;
  const origin = { x, y, z: z || 0 };

  const [width, height, depth] = size as Point3;
  // @ts-ignore
  const extent = [width, height, depth || 1];

  const copy = {
    texture,
    mipLevel,
    origin,
    aspect,
  };

  // @ts-ignore
  device.queue.writeTexture(copy, data, layout, extent);
}

export const uploadExternalTexture = (
  device: GPUDevice,
  texture: GPUTexture,
  source: any,
  size: Point | Point3,
): void => {

  const [w, h, d] = size as Point3;
  const extent = [w, h, d || 1];

  device.queue.copyExternalImageToTexture({ source }, { texture }, extent);
}

export const resizeTextureSource = (
  device: GPUDevice,
  source: TextureSource,
  width: number,
  height: number,
  depth: number = 1,
  mips: 'auto' | number = 1,
  mipLevel: GPUIntegerCoordinate = 0,
  aspect: GPUTextureAspect = "all",
  dimension: GPUTextureDimension = '2d',
) => {
  const {format} = source;

  const ms = mips === 'auto' ? Math.floor(Math.log2(Math.min(width, height))) + 1 : mips;
  const newTexture = makeMippableTexture(device, width, height, depth, format as any, 1, ms, dimension);

  const src = {
    texture: source.texture,
    origin: [0, 0, 0],
    mipLevel,
    aspect,
  };
  const dst = {
    texture: newTexture,
    origin: [0, 0, 0],
    mipLevel,
    aspect,
  }
  
  const [w, h, d] = source.size;
  const commandEncoder = device.createCommandEncoder();
  commandEncoder.copyTextureToTexture(src, dst, [w, h, d || 1]);
  device.queue.submit([commandEncoder.finish()]);

  return {
    ...source,
    texture: newTexture,
    view: newTexture.createView({mipLevelCount: ms}),
    size: [width, height, depth] as [number, number, number],
    version: 1,
  };
}

export const makeTextureBinding = (
  device: GPUDevice,
  pipeline: GPURenderPipeline | GPUComputePipeline,
  texture: GPUTexture | GPUTextureView,
  sampler: GPUSampler,
  set: number = 0,
): GPUBindGroup => {
  const view = (texture instanceof GPUTexture) ? texture.createView() : texture;

  const entries = [
    {binding: 0, resource: view},
    {binding: 1, resource: sampler},
  ];

  const bindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(set),
    entries,
  });
  return bindGroup;
}

export const makeMultiTextureBinding = (
  device: GPUDevice,
  pipeline: GPURenderPipeline | GPUComputePipeline,
  textures: [GPUSampler, GPUTexture | GPUTextureView][],
  set: number = 0,
): GPUBindGroup => {
  const entries = makeTextureEntries(textures);
  const bindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(set),
    entries,
  });
  return bindGroup;
}

export const makeTextureEntries = (
  textures: [GPUSampler, GPUTexture | GPUTextureView][],
  binding: number = 0
): GPUBindGroupEntry[] => {
  const entries = [] as any[];

  for (const [sampler, texture] of textures) {
    const view = (texture instanceof GPUTexture) ? texture.createView() : texture;

    entries.push({binding, resource: view});
    binding++;

    entries.push({binding, resource: sampler});
    binding++;
  }

  return entries;
};
