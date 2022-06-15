import { LC, PropsWithChildren } from '@use-gpu/live/types';
import { Point4 } from '@use-gpu/core/types';
import { ShaderModule, ShaderSource } from '@use-gpu/shader/types';

import { provide } from '@use-gpu/live';
import { useProp } from '../traits/useProp';
import { ColorLike } from '../traits/types';
import { parseColor } from '../traits/parse';
import { makeContext, useContext } from '@use-gpu/live';
import { bundleToAttributes } from '@use-gpu/shader/wgsl';

import { useBoundShader } from '../hooks/useBoundShader';
import { useShaderRef } from '../hooks/useShaderRef';

import { getShadedFragment } from '@use-gpu/wgsl/instance/fragment/shaded.wgsl';
import { getMappedFragment } from '@use-gpu/wgsl/instance/fragment/mapped.wgsl';
import { applyPBRMaterial } from '@use-gpu/wgsl/material/pbr.wgsl';

export const MaterialContext = makeContext<ShaderModule>(getShadedFragment, 'MaterialContext');

export const useMaterialContext = () => useContext(MaterialContext);

const PBR_BINDINGS = bundleToAttributes(applyPBRMaterial);
const MAPPED_BINDINGS = bundleToAttributes(getMappedFragment);
const SHADED_BINDINGS = bundleToAttributes(getShadedFragment);

export type MaterialProps = {
  material: ShaderModule,
};

export type PBRMaterialProps = {
  albedo?: ColorLike,
  metalness?: number,
  roughness?: number,

  albedoMap?: ShaderSource,
  metalnessMap?: ShaderSource,
  roughnessMap?: ShaderSource,

  metalnessRoughnessMap?: ShaderSource,
  
  normalMap?: ShaderSource,
  occlusionMap?: ShaderSource,
  emissiveMap?: ShaderSource,
};

const WHITE = [1, 1, 1, 1] as Point4;

export const PBRMaterial: LC<PBRMaterialProps> = (props: PropsWithChildren<PBRMaterialProps>) => {
  const {
    // albedo
    metalness = 0.0,
    roughness = 0.5,

    albedoMap,
    metalnessMap,
    roughnessMap,
    metalnessRoughnessMap,

    normalMap,
    occlusionMap,
    emissiveMap,

    children,
  } = props;

  const albedo = useProp(props.albedo, parseColor, WHITE);

  const a = useShaderRef(albedo, albedoMap);
  const m = useShaderRef(metalness, metalnessMap);
  const r = useShaderRef(roughness, roughnessMap);

  const mr = useShaderRef(null, metalnessRoughnessMap);

  const applyMaterial = useBoundShader(applyPBRMaterial, PBR_BINDINGS, [a, m, r, mr]);

  let getFragment: ShaderModule;
  if (normalMap || occlusionMap || emissiveMap) {
    getFragment = useBoundShader(getMappedFragment, MAPPED_BINDINGS, [applyMaterial, normalMap, occlusionMap, emissiveMap]);
  }
  else {
    getFragment = useBoundShader(getShadedFragment, SHADED_BINDINGS, [applyMaterial]);
  }

  return provide(MaterialContext, getFragment, children);
}
