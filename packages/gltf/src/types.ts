import { mat4, vec3, quat } from 'gl-matrix';
import { StorageSource, TextureSource } from '@use-gpu/shader/types';

export type GLTF<T = any> = {
  accessors?:   GLTFAccessorData<T>[],
  bufferViews?: GLTFBufferViewData<T>[],
  buffers?:     GLTFBufferData<T>[],
  images?:      GLTFImageData<T>[],
  materials?:   GLTFMaterialData<T>[],
  meshes?:      GLTFMeshData<T>[],
  nodes?:       GLTFNodeData<T>[],
  samples?:     GLTFSamplerData<T>[],
  scenes?:      GLTFSceneData<T>[],
  textures?:    GLTFTextureData<T>[],
  scene?:       number,

  bound?: {
    accessors?: StorageSource[],
    textures?: TextureSource[],
  },
};

export type GLTFObject<T = any> = {
  name?: string,
  extensions?: Record<string, any>,
  extras?: T,
};

//////////////////////////////////////////////////
// Scene

export type GLTFSceneData<T = any> = GLTFObject<T> & {
  nodes?: Uint32Array,
};

export type GLTFNodeData<T = any> = GLTFObject<T> & {
  camera?: number,
  children?: Uint32Array,
  skin?: number,
  matrix?: mat4,
  mesh?: number,
  rotation?: quat,
  scale?: vec3,
  translation?: vec3,
  weights?: Float32Array,
};

//////////////////////////////////////////////////
// Mesh

export type GLTFMeshData<T = any> = GLTFObject<T> & {
  primitives: GLTFPrimitiveData<T>[],
  weights?: Float32Array,
};

export type GLTFPrimitiveData<T = any> = GLTFObject<T> & {
  attributes: Record<string, number>,
  indices?: number,
  material?: number,
  mode?: number,
  targets?: GLTFTargetData<T>,
};

//////////////////////////////////////////////////
// Material

export type GLTFMaterialData<T = any> = GLTFObject<T> & {
  pbrMetallicRoughness?: GLTFMaterialPBR<T>,
  normalTexture?: GLTFTextureInfo<T>,
  occlusionTexture?: GLTFTextureInfo<T>,
  emissiveTexture?: GLTFTextureInfo<T>,
  emissiveFactor?: vec3,
  alphaMode?: string,
  alphaCutoff?: number,
  doubleSided?: boolean,
};

export type GLTFMaterialPBR<T = any> = GLTFObject<T> & {
  baseColorFactor?: Float32Array,
  baseColorTexture?: GLTFTextureInfo<T>,
  metallicFactor?: number,
  roughnessFactor?: number,
  metallicRoughnessTexture: GLTFTextureInfo<T>,
};

export type GLTFTextureInfo<T = any> = GLTFObject<T> & {
  index: number,
  scale?: number,
  strength?: number,
  texCoord?: number,
};

//////////////////////////////////////////////////
// Buffer

export type GLTFBufferData<T = any> = GLTFObject<T> & {
  byteLength: number,
  uri?: string,
};

export type GLTFBufferViewData<T = any> = GLTFObject<T> & {
  buffer: number,

  byteOffset?: number,
  byteLength?: number,
  byteStride?: number,
  target?: number,
};

//////////////////////////////////////////////////
// Image

export type GLTFImageData<T = any> = GLTFObject<T> & {
  uri?: string,
  mimeType?: string,
  bufferView?: number,
};

//////////////////////////////////////////////////
// Accessor

export type GLTFAccessorData<T = any> = GLTFObject<T> & {
  componentType: number,
  count: number,
  type: string,
  
  bufferView?: number,
  byteOffset?: number,
  normalized?: number,
  max?: number[],
  min?: number[],
  sparse?: GLTFSparseData<T>,
};

export type GLTFSparseData<T = any> = GLTFObject<T> & {
  count: number,
  indices: GLTFSparseIndices<T>,
  values: GLTFSparseValues<T>,
};

export type GLTFSparseIndices<T = any> = GLTFObject<T> & {
  bufferView: number,
  componentType: number,
  byteOffset?: number,
};

export type GLTFSparseValues<T = any> = GLTFObject<T> & {
  bufferView: number,
  byteOffset?: number,
};

