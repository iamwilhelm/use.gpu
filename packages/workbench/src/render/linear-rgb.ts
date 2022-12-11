import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { UseGPURenderContext, TextureSource, ColorSpace } from '@use-gpu/core';
import type { ShaderModule } from '@use-gpu/shader';

import { gather, use, useMemo } from '@use-gpu/live';
import { bundleToAttributes, chainTo } from '@use-gpu/shader/wgsl';

import { Pass } from './pass';
import { RenderTarget } from './render-target';
import { RenderToTexture } from './render-to-texture';
import { RawFullScreen } from '../primitives';

import { useBoundShader } from '../hooks/useBoundShader';
import { useShaderRef } from '../hooks/useShaderRef';

import { gainColor } from '@use-gpu/wgsl/fragment/gain.wgsl';
import { tonemapACES } from '@use-gpu/wgsl/fragment/aces.wgsl';

const GAIN_BINDINGS = bundleToAttributes(gainColor);

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

  children?: LiveElement,
  then?: (texture: TextureSource) => LiveElement,
};

/** Sets up a Linear RGB render target and automatically renders it to the screen as sRGB. */
export const LinearRGB: LiveComponent<LinearRGBProps> = (props: LinearRGBProps) => {
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
    ([target]: UseGPURenderContext[]) =>
      use(RenderToTexture, {
        target,
        children,
        then: (texture: TextureSource) => {
          const {then} = props;

          const g = useShaderRef(gain);
          let filter = useBoundShader(gainColor, GAIN_BINDINGS, [g], {IS_OPAQUE: !overlay});
          if (tonemap === 'aces') filter = chainTo(filter, tonemapACES);

          const view = useMemo(() =>
            use(Pass, {
              picking: false,
              children:
                use(RawFullScreen, {
                  texture,
                  filter,
                }),
            }),
            [texture, filter]
          );

          return then ? [view, then(texture)] : view;
        },
      })
  );
};
