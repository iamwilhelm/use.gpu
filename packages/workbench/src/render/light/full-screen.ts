import type { LiveComponent, LiveElement, Lazy, TextureSource } from '@use-gpu/live';
import type { LightKindProps } from './light';

import { yeet, useMemo } from '@use-gpu/live';
import { bundleToAttributes } from '@use-gpu/shader/wgsl';

import { useBoundShader } from '../../hooks/useBoundShader';

import { getLightVertex } from '@use-gpu/wgsl/instance/vertex/light.wgsl';
import { getLightFragment } from '@use-gpu/wgsl/instance/fragment/light.wgsl';

import { FULLSCREEN_PIPELINE, FULLSCREEN_DEFS, useLightDraw } from './light';

const VERTEX_BINDINGS = bundleToAttributes(getLightVertex);
const FRAGMENT_BINDINGS = bundleToAttributes(getLightFragment);

export const FullScreenLightRender: LiveComponent<LightKindProps> = (props: LightKindProps) => {
  const {
    start,
    end,
    gbuffer,

    getLight,
    applyLight,
  } = props;

  const getVertex = useBoundShader(getLightVertex, VERTEX_BINDINGS, [getLight], FULLSCREEN_DEFS);
  const getFragment = useBoundShader(getLightFragment, FRAGMENT_BINDINGS, [...gbuffer, getLight, applyLight]);

  const links = useMemo(() => ({getVertex, getFragment}), [getVertex, getFragment]);

  return yeet(useLightDraw(3, end - start, start, links, FULLSCREEN_PIPELINE));
}
