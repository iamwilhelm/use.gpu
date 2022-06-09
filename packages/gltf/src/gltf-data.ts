import { LC, LiveElement } from '@use-gpu/live/types';
import { StorageSource } from '@use-gpu/core/types';
import { GLTF, GLTFSceneData, GLTFNodeData, GLTFMeshData, GLTFMaterialData } from './types';
import { toScene, toNode, toMesh, toMaterial } from './parse';

import { use, gather, useContext, useOne, useMemo } from '@use-gpu/live';

import { DeviceContext, Fetch, getBoundShader } from '@use-gpu/components';
import { bundleToAttributes } from '@use-gpu/shader/wgsl';
import { makeCopyableTexture, makeStorageBuffer, uploadBuffer, uploadExternalTexture, UNIFORM_ARRAY_TYPES } from '@use-gpu/core';

import { generateTangents } from 'mikktspace';

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

      const bufferAssets = buffers.filter(({uri}) => uri != null);
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

      const bufferAssetIndices = buffers.map(b => bufferAssets.indexOf(b));
      const imageAssetIndices = images.map(i => imageAssets.indexOf(i));

      // Gather raw arraybuffers / image resources
      const [bufferResources, imageResources] = useOne(() => [
        resources.slice(0, n),
        resources.slice(n),
      ], resources);

      const { accessors, bufferViews, samplers, textures } = gltf;

      // Upload all buffers as-is
      const gpuBuffers = useMap(buffers,
        (buffer, index) => {
          const i = bufferAssetIndices[index];
          if (i >= 0) {
            if (!bufferResources[i]) return null;

            const b = makeStorageBuffer(device, buffer.byteLength);
            uploadBuffer(device, b, bufferResources[i] as ArrayBuffer);
            return b;
          }
          else throw new Error('GLTF buffer without data');
        },
        (buffer, index) => bufferResources[bufferAssetIndices[index]],
        [buffers]);

      console.log({gpuBuffers, buffers, bufferAssets, bufferResources})

      // Convert bufferviews to storage source templates
      const bufferSources = useMap(bufferViews,
        ({buffer, byteOffset, byteLength, byteStride}, index) => {
          if (byteStride != null && byteStride !== 1) throw new Error("byteStride != 1 not implemented");
      
          let gpuBuffer = gpuBuffers[buffer];
          if (!gpuBuffer) return null;

          let arrayBuffer = bufferResources[bufferAssetIndices[buffer]];

          // If GLTF alignment is too loose, slice and re-upload.
          if ((byteOffset % STORAGE_ALIGNMENT) !== 0) {
            const b = makeStorageBuffer(device, byteLength);

            const arraySlice = arrayBuffer.slice(byteOffset, byteOffset + byteLength);

            uploadBuffer(device, b, arraySlice);
            gpuBuffer = b;
            byteOffset = 0;

            arrayBuffer = arraySlice;
          }

          return {
            buffer: gpuBuffer,
            arrayBuffer,

            format: '',
            length: 0,
            size: [0],
            version: 0,

            byteOffset,
            byteLength,
          };
        },
        ({buffer}, index) => gpuBuffers[buffer],
        [bufferViews]);

      // Convert accessors to storage sources
      const storageSources = useMap(accessors,
        ({bufferView, componentType, count, min, max, type}, index) => {
          const bufferSource = bufferSources[bufferView];
          if (!bufferSource) return null;

          const {byteLength, byteOffset} = bufferSource;
          const format = accessorToType(type, componentType);

          return {
            ...bufferSource,
            format: accessorToType(type, componentType),
            length: count,
            size: [count],
            min,
            max,
          };
        },
        ({bufferView}) => bufferSources[bufferView],
        [accessors]);

      // Expose native typed arrays for further processing before upload
      const typedData = useMap(storageSources,
        (source, index) => {
          if (!source) return null;

          const ctor = UNIFORM_ARRAY_TYPES[source.format];
          const {arrayBuffer} = source;
          return arrayBuffer ? new ctor(arrayBuffer) : null;
        },
        (source) => source,
        []);

      // Convert images to external textures
      const imageSources = useMap(images,
        (image, index) => {
          const i = imageAssetIndices[index];
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
              layout: 'texture_2d<f32>',
            };
          }
        },
        (image, index) => imageResources[imageAssetIndices[index]],
        [images]);

      // Convert textures to texture sources
      const textureSources = useMap(textures,
        ({sampler, source}, index) => {
          const imageSource = imageSources[source];
          if (!imageSource) return null;
      
          return {
            ...imageSource,
            sampler: samplerToDescriptor(samplers[sampler]),
          };
        },
        ({source}, index) => imageSources[source],
        [textures]);

      const bound = {
        data: typedData,
        storage: storageSources,
        texture: textureSources,
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
    minFilter === 9984 ? 'nearest' :
    minFilter === 9985 ? 'linear'  :
    minFilter === 9986 ? 'nearest' :
    minFilter === 9987 ? 'linear'  : 'linear';
  
  const mag =
    magFilter === 9728 ? 'nearest' :
    magFilter === 9729 ? 'linear'  : 'linear';

  const mip =
    minFilter === 9984 ? 'nearest' :
    minFilter === 9985 ? 'nearest' :
    minFilter === 9986 ? 'linear'  :
    minFilter === 9987 ? 'linear'  : 'linear';
  
  const addressModeU =
    wrapS === 33071 ? 'clamp-to-edge' :
    wrapS === 33648 ? 'mirror-repeat' :
    wrapS === 10497 ? 'repeat' : 'repeat'

  const addressModeV =
    wrapT === 33071 ? 'clamp-to-edge' :
    wrapT === 33648 ? 'mirror-repeat' :
    wrapT === 10497 ? 'repeat' : 'repeat';
  
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

const NO_DEPS: any = [];
const useMap = <A, B>(
  args: A[] | null | undefined,
  map: (a: A, i: number) => B,
  key: (a: A, i: number) => any,
  deps: any[] = NO_DEPS,
): B[] | null => {
  
  const values = useMemo(() => args?.map(() => null), deps);
  const keys = useMemo(() => args?.map(() => null), deps);

  if (!values) return null;

  const n = args.length;
  for (let i = 0; i < n; ++i) {
    const k = key(args[i], i);
    if (k !== keys[i]) values[i] = map(args[i], i);
  }
  if (values.length !== n) values.length = n;

  return values;
};
