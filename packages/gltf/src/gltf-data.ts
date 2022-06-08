import { LC, LiveElement } from '@use-gpu/live/types';
import { GLTF, GLTFSceneData, GLTFNodeData, GLTFMeshData, GLTFMaterialData } from './types';
import { toScene, toNode, toMesh, toMaterial } from './parse';

import { use, gather, useContext, useOne } from '@use-gpu/live';
import { DeviceContext, Fetch, getBoundShader } from '@use-gpu/components';
import { bundleToAttributes } from '@use-gpu/shader/wgsl';
import { makeCopyableTexture, makeStorageBuffer, uploadBuffer, uploadExternalTexture } from '@use-gpu/core';

const GLTF_MAGIC = 0x46546C67;
const STORAGE_ALIGNMENT = 256;
const NO_BINDINGS: any[] = [];

type GLTFDataProps = {
  url?: string,
  data?: ArrayBuffer | string | Record<string, any>,
  base: string,
  
  render?: (gltf: GLTF) => LiveElement<any>,
};

export const resolveURL = (base: string, url: string) => new URL(url, base).href;

export const GLTFData: LC<GLTFDataProps> = (props) => {
  const device = useContext(DeviceContext);

  const {
    data,
    url,
    render
  } = props;

  // Relative URL base for GLTF resources
  const base = props.base ?? new URL(props.url ?? ".", location.href).href;

  const Resume = ([data]: any[]) => {

    // Extract JSON
    const json = useOne(() => {
      try {
        if (typeof data === 'string') return JSON.parse(data);

        if (data instanceof ArrayBuffer) {
          const u32 = new Uint32Array(data.buffer);
          if (u32[0] === GLTF_MAGIC) throw new Error("binary gltf unimplemented");

          return JSON.parse(new TextDecoder().decode(data));
        }
        return data;
      } catch (e) {
        console.error(e)
        return null;
      }
    }, data);

    // Parse JSON into native types
    const {gltf, buffers, images, bufferAssets, imageAssets} = useOne(() => {
      const buffers = (json?.buffers ?? []);
      const images  = (json?.images ?? []);

      const bufferAssets  = buffers.filter(({uri}) => uri != null);
      const imageAssets  = images.filter(({uri}) => uri != null);

      const scenes:    GLTFSceneData    = (json?.scenes    ?? []).map(toScene);
      const nodes:     GLTFNodeData     = (json?.nodes     ?? []).map(toNode);
      const meshes:    GLTFMeshData     = (json?.meshes    ?? []).map(toMesh);
      const materials: GLTFMaterialData = (json?.materials ?? []).map(toMaterial);

      const gltf = {
        ...json,
        scenes,
        nodes,
        meshes,
        materials,
      };

      return {gltf, buffers, images, bufferAssets, imageAssets};
    }, json);
  
    const Resume = (resources: (ArrayBuffer | Image)[]) => {
      const n = bufferAssets.length;
      const bufferResources = resources.slice(0, n);
      const imageResources = resources.slice(n);

      const gpuBuffers: GPUBuffer[] = buffers.map((buffer) => {
        const i = bufferAssets.indexOf(buffer);
        if (i >= 0) {
          if (!resources[i]) return null;

          const b = makeStorageBuffer(device, buffer.byteLength);
          uploadBuffer(device, b, bufferResources[i] as ArrayBuffer);
          return b;
        }
        throw new Error('GLTF buffer without data');
      });

      const bufferSources = gltf.bufferViews?.map(({buffer, byteOffset, byteLength, byteStride}, index) => {
        if (byteStride != null && byteStride !== 1) throw new Error("byteStride != 1 not implemented");
        
        let gpuBuffer = gpuBuffers[buffer];
        if (!gpuBuffer) return null;

        if ((byteOffset % STORAGE_ALIGNMENT) !== 0) {
          const i = bufferAssets.indexOf(buffers[buffer]);
          const b = makeStorageBuffer(device, byteLength);

          const arrayBuffer = bufferResources[i] as ArrayBuffer;
          const arraySlice = arrayBuffer.slice(byteOffset, byteOffset + byteLength);

          uploadBuffer(device, b, arraySlice);
          gpuBuffer = b;
          byteOffset = 0;
        }

        const source = {
          buffer: gpuBuffer,
          format: '',
          length: 0,
          size: [0],
          version: 0,

          byteOffset,
          byteLength,
        };
        return source;
      });

      const imageTextures = images.map((image) => {
        const i = imageAssets.indexOf(image);
        if (i >= 0) {
          const bitmap = imageResources[i];
          if (!bitmap) return null;

          const size = [bitmap.width, bitmap.height];
          const format = 'rgba8unorm';
          const colorSpace = 'native';

          const texture = makeCopyableTexture(device, bitmap.width, bitmap.height, format);
          uploadExternalTexture(device, texture, bitmap, size);

          return {
            texture,
            format,
            size,
            colorSpace,
          };
        }
      });

      const bound = {
        storage: gltf.accessors?.map(({bufferView, componentType, count, min, max, type}) => {
          const bufferSource = bufferSources[bufferView];
          if (!bufferSource) return null;

          const {byteLength, byteOffset} = bufferSources[bufferView];
          const resource = bufferResources[gltf.bufferViews[bufferView].buffer];
          const format = accessorToType(type, componentType);

          return {
            ...bufferSources[bufferView],
            format: accessorToType(type, componentType),
            length: count,
            size: [count],
            min,
            max,
          };
        }) ?? NO_BINDINGS,
        texture: gltf.textures?.map(({sampler, source}) => {
          const imageSource = imageTextures[source];
          if (!imageSource) return null;
          
          return {
            ...imageTextures[source],
            sampler: samplerToDescriptor(gltf.samplers[sampler]),
          };
        }) ?? NO_BINDINGS,
      };
      
      return render({
        ...gltf,
        bound,
      });
    };

    // Load external assets
    return bufferAssets.length + imageAssets.length ? (
      gather([
        bufferAssets.map(({uri}) => use(Fetch, {
          url: resolveURL(base, uri),
          type: 'arrayBuffer',
          loading: null,
        })),
        imageAssets.map(({uri}) => use(Fetch, {
          url: resolveURL(base, uri),
          type: 'blob',
          loading: null,
          then: (blob: Blob | null) => {
            if (blob == null) return null;

            return createImageBitmap(blob, {
              alpha: 'default',
              colorSpaceConversion: 'none',
            });
          },
        }))
      ], Resume)
    ) : use(Resume, []);
  };

  // Load GLTF or use inline data
  if (props.data) return use(Resume, [props.data]);
  else return gather(use(Fetch, {
    url,
    type: 'arrayBuffer',
  }), Resume);
};

