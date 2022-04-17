import { LiveComponent } from '@use-gpu/live/types';

import { gather, use, yeet, resume, useMemo, useOne, useResource, useState } from '@use-gpu/live';

import {
  Draw, Pass,
  Flat, UI, Layout, Absolute, Inline, Text,
  DebugAtlas, RawTexture,
} from '@use-gpu/components';

export type AtlasPageProps = {
  _unused?: boolean,
};

export const AtlasPage: LiveComponent<AtlasPageProps> = (props) => {

  return (
    use(Draw, {
      children:

        use(Pass, {
          children:

            use(Flat, {
              children:

                use(UI, {
                  children:
                  
                    gather(
                      use(Layout, {
                        children:
                          use(Absolute, {
                            left: 0,
                            bottom: 0,
                            right: 0,
                            height: 400,
                            children: [

                              use(Inline, {
                                align: 'justify',
                                children: [
                
                                  use(Text, { size: 60, snap: false, content: "A simple and efficient method", weight: "bold", color: [0.5, 0.5, 0.5, 1] }),
                                                  
                                  use(Text, { size: 60, snap: false, content: " is presented which allows improved rendering of glyphs composed of curved and linear elements. A distance field is generated from a high resolution image, and then stored into a channel of a lower-resolution texture.\n\nIn the simplest case, this texture can then be rendered simply by using the alpha-testing and alpha-thresholding feature of modern GPUs, without a custom shader. This allows the technique to be used on even the lowest-end 3D graphics hardware.", color: [0.5, 0.5, 0.5, 1] }),
                
                                ],
                              }),

                            ],
                          }),
                      }),
                      (layout: any) => [
                        yeet(layout),
                        use(DebugAtlas, {}),
                      ],
                    ),
                }),
            }),
        }),
    })

  );
};
