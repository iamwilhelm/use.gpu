import type { LC, PropsWithChildren } from '@use-gpu/live';
import type { Point4 } from '@use-gpu/core';
import type { ShaderModule, ShaderSource } from '@use-gpu/shader';
import type { ColorLike } from '@use-gpu/traits';

import { provide, useMemo, useOne } from '@use-gpu/live';
import { parseColor, useProp } from '@use-gpu/traits';
import { makeContext, useContext } from '@use-gpu/live';
import { bindBundle, bundleToAttributes } from '@use-gpu/shader/wgsl';

import { useBoundShader, useNoBoundShader } from '../hooks/useBoundShader';
import { useShaderRef } from '../hooks/useShaderRef';
import { useLightContext, DEFAULT_LIGHT_CONTEXT } from '../providers/light-provider';

import { getPBRMaterial } from '@use-gpu/wgsl/material/pbr-material.wgsl';
import { getDefaultPBRMaterial } from '@use-gpu/wgsl/material/pbr-default.wgsl';
import { applyPBRMaterial } from '@use-gpu/wgsl/material/pbr-apply.wgsl';

import { getShadedFragment } from '@use-gpu/wgsl/instance/fragment/shaded.wgsl';
import { getMaterialSurface } from '@use-gpu/wgsl/instance/surface/material.wgsl';
import { getNormalMapSurface } from '@use-gpu/wgsl/instance/surface/normal-map.wgsl';

// Default PBR shader with built-in light
const getSurface = bindBundle(getMaterialSurface, {
  getMaterial: getDefaultPBRMaterial,
});
const getLight = bindBundle(getShadedFragment, {
  applyLights: DEFAULT_LIGHT_CONTEXT.bindMaterial(applyPBRMaterial),
});
export const DEFAULT_MATERIAL_CONTEXT = {
  getSurface,
  getLight,
};

export const MaterialContext = makeContext<MaterialContextProps>(DEFAULT_MATERIAL_CONTEXT, 'MaterialContext');

export const useMaterialContext = () => useContext(MaterialContext);

const PBR_BINDINGS = bundleToAttributes(getPBRMaterial);
const SURFACE_BINDINGS = bundleToAttributes(getMaterialSurface);
const NORMAL_MAP_BINDINGS = bundleToAttributes(getNormalMapSurface);
const SHADED_BINDINGS = bundleToAttributes(getShadedFragment);

export type MaterialContextProps = {
  getSurface: ShaderModule,
  getLight: ShaderModule,
};

export type PBRMaterialProps = {
  albedo?: ColorLike,
  metalness?: number,
  roughness?: number,
  emissive?: number,

  albedoMap?: ShaderSource,
  metalnessRoughnessMap?: ShaderSource,  
  emissiveMap?: ShaderSource,
  occlusionMap?: ShaderSource,
  normalMap?: ShaderSource,
};

const WHITE = [1, 1, 1, 1] as Point4;
const BLACK = [0, 0, 0, 0] as Point4;

export const PBRMaterial: LC<PBRMaterialProps> = (props: PropsWithChildren<PBRMaterialProps>) => {
  const {
    //albedo,
    metalness,
    roughness,
    emissive,

    albedoMap,
    emissiveMap,
    occlusionMap,
    metalnessRoughnessMap,
    normalMap,

    children,
  } = props;

  const albedo = useProp(props.albedo, parseColor, WHITE);

  const a = useShaderRef(albedo);
  const e = useShaderRef(emissive ?? BLACK);
  const m = useShaderRef(metalness ?? 0);
  const r = useShaderRef(roughness ?? 1);

  let am  = useShaderRef(null, albedoMap);
  let em  = useShaderRef(null, emissiveMap);
  let om  = useShaderRef(null, occlusionMap);
  let mrm = useShaderRef(null, metalnessRoughnessMap);

  const defines = useOne(() => ({
    HAS_ALBEDO_MAP: !!albedoMap,
    HAS_EMISSIVE_MAP: !!emissiveMap,
    HAS_OCCLUSION_MAP: !!occlusionMap,
    HAS_METALNESS_ROUGHNESS_MAP: !!metalnessRoughnessMap,
  }), [albedoMap, emissiveMap, occlusionMap, metalnessRoughnessMap]);

  const getMaterial = useBoundShader(getPBRMaterial, PBR_BINDINGS, [
    a, e, m, r,
    am, em, om, mrm,
  ], defines);

  const boundSurface = useBoundShader(getMaterialSurface, SURFACE_BINDINGS, [getMaterial]);

  const {useMaterial} = useLightContext();
  const applyLights = useMaterial(applyPBRMaterial);
  const getLight = useBoundShader(getShadedFragment, SHADED_BINDINGS, [applyLights]);

  let getSurface = boundSurface;
  if (normalMap) getSurface = useBoundShader(getNormalMapSurface, NORMAL_MAP_BINDINGS, [boundSurface, normalMap]);
  else useNoBoundShader();

  const context = useMemo(() => ({
    getSurface,
    getLight,
  }), [getSurface, getLight]);

  return provide(MaterialContext, context, children);
}
