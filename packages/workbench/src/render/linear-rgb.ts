import type { LiveComponent, LiveElement, PropsWithChildren } from '@use-gpu/live';
import type { UseGPURenderContext, TextureSource, ColorSpace } from '@use-gpu/core';
import type { ShaderModule } from '@use-gpu/shader';

import { gather, use, useMemo, useOne } from '@use-gpu/live';
import { chainTo } from '@use-gpu/shader/wgsl';

import { Pass } from './pass';
import { RenderTarget } from './render-target';
import { RenderToTexture } from './render-to-texture';
import { RawFullScreen } from '../primitives';

import { getShader } from '../hooks/useShader';
import { useShaderRef } from '../hooks/useShaderRef';

import { gainColor } from '@use-gpu/wgsl/fragment/gain.wgsl';
import { tonemapACES } from '@use-gpu/wgsl/fragment/aces.wgsl';

export type LinearRGBProps = {
  width?: number,
  height?: number,
  live?: boolean,
  history?: number,
  sampler?: Partial<GPUSamplerDescriptor>,

  depthStencil?: GPUTextureFormat | null,
  backgroundColor?: GPUColor,

  colorInput?: ColorSpace,
  samples?: number,
  tonemap?: 'aces' | 'linear',
  gain?: number,

  overlay?: boolean,

  then?: (texture: TextureSource) => LiveElement,
};

/** Sets up a Linear RGB render target and automatically renders it to the screen as sRGB. */
export const LinearRGB: LiveComponent<LinearRGBProps> = (props: PropsWithChildren<LinearRGBProps>) => {
  const {
    tonemap = 'linear',
    gain = 1,
    overlay = false,
    then,
    children,
    ...rest
  } = props;

  return gather(
    use(RenderTarget, {
      ...rest,
      format: "rgba16float",
      colorSpace: 'linear',
    }),
    ([target]: UseGPURenderContext[]) => {
      const {then} = props;

      const g = useShaderRef(gain);
      const defs = useOne(() => ({IS_OPAQUE: !overlay}), overlay);

      const filter = useMemo(() => {
        let filter = getShader(gainColor, [g], defs);
        if (tonemap === 'aces') filter = chainTo(filter, tonemapACES);
        return filter;
      }, [defs, tonemap]);

      const view = useMemo(() => [
        use(RenderToTexture, {
          target,
          children,
        }),
        use(Pass, {
          mode: 'fullscreen',
          picking: false,
          children:
            use(RawFullScreen, {
              texture: target.source,
              filter,
            }),
        }),
      ], [target, filter]);

      return then ? [view, then(texture)] : view;
    },
  );
};
