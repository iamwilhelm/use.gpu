import React, { LC, hot, useFiber } from '@use-gpu/live';

import { HTML } from '@use-gpu/react';
import { TextureSource } from '@use-gpu/core';
import { AutoCanvas, WebGPU } from '@use-gpu/webgpu';
import { DebugProvider, FontLoader, PanControls, Flat, Pass } from '@use-gpu/workbench';
import { UI, Layout, Flex, Block, Inline, Text } from '@use-gpu/layout';

import { UseInspect } from '@use-gpu/inspect';
import { inspectGPU } from '@use-gpu/inspect-gpu';
import '@use-gpu/inspect/theme.css';

import { makeFallback } from './Fallback';

const FONTS = [
  {
    family: 'Lato',
    weight: 'black',
    style: 'normal',
    src: '/Lato-Black.ttf',
  },
];

export const App: LC = hot(() => {

  const root = document.querySelector('#use-gpu')!;
  const inner = document.querySelector('#use-gpu .canvas')!;

  // This is for the UseInspect inspector only
  const fiber = useFiber();

  return (
    <UseInspect fiber={fiber} provider={DebugProvider} extensions={[inspectGPU]}>

      {/* WebGPU Canvas with a font */}
      <WebGPU
        fallback={(error: Error) => <HTML container={inner}>{makeFallback(error)}</HTML>}
      >
        <AutoCanvas
          selector={'#use-gpu .canvas'}
          samples={4}
        >
          <FontLoader fonts={FONTS}>

            {/* 2D pan controls + view */}
            <PanControls
              render={(x, y, zoom) =>
                <Flat x={x} y={y} zoom={zoom}>

                  {/* Render pass */}
                  <Pass>

                    {/* 2D Layout */}
                    <UI>
                      <Layout>

                        {/* Flex box */}
                        <Flex width="100%" height="100%" align="center">
                          <Flex width={500} height={150} fill="#3090ff" align="center" direction="y">
                            <Inline align="center">
                              <Text weight="black" size={48} lineHeight={64} color="#ffffff">-~ Use.GPU ~-</Text>
                            </Inline>
                            <Inline align="center">
                              <Text weight="black" size={16} lineHeight={64} color="#ffffff" opacity={0.5}>Zoom Me</Text>
                            </Inline>

                            <ImageTexture
                              url="/test.png"
                              colorSpace="srgb"
                            >{(texture: TextureSource | null) =>
                                <Flex align="center" width="100%" height={150}>
                                  <Block
                                    fill="#3090ff" 
                                    width={150}
                                    height={150}
                                    margin={20}
                                    texture={texture}
                                    image={{fit: 'scale'}}
                                  />
                                </Flex>
                            }</ImageTexture>

                          </Flex>
                        </Flex>

                      </Layout>
                    </UI>

                  </Pass>

                </Flat>
              }
            />

          </FontLoader>
        </AutoCanvas>
      </WebGPU>

    </UseInspect>
  );
}, module);

App.displayName = 'App';
