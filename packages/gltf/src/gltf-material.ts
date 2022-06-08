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

  const props: Partial<PBRMaterialProps> = {};

  if (pbrMetallicRoughness) {
    const {
      baseColorFactor,
      baseColorTexture,
      metallicFactor,
      roughnessFactor,
      metallicRoughnessTexture,
    } = pbrMetallicRoughness;

    if (baseColorFactor) props.albedo = baseColorFactor;
    if (baseColorTexture) {
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