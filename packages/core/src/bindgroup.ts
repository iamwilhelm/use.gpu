import type { DataBinding, StorageSource } from './types';
import { UNIFORM_ATTRIBUTE_SIZES, UNIFORM_ATTRIBUTE_ALIGNS } from './constants';
import { makeUniformLayout } from './uniform';

const BINDING_TEXTURE_TYPES = {
  'texture_1d': { viewDimension: '1d' },

  'texture_2d':                    { viewDimension: '2d' },
  'texture_multisampled_2d':       { viewDimension: '2d' },
  'texture_depth_2d':              { viewDimension: '2d', sampleType: 'depth' },
  'texture_depth_multisampled_2d': { viewDimension: '2d', sampleType: 'depth', multisampled: true },

  'texture_2d_array':         { viewDimension: '2d-array' },
  'texture_depth_2d_array':   { viewDimension: '2d-array' },

  'texture_cube':       { viewDimension: 'cube' },
  'texture_depth_cube': { viewDimension: 'cube', sampleType: 'depth' },

  'texture_cube_array':       { viewDimension: 'cube-array' },
  'texture_depth_cube_array': { viewDimension: 'cube-array', sampleType: 'depth' },

  'texture_3d': { viewDimension: '3d' },
} as Record<string, Partial<GPUTextureBindingLayout | GPUStorageTextureBindingLayout>>;

const BINDING_STORAGE_TEXTURE_TYPES = {
  'texture_storage_1d':       { viewDimension: '1d' },
  'texture_storage_2d':       { viewDimension: '2d' },
  'texture_storage_2d_array': { viewDimension: '2d-array' },
  'texture_storage_3d':       { viewDimension: '3d' },
} as Record<string, Partial<GPUTextureBindingLayout | GPUStorageTextureBindingLayout>>;

const BINDING_SAMPLE_TYPES = {
  f: 'float',
  u: 'uint',
  i: 'sint',
};

const parseTextureType = (format: string, variant: string | null) => {
  const [layout, type] = format.split(/[<>,]/);
  if (layout in BINDING_TEXTURE_TYPES) {
    const props = BINDING_TEXTURE_TYPES[layout];
    if ('sampleType' in props) return props;

    if (type[0] in BINDING_SAMPLE_TYPES) {
      let sampleType = BINDING_SAMPLE_TYPES[type[0]];
      if (sampleType === 'float' && (variant && !variant.match(/^textureSample/))) {
        sampleType = 'unfilterable-float';
      }
      return {texture: {...props, sampleType}};
    }
    throw new Error(`Unknown texture sample type "${type}"`);
  }
  if (layout in BINDING_STORAGE_TEXTURE_TYPES) {
    const props = BINDING_STORAGE_TEXTURE_TYPES[layout];
    return {storageTexture: {...props, format: type}};
  }
  throw new Error(`Unknown texture layout "${layout}"`);
};

export const makeBindGroupLayoutEntries = (
  bindings: DataBinding[],
  visibilities: Map<DataBinding, GPUShaderStageFlags>,
  binding: number = 0,
): GPUBindGroupLayoutEntry[] => {
  const out = [];
  for (let b of bindings) {
    const l = makeBindingLayoutEntry(b, visibilities.get(b), out.length + binding);
    if (Array.isArray(l)) out.push(...l);
    else out.push(l);
  }
  return out;
};

export const makeBindingLayoutEntry = (
  b: DataBinding,
  visibility: GPUShaderStageFlags,
  binding: number,
): GPUBindGroupLayoutEntry | GPUBindGroupLayoutEntry[] => {
  if (b.storage) {
    const minBindingSize = getMinBindingSize(b.storage.format);
    if (b.storage!.readWrite) return {binding, visibility, buffer: {type: 'storage', minBindingSize}};
    return {binding, visibility, buffer: {type: 'read-only-storage', minBindingSize}};
  }
  if (b.texture) {
    const hasSampler = !!(b.texture!.sampler && (b.uniform!.args !== null));

    const textureType = b.uniform.args ? b.texture.layout : b.uniform.format;
    const textureVariant = b.texture.variant ?? (b.uniform.args ? null : 'textureLoad');
    const props = parseTextureType(textureType, textureVariant);

    const texture = {binding, visibility, ...props};

    if (hasSampler) {
      const type = texture.texture?.comparison ? 'comparison' : 'filtering';
      const sampler = {binding: binding + 1, visibility, sampler: {type}};
      return [texture, sampler];
    }
    return texture;
  }
};

export const makeUniformLayoutEntry = (
  uniforms: any[],
  visibility: GPUShaderStageFlags,
  binding: number = 0,
) => {
  if (!uniforms.length) return null;
  return {binding, visibility, buffer: {}};
};

export const makeBindGroupLayout = (
  device: GPUDevice,
  entries: GPUBindGroupLayoutEntry[],
) => {
  return device.createBindGroupLayout({
    entries,
  });
}

export const getMinBindingSize = (format: string | any) => {
  if (typeof format === 'string') {
    format = format.replace(/^array<([^>]+)>$/, '$1');
    format = format.replace(/^(u|i)(8|16)$/, 'u32');
    const size = (UNIFORM_ATTRIBUTE_SIZES as any)[format] ?? 0;
    const align = (UNIFORM_ATTRIBUTE_ALIGNS as any)[format] ?? 0;
    return Math.ceil(size / align) * align;
  }
  if (!format) return 0;

  const {module} = format;
  const {entry, table: {declarations}} = module;
  const {struct} = declarations.find(d => d.struct?.name === entry);
  if (!struct) return 0;

  const members = struct.members.map(m => ({name: m.name, format: toTypeString(m.type)}));
  const layout = makeUniformLayout(members);
  return layout.length;
};

export const toTypeString = (t: any | string): string => {
  if (typeof t === 'object') {
    if (t.type) return toTypeString(t.type);
    if (t.args) return `${t.name}<${t.args.map(t => toTypeString(t)).join(',')}>`;
    else return t.name;
  }
  return t;
}

export const toTypeArgs = (t: (any | string)[]): string[] => {
  return t?.map(toTypeString) ?? [];
}

const maximum = (a: number, b: number) => Math.max(a, b);
const alignAdd = (a: number, b: number) => Math.ceil(a / b) * b + b;
