import type { LiveComponent } from '@use-gpu/live';
import type { LightKindProps } from './light';

import { yeet, useMemo } from '@use-gpu/live';
import { bundleToAttributes } from '@use-gpu/shader/wgsl';

import { useBoundShader } from '../../hooks/useBoundShader';

import { getLightVertex } from '@use-gpu/wgsl/instance/vertex/light.wgsl';
import { getEmissiveFragment } from '@use-gpu/wgsl/instance/fragment/emissive.wgsl';

import { FULLSCREEN_PIPELINE, FULLSCREEN_DEFS, useLightRender } from './light';

const VERTEX_BINDINGS = bundleToAttributes(getLightVertex);
const FRAGMENT_BINDINGS = bundleToAttributes(getEmissiveFragment);

export const EmissiveLightRender: LiveComponent<LightKindProps> = (props: LightKindProps) => {
  const {
    gbuffer,
    getLight,
  } = props;

  const getVertex = useBoundShader(getLightVertex, VERTEX_BINDINGS, [getLight], FULLSCREEN_DEFS);
  const getFragment = useBoundShader(getEmissiveFragment, FRAGMENT_BINDINGS, gbuffer);

  const links = useMemo(() => ({getVertex, getFragment}), [getVertex, getFragment]);

  return yeet(useLightRender(3, 1, 0, links, FULLSCREEN_PIPELINE));
}
