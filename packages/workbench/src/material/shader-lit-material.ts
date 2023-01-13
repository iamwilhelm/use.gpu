import type { LC, LiveElement, PropsWithChildren } from '@use-gpu/live';
import type { Point4 } from '@use-gpu/core';
import type { ShaderModule, ShaderSource } from '@use-gpu/shader';
import type { ColorLike } from '@use-gpu/traits';

import { provide, yeet, signal, useMemo, useOne } from '@use-gpu/live';
import { bundleToAttributes } from '@use-gpu/shader/wgsl';

import { useBoundShader, useNoBoundShader } from '../hooks/useBoundShader';
import { useNativeColorTexture } from '../hooks/useNativeColor';
import { useShaderRef } from '../hooks/useShaderRef';
import { useLightContext } from '../providers/light-provider';
import { MaterialContext } from '../providers/material-provider';

import { getShadedFragment } from '@use-gpu/wgsl/instance/fragment/shaded.wgsl';

const SHADED_BINDINGS = bundleToAttributes(getShadedFragment);

export type ShaderLitMaterialProps = {
  /** Flat shader, for unlit passes (e.g. shadow map) */
  fragment: ShaderModule,
  /** Surface shader, for material properties */
  surface: ShaderModule,
  /** Material lighting shader, for lighting model */
  apply: ShaderModule,
  render?: (material: Record<string, Record<string, ShaderSource | null | undefined | void>>) => LiveElement,
};

export const ShaderLitMaterial: LC<ShaderLitMaterialProps> = (props: PropsWithChildren<ShaderLitMaterialProps>) => {
  const {
    fragment,
    surface,
    apply,
    render,
    children,
  } = props;

  const {useMaterial} = useLightContext();
  const applyLights = useMaterial(apply);

  const getSurface = surface;
  const getLight = applyLights ? useBoundShader(getShadedFragment, SHADED_BINDINGS, [applyLights]) : useNoBoundShader();
  const getFragment = fragment;

  const context = useMemo(() => ({
    solid: {
      getFragment,
    },
    shaded: {
      getFragment,
      getSurface,
      getLight,
    },
  }), [getSurface, getLight]);

  const view = render ? render(context) : children;
  return render ?? children ? provide(MaterialContext, context, [signal(), view]) : yeet(context);
}