const samplerToDescriptor = (sampler: any): GPUSamplerDescriptor => {
  const {magFilter, minFilter, wrapS, wrapT} = sampler;
  
  const min =
    minFilter === 9728 ? 'nearest' :
    minFilter === 9729 ? 'linear'  :
    minFilter === 9984 ? 'nearest' : undefined;
    minFilter === 9985 ? 'linear'  : undefined;
    minFilter === 9986 ? 'nearest' : undefined;
    minFilter === 9987 ? 'linear'  : undefined;
  
  const mag =
    magFilter === 9728 ? 'nearest' :
    magFilter === 9729 ? 'linear'  : undefined;

  const mip =
    minFilter === 9984 ? 'nearest' : undefined;
    minFilter === 9985 ? 'nearest' : undefined;
    minFilter === 9986 ? 'linear'  : undefined;
    minFilter === 9987 ? 'linear'  : undefined;
  
  const addressModeU =
    wrapS === 33071 ? 'clamp-to-edge' :
    wrapS === 33648 ? 'mirror-repeat' :
    wrapS === 10497 ? 'repeat' : undefined;

  const addressModeV =
    wrapT === 33071 ? 'clamp-to-edge' :
    wrapT === 33648 ? 'mirror-repeat' :
    wrapT === 10497 ? 'repeat' : undefined;
  
  return {
    minFilter: min,
    magFilter: mag,
    mipmapFilter: mip,
    addressModeU,
    addressModeV,
  };
}

const accessorToType = (boxType: string, componentType: string) => {
  let type: string | null = null;

  if (componentType === 5120) type = 'i8';
  if (componentType === 5121) type = 'u8';
  if (componentType === 5122) type = 'i16';
  if (componentType === 5123) type = 'u16';
  if (componentType === 5125) type = 'u32';
  if (componentType === 5126) type = 'f32';

  if (type === null) throw new Error(`Unsupported GLTF accessor component type ${componentType}`);

  if (boxType === 'SCALAR') return type;
  if (boxType === 'VEC2')   return `vec2<${type}>`;
  if (boxType === 'VEC3')   return `vec3to4<${type}>`;
  if (boxType === 'VEC4')   return `vec4<${type}>`;
  if (boxType === 'MAT2')   return `mat2x2<${type}>`;
  if (boxType === 'MAT3')   return `mat3x3<${type}>`;
  if (boxType === 'MAT4')   return `mat4x4<${type}>`;

  throw new Error(`Unsupported GLTF accessor type ${boxType}`);
};
