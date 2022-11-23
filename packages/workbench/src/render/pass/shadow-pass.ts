import type { LC, PropsWithChildren, LiveFiber, LiveElement, ArrowFunction, UniformPipe } from '@use-gpu/live';
import type { LightEnv, Renderable } from '../pass';

import { keyed, memo, useMemo } from '@use-gpu/live';
import { VIEW_UNIFORMS, makeDepthStencilState, makeDepthStencilAttachment, makeGlobalUniforms, uploadBuffer } from '@use-gpu/core';

import { useDeviceContext } from '../../providers/device-provider';
import { useViewContext } from '../../providers/view-provider';

import { useInspectable } from '../../hooks/useInspectable'

import { SHADOW_FORMAT, SHADOW_PAGE } from '../renderer/light-data';
import { getRenderPassDescriptor, getDrawOrder } from './util';

import { ShadowOrthoPass } from './shadow-ortho';

export type ShadowPassProps = {
  calls: {
    light?: LightEnv[],
    shadow?: Renderable[],
  },
};

const NO_OPS: any[] = [];
const toArray = <T>(x?: T[]): T[] => Array.isArray(x) ? x : NO_OPS; 

/** Shadow render pass.

Draws all shadow calls to multiple shadow maps.
*/
export const ShadowPass: LC<ShadowPassProps> = memo((props: PropsWithChildren<ShadowPassProps>) => {
  const {
    calls,
  } = props;

  const inspect = useInspectable();

  const device = useDeviceContext();
  const [light] = toArray(calls['light'] as LightEnv[]);
  if (!light) return;

  const {maps, texture} = light;

  const [
    depthStencilState,
    depthStencilAttachment,
    descriptor,
  ] = useMemo(() => {
    const depthStencilState = makeDepthStencilState(SHADOW_FORMAT);
    const attachment = makeDepthStencilAttachment(texture.texture, SHADOW_FORMAT);

    const descriptor = {
      colorAttachments: [],
      depthStencilAttachment: attachment,
    };

    return [texture, attachment, descriptor];
  }, [device, texture]);

  const out: LiveElement[] = [];
  for (const map of maps.values()) {
    const Component = (map.shadow.type === 'ortho') ? ShadowOrthoPass : null;
    if (Component) out.push(keyed(Component, map.id, {calls, map, descriptor, texture}));
  }
  return out;
}, 'ShadowPass');
