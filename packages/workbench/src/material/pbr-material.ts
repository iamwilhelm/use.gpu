import type { LC, LiveElement, PropsWithChildren } from '@use-gpu/live';
import type { Point4 } from '@use-gpu/core';
import type { ShaderModule, ShaderSource } from '@use-gpu/shader';
import type { ColorLike } from '@use-gpu/traits';

import { provide, yeet, signal, useMemo, useOne } from '@use-gpu/live';
import { parseColor, useProp } from '@use-gpu/traits';
import { bundleToAttributes } from '@use-gpu/shader/wgsl';

import { useBoundShader, useNoBoundShader } from '../hooks/useBoundShader';
import { useNativeColorTexture } from '../hooks/useNativeColor';
import { useShaderRef } from '../hooks/useShaderRef';

import { getPBRMaterial } from '@use-gpu/wgsl/material/pbr-material.wgsl';
import { applyPBRMaterial } from '@use-gpu/wgsl/material/pbr-apply.wgsl';

import { getMaterialSurface } from '@use-gpu/wgsl/instance/surface/material.wgsl';
import { getNormalMapSurface } from '@use-gpu/wgsl/instance/surface/normal-map.wgsl';
import { getBasicMaterial } from '@use-gpu/wgsl/material/basic-material.wgsl';

import { ShaderLitMaterial } from './shader-lit-material';

const PBR_BINDINGS = bundleToAttributes(getPBRMaterial);
const SURFACE_BINDINGS = bundleToAttributes(getMaterialSurface);
const NORMAL_MAP_BINDINGS = bundleToAttributes(getNormalMapSurface);

const BASIC_BINDINGS = bundleToAttributes(getBasicMaterial);

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

  render?: (material: Record<string, Record<string, ShaderSource | null | undefined | void>>) => LiveElement,
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

    render,
    children,
  } = props;

  const albedo = useProp(props.albedo, parseColor, WHITE);

  const a = useShaderRef(albedo);
  const e = useShaderRef(emissive  ?? (emissiveMap ? WHITE : BLACK));
  const m = useShaderRef(metalness ?? (metalnessRoughnessMap ? 1 : 0.0));
  const r = useShaderRef(roughness ?? (metalnessRoughnessMap ? 1 : 0.5));

  const t = useNativeColorTexture(albedoMap);

  let am  = useShaderRef(null, t);
  let em  = useShaderRef(null, emissiveMap);
  let om  = useShaderRef(null, occlusionMap);
  let mrm = useShaderRef(null, metalnessRoughnessMap);

  const defines = useMemo(() => ({
    HAS_ALBEDO_MAP: !!albedoMap,
    HAS_COLOR_MAP: !!albedoMap,
    HAS_EMISSIVE_MAP: !!emissiveMap,
    HAS_OCCLUSION_MAP: !!occlusionMap,
    HAS_METALNESS_ROUGHNESS_MAP: !!metalnessRoughnessMap,
  }), [albedoMap, emissiveMap, occlusionMap, metalnessRoughnessMap]);

  const getMaterial = useBoundShader(getPBRMaterial, PBR_BINDINGS, [
    a, e, m, r,
    am, em, om, mrm,
  ], defines);

  const boundSurface = useBoundShader(getMaterialSurface, SURFACE_BINDINGS, [getMaterial]);

  let getSurface = boundSurface;
  if (normalMap) getSurface = useBoundShader(getNormalMapSurface, NORMAL_MAP_BINDINGS, [boundSurface, normalMap]);
  else useNoBoundShader();

  const getFragment = useBoundShader(getBasicMaterial, BASIC_BINDINGS, [albedo, albedoMap], defines);

  return ShaderLitMaterial({
    fragment: getFragment,
    surface: getSurface,
    apply: applyPBRMaterial,
    render,
    children,
  });
}
