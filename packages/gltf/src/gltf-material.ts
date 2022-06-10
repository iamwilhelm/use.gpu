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
    //emissiveFactor,
    //alphaMode,
    //alphaCutoff,
    //doubleSided,
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

    if (metallicFactor != null) {
      props.metalness = metallicFactor;
    }
    if (roughnessFactor != null) {
      props.roughness = roughnessFactor;
    }
    if (metallicRoughnessTexture != null) {
      const map = gltf.bound.texture[metallicRoughnessTexture.index];
      props.metalnessRoughnessMap = map;
      if (metallicFactor == null) props.metalness = 1.0;
      if (roughnessFactor == null) props.roughness = 1.0;
    }
    
    if (normalTexture != null) {
      const map = gltf.bound.texture[normalTexture.index];
      props.normalMap = map;
    }

    if (occlusionTexture != null) {
      const map = gltf.bound.texture[occlusionTexture.index];
      props.occlusionMap = map;
    }

    if (emissiveTexture != null) {
      const map = gltf.bound.texture[emissiveTexture.index];
      props.emissiveMap = map;
    }
  }
  
  return props;
};
