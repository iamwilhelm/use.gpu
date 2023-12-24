import type { LC, LiveElement, PropsWithChildren } from '@use-gpu/live';
import type { ColorLike, XYZW } from '@use-gpu/core';
import type { ShaderModule, ShaderSource } from '@use-gpu/shader';

import { provide, yeet, signal, useMemo, useOne } from '@use-gpu/live';

import { useShader, useNoShader } from '../hooks/useShader';
import { useNativeColorTexture } from '../hooks/useNativeColor';
import { useShaderRef } from '../hooks/useShaderRef';
import { useLightContext } from '../providers/light-provider';
import { MaterialContext } from '../providers/material-provider';

import { getLitFragment } from '@use-gpu/wgsl/instance/fragment/lit.wgsl';
import { applyPBRMaterial } from '@use-gpu/wgsl/material/pbr-apply.wgsl';

export type ShaderLitMaterialProps = {
  /** Flat shader, for unlit passes (e.g. shadow map)
 
  fn getFragment(color: vec4<f32>, uv: vec4<f32>, st: vec4<f32>) -> vec4<f32> 
  */
  fragment: ShaderModule,

  /** Depth-only shader, for optimized shadow passes (optional)
  fn getDepth(
    alpha: f32,
    uv: vec4<f32>,
    st: vec4<f32>,
    position: vec4<f32>,
  ) -> DepthFragment;
  */
  depth?: ShaderModule,

  /** Surface shader, for material properties
  
  fn getSurface(
    color: vec4<f32>,
    uv: vec4<f32>,
    st: vec4<f32>,
    normal: vec4<f32>,
    tangent: vec4<f32>,
    position: vec4<f32>,
  ) -> SurfaceFragment
  */
  surface: ShaderModule,

  /** Environment shader, for reflections

  fn getEnvironment(
    N: vec3<f32>,
    V: vec3<f32>,
    surface: SurfaceFragment,
  ) -> vec3<f32>
  */
  environment?: ShaderModule,

  /** Material lighting shader, for lighting model. e.g. `applyPBRMaterial`.
  
  fn getLight(surface: SurfaceFragment) -> vec4<f32> */
  apply?: ShaderModule,
  render?: (material: Record<string, Record<string, ShaderSource | null | undefined | void>>) => LiveElement,
};

export const ShaderLitMaterial: LC<ShaderLitMaterialProps> = (props: PropsWithChildren<ShaderLitMaterialProps>) => {
  const {
    depth,
    fragment,
    surface,
    environment,
    apply = applyPBRMaterial,
    render,
    children,
  } = props;

  const {useMaterial} = useLightContext();
  const applyLights = useMaterial(apply);

  const getLight = applyLights ? useShader(getLitFragment, [applyLights, environment]) : useNoShader();
  const getSurface = surface;
  const getFragment = fragment;
  const getDepth = depth;

  const context = useMemo(() => ({
    solid: {
      getFragment,
    },
    shaded: {
      getDepth,
      getFragment,
      getSurface,
      getLight,
    },
  }), [getSurface, getLight, getDepth, getFragment]);

  const view = render ? render(context) : children;
  return render ?? children ? provide(MaterialContext, context, [signal(), view]) : yeet(context);
}
