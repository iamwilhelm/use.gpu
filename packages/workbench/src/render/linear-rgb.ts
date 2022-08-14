import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { UseGPURenderContext, TextureSource, ColorSpace } from '@use-gpu/core';
import type { ShaderModule } from '@use-gpu/shader';

import { gather, use, useOne } from '@use-gpu/live';
import { Draw } from './draw';
import { Pass } from './pass';
import { RenderTarget } from './render-target';
import { RenderToTexture } from './render-to-texture';
import { RawFullScreen } from '../primitives';

export type LinearRGBProps = {
  width?: number,
  height?: number,
  live?: boolean,
  history?: number,
  sampler?: Partial<GPUSamplerDescriptor>,
  //format?: GPUTextureFormat,
  depthStencil?: GPUTextureFormat | null,
  backgroundColor?: GPUColor,
  //colorSpace?: ColorSpace,
  colorInput?: ColorSpace,
  samples?: number,

  children?: LiveElement,
  then?: (texture: TextureSource) => LiveElement,
};

export const LinearRGB: LiveComponent<LinearRGBProps> = (props: LinearRGBProps) => {
  const {then, children, ...rest} = props;
  
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

          const view = useOne(() =>
            use(Draw, {
              children:
                use(Pass, {
                  picking: false,
                  children:
                    use(RawFullScreen, {
                      texture,
                    }),
                }),
            }),
            texture
          );

          return then ? [view, then(source)] : view;
        },
      })
  );
};
