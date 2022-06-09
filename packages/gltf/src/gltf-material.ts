import { LC, PropsWithChildren, LiveElement } from '@use-gpu/live/types';
import { GLTF, GLTFPrimitive } from './types';

import { bundleToAttributes } from '@use-gpu/shader/wgsl';
import { use, provide, useMemo } from '@use-gpu/live';
import { mat4 } from 'gl-matrix';

import { PBRMaterialProps, useBoundShader, useShaderRef } from '@use-gpu/components';

export const useGLTFMaterial = (
  gltf: GLTF,
  material: number,
) => {
  const {
    pbrMetallicRoughness,
    normalTexture,
    occlusionTexture,
    emissiveTexture,
    emissiveFactor,
    alphaMode,
    alphaCutoff,
    doubleSided,
  } = gltf.materials[material];

  const props: Partial<PBRMaterialProps> = {
    metalness: 0.0,
    roughness: 0.5,
  };

  if (pbrMetallicRoughness) {
    const {
      baseColorFactor,
      baseColorTexture,
      metallicFactor,
      roughnessFactor,
      metallicRoughnessTexture,
    } = pbrMetallicRoughness;

    if (baseColorTexture != null) {
      const map = gltf.bound.texture[baseColorTexture.index];
      props.albedoMap = map;
    }
    if (baseColorFactor != null) {
      props.albedo = baseColorFactor;
    }

    if (metallicRoughnessTexture != null) {
      const map = gltf.bound.texture[metallicRoughnessTexture.index];
      const gain = [1, metallicFactor ?? 1, roughnessFactor ?? 1, 1];
      
      props.metalnessRoughnessMap = map;
    }
    if (metallicFactor != null) {
      props.metalness = metallicFactor;
    }
    if (roughnessFactor != null) {
      props.roughness = roughnessFactor;
    }
  }
  
  return props;
};

const useGLTFTexture = (
  gltf: GLTF,
  texture: number,
) => {
  const {sampler, source} = gltf.textures[texture];
  const image = gltf.images[source];
  
};

/*
type PBRMaterialProps = {
  albedo?: ColorLike,
  metalness?: number,
  roughness?: number,

  normalMap?: TextureSource,
  occlusionMap?: TextureSource,
  
  albedoMap?: TextureSource,
  metalnessMap?: TextureSource,
  roughnessMap?: TextureSource,
};
*/