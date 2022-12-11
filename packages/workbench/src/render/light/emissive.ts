import type { LiveComponent } from '@use-gpu/live';
import type { TextureSource } from '@use-gpu/core';
import type { ShaderModule } from '@use-gpu/shader';
import type { LightKindProps } from './light';

import { yeet, useMemo } from '@use-gpu/live';
import { bundleToAttributes } from '@use-gpu/shader/wgsl';

import { useBoundShader } from '../../hooks/useBoundShader';

import { getLightVertex } from '@use-gpu/wgsl/instance/vertex/light.wgsl';
import { getEmissiveFragment } from '@use-gpu/wgsl/instance/fragment/emissive.wgsl';

import { FULLSCREEN_PIPELINE, FULLSCREEN_DEFS, useLightDraw } from './light';

const VERTEX_BINDINGS = bundleToAttributes(getLightVertex);
const FRAGMENT_BINDINGS = bundleToAttributes(getEmissiveFragment);

export type EmissiveLightRenderProps = {
  gbuffer: TextureSource[],
  getLight: ShaderModule,
};

export const EmissiveLightRender: LiveComponent<EmissiveLightRenderProps> = (props: EmissiveLightRenderProps) => {
  const {
    gbuffer,
    getLight,
  } = props;

  const getVertex = useBoundShader(getLightVertex, VERTEX_BINDINGS, [getLight], FULLSCREEN_DEFS);
  const getFragment = useBoundShader(getEmissiveFragment, FRAGMENT_BINDINGS, gbuffer);

  const links = useMemo(() => ({getVertex, getFragment}), [getVertex, getFragment]);

  return yeet(useLightDraw(3, 1, 0, links, FULLSCREEN_PIPELINE));
}
