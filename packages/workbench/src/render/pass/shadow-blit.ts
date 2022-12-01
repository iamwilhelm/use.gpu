import type { ShaderSource } from '@use-gpu/shader/wgsl';
import type { Renderable } from './types';

import { useCallback, useOne, useRef } from '@use-gpu/live';
import { bindBundle } from '@use-gpu/shader/wgsl';

import { useDeviceContext } from '../../providers/device-provider';
import { usePassContext } from '../../providers/pass-provider';

import { SHADOW_PAGE } from '../renderer/light-data';

import { getFullScreenVertex } from '@use-gpu/wgsl/instance/vertex/full-screen.wgsl';
import instanceDrawVirtualDepth from '@use-gpu/wgsl/render/vertex/virtual-depth.wgsl';
import instanceFragmentDepth from '@use-gpu/wgsl/render/fragment/frag-depth.wgsl';

import { drawCall } from '../command/draw-call';

const countGeometry = () => {};

export const useShadowBlit = (
  descriptor: GPURenderPassDescriptor,
  uv: TypedArray | number[],

  getSample: ShaderSource,
) => {
  const device = useDeviceContext();
  const {renderContexts: {depth: renderContext}} = usePassContext();

  const [vertex, fragment] = useOne(() => {
    const vertexShader = bindBundle(instanceDrawVirtualDepth, {getVertex: getFullScreenVertex});
    const fragmentShader = bindBundle(instanceFragmentDepth, {getFragment: getSample});

    return [vertexShader, fragmentShader];
  }, getSample);

  const blitRef = useRef<Renderable>();

  const draw = useCallback((commandEncoder: GPUCommandEncoder) => {
    const passEncoder = commandEncoder.beginRenderPass(descriptor);

    const x = uv[0] * SHADOW_PAGE;
    const y = uv[1] * SHADOW_PAGE;
    const w = (uv[2] - uv[0]) * SHADOW_PAGE;
    const h = (uv[3] - uv[1]) * SHADOW_PAGE;

    passEncoder.setViewport(x, y, w, h, 0, 1);
    blitRef.current?.opaque?.draw(passEncoder, countGeometry);
    passEncoder.end();
  }, [uv, descriptor]);

  blitRef.current = drawCall({
    vertexCount: 3,
    instanceCount: 1,
    vertex,
    fragment,
    renderContext,
  });

  return draw;
};
