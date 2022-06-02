import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { TextureSource } from '@use-gpu/core/types';
import { ShaderModule } from '@use-gpu/shader/types';

import { use, useOne } from '@use-gpu/live';
import { Draw } from './draw';
import { Pass } from './pass';
import { RenderToTexture, RenderToTextureProps } from './render-to-texture';
import { RawFullScreen } from '../primitives';

type LinearRGBProps = Omit<RenderToTextureProps, "format" | "colorSpace">;

export const LinearRGB: LiveComponent<LinearRGBProps> = (props: LinearRGBProps) => ( 
  use(RenderToTexture, {
    ...props,
    format: "rgba16float",
    colorSpace: 'linear',
    then: (texture: TextureSource) => 
      useOne(() =>
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
      )
  })
);

