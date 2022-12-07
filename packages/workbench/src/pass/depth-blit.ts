import type { UseGPURenderContext } from '@use-gpu/core';
import type { ShaderSource } from '@use-gpu/shader/wgsl';
import type { Renderable } from './types';

import { useCallback, useOne, useRef } from '@use-gpu/live';
import { bindBundle } from '@use-gpu/shader/wgsl';

import { useDeviceContext } from '../providers/device-provider';
import { usePassContext } from '../providers/pass-provider';

import { SHADOW_PAGE } from '../renderer/light-data';

import { getFullScreenVertex } from '@use-gpu/wgsl/instance/vertex/full-screen.wgsl';
import instanceDrawVirtualDepth from '@use-gpu/wgsl/render/vertex/virtual-depth.wgsl';
import instanceFragmentDepth from '@use-gpu/wgsl/render/fragment/frag-depth.wgsl';

import { drawCall } from '../queue/draw-call';

const countGeometry = () => {};

export const useDepthBlit = (
  renderContext: UseGPURenderContext,
  descriptor: GPURenderPassDescriptor,
  uv?: TypedArray | number[],
  scale: number = 1,

  getSample: ShaderSource | null = null,
) => {
  const device = useDeviceContext();

  const [vertex, fragment] = useOne(() => {
    const vertexShader = bindBundle(instanceDrawVirtualDepth, {getVertex: getFullScreenVertex});
    const fragmentShader = bindBundle(instanceFragmentDepth, {getFragment: getSample});

    return [vertexShader, fragmentShader];
  }, getSample);

  const blitRef = useRef();

  const draw = useCallback((commandEncoder: GPUCommandEncoder) => {
    const passEncoder = commandEncoder.beginRenderPass(descriptor);

    if (uv) {
      const x = uv[0] * scale;
      const y = uv[1] * scale;
      const w = (uv[2] - uv[0]) * scale;
      const h = (uv[3] - uv[1]) * scale;

      passEncoder.setViewport(x, y, w, h, 0, 1);
    }

    const {current: blit} = blitRef;
    blit?.draw && blit.draw(passEncoder, countGeometry);

    passEncoder.end();
  }, [uv, descriptor]);

  blitRef.current = drawCall({
    vertexCount: 3,
    instanceCount: 1,
    vertex,
    fragment,
    renderContext,
    mode: null,
  });

  return draw;
};
