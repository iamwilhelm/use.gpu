import type { LC, PropsWithChildren } from '@use-gpu/live';
import type { Point4 } from '@use-gpu/core';
import type { ShaderModule, ShaderSource } from '@use-gpu/shader';
import type { ColorLike } from '@use-gpu/traits';

import { provide, yeet, signal, useMemo, useOne } from '@use-gpu/live';
import { parseColor, useProp } from '@use-gpu/traits';
import { bindBundle, bundleToAttributes } from '@use-gpu/shader/wgsl';

import { useBoundShader, useNoBoundShader } from '../hooks/useBoundShader';
import { useNativeColorTexture } from '../hooks/useNativeColor';
import { useShaderRef } from '../hooks/useShaderRef';
import { useLightContext } from '../providers/light-provider';
import { MaterialContext } from '../providers/material-provider';

import { getBasicMaterial } from '@use-gpu/wgsl/material/basic-material.wgsl';
import { getSolidSurface } from '@use-gpu/wgsl/instance/surface/solid.wgsl';
import { getSolidFragment } from '@use-gpu/wgsl/instance/fragment/solid.wgsl';

const BASIC_BINDINGS = bundleToAttributes(getBasicMaterial);
const SURFACE_BINDINGS = bundleToAttributes(getSolidSurface);

export type BasicMaterialProps = {
  color?: ColorLike,
  colorMap?: ShaderSource,

  render?: (material: Record<string, Record<string, ShaderSource>>) => LiveElement,
};

const WHITE = [1, 1, 1, 1] as Point4;

export const BasicMaterial: LC<PBRMaterialProps> = (props: PropsWithChildren<PBRMaterialProps>) => {
  const {
    //color,
    colorMap,

    render,
    children,
  } = props;

  const color = useProp(props.color, parseColor, WHITE);

  const t = useNativeColorTexture(colorMap);

  const c = useShaderRef(color);
  let cm = useShaderRef(null, t);

  const defines = useOne(() => ({
    HAS_COLOR_MAP: !!colorMap,
  }), colorMap);

  const getFragment = useBoundShader(getBasicMaterial, BASIC_BINDINGS, [c, cm], defines);

  const getSurface = useBoundShader(getSolidSurface, SURFACE_BINDINGS, [getFragment]);
  const getLight = getSolidFragment;

  const context = useMemo(() => ({
    solid: {
      getFragment,
    },
    shaded: {
      getSurface,
      getLight,
    },
  }), [getSurface, getLight]);

  const view = render ? render(context) : children;
  return render ?? children ? provide(MaterialContext, context, [signal, view]) : yeet(context);
}
