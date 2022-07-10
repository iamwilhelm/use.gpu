import React from '@use-gpu/live/jsx';
import { LC } from '@use-gpu/live/types';

import { HTML } from '@use-gpu/react';
import { AutoCanvas, WebGPU } from '@use-gpu/webgpu';
import { PanControls, Flat, Draw, Pass } from '@use-gpu/workbench';
import { UI, Layout, Flex, Inline, Text } from '@use-gpu/layout';

import { makeFallback } from './fallback';

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
      
        <PanControls
          render={(x, y, zoom) =>
            <Flat x={x} y={y} zoom={zoom}>

              <Draw>
                <Pass>
                  <UI>

                    <Layout>
                      <Flex width="100%" height="100%" align="center">
                        <Flex width="300" height="150" fill="#3090ff">
                          <Inline><Text size={72} color="#ffffff">-*~{ Use.GPU }~*-</Text></Inline>
                        </Flex>
                      </Flex>
                    </Layout>

                  </UI>            
                </Pass>
              </Draw>

            </Flat>
          }
        />
      
      </AutoCanvas>
    </WebGPU>
  );
};
