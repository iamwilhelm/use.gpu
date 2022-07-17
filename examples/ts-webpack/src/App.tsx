import React, { LC } from '@use-gpu/live';

import { HTML } from '@use-gpu/react';
import { AutoCanvas, WebGPU } from '@use-gpu/webgpu';
import { PanControls, Flat, Draw, Pass } from '@use-gpu/workbench';
import { UI, Layout, Flex, Inline, Text } from '@use-gpu/layout';

import { makeFallback } from './fallback';

const FONTS = [
  {
    family: 'Lato',
    weight: 400,
    style: 'normal',
    src: '/Lato-Black.ttf',
  },
];

export const App: LC = () => {
  
  const root = document.querySelector('#use-gpu')!;
  const inner = document.querySelector('#use-gpu .canvas')!;
  
  return (
    <WebGPU
      fallback={(error: Error) => <HTML container={inner}>{makeFallback(error)}</HTML>}
    >
      <AutoCanvas
        selector={'#use-gpu .canvas'}
        samples={4}
      >
        <FontLoader fonts={FONTS}>
      
          <PanControls
            render={(x, y, zoom) =>
              <Flat x={x} y={y} zoom={zoom}>

                <Draw>
                  <Pass>
                    <UI>

                      <Layout>
                        <Flex width="100%" height="100%" align="center">
                          <Flex width="300" height="150" fill="#3090ff">
                            <Inline><Text weight="black" size={72} color="#ffffff">-*~&lt; Use.GPU &gt;~*-</Text></Inline>
                          </Flex>
                        </Flex>
                      </Layout>

                    </UI>            
                  </Pass>
                </Draw>

              </Flat>
            }
          />

        </FontLoader>      
      </AutoCanvas>
    </WebGPU>
  );
};
