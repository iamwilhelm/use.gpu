import type { LC, LiveElement, PropsWithChildren } from '@use-gpu/live';
import type { ColorLike, XYZW } from '@use-gpu/core';
import type { ShaderModule, ShaderSource } from '@use-gpu/shader';

import { provide, yeet, signal, useMemo, useOne } from '@use-gpu/live';
import { useProp } from '@use-gpu/traits/live';
import { parseColor } from '@use-gpu/parse';
import { bindBundle } from '@use-gpu/shader/wgsl';

import { useShader, useNoShader } from '../hooks/useShader';
import { useNativeColorTexture } from '../hooks/useNativeColor';
import { useShaderRef } from '../hooks/useShaderRef';
import { useLightContext } from '../providers/light-provider';
import { MaterialContext } from '../providers/material-provider';

import { ShaderFlatMaterial } from './shader-flat-material';

import { getBasicMaterial } from '@use-gpu/wgsl/material/basic-material.wgsl';
import { getSolidSurface } from '@use-gpu/wgsl/instance/surface/solid.wgsl';
import { getSolidFragment } from '@use-gpu/wgsl/instance/fragment/solid.wgsl';

export type BasicMaterialProps = {
  color?: ColorLike,
  colorMap?: ShaderSource,

  render?: (material: Record<string, Record<string, ShaderSource | null | undefined | void>>) => LiveElement,
};

const WHITE = [1, 1, 1, 1] as XYZW;

export const BasicMaterial: LC<BasicMaterialProps> = (props: PropsWithChildren<BasicMaterialProps>) => {
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

  const getFragment = useShader(getBasicMaterial, [c, cm], defines);

  return ShaderFlatMaterial({
    fragment: getFragment,
    render,
    children,
  });
}
