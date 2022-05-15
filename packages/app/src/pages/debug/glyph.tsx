import { LC } from '@use-gpu/live/types';
import { CanvasRenderingContextGPU } from '@use-gpu/webgpu/types';
import { Rectangle, DataField, Emitter, StorageSource, ViewUniforms, UniformAttribute, RenderPassMode } from '@use-gpu/core/types';

import { makeRawTexture } from '@use-gpu/core';
import { glyphToRGBA, glyphToSDF } from '@use-gpu/text';
import React from '@use-gpu/live/jsx';

import {
  LinearRGB, Draw, Pass, Flat, UI, Layout, Block, Flex, Embed, RawTexture,
  Embedded, Axis, Scale, Tick, Point, Arrow, Sampled,
  PanControls, PanCamera,
  useDeviceContext, useFontContext,
} from '@use-gpu/components';

export const DebugGlyphPage: LC = () => {

  const device = useDeviceContext();
  const rustText = useFontContext();

  const glyphMetrics = rustText.measureGlyph(0, 54, 128);

  const {width, height, image} = glyphMetrics;
  const size = [width, height];

  const radius = 10;
  const w = width + radius * 2;
  const h = height + radius * 2;

  const rgbaTexture = {
    data: glyphToRGBA(image, width, height).data,
    format: "rgba8unorm",
    size,
  };

  const sdfTexture = {
    data: glyphToSDF(image, width, height, radius, radius).data,
    format: "rgba8unorm",
    size: [w, h],
  };

  const view = (
    <Draw>
      <Pass>
        <UI>
          <Layout>
          
            <Flex align={"center"} height={'100%'}>
              <RawTexture data={rgbaTexture} render={(texture) => 
                <Block margin={radius} width={width} height={height} fill={[0.0, 0.0, 0.0, 1.0]} image={{
                  texture,
                  repeat: 'none',
                }}>
                  <Embed width="100%" height="100%" render={(layout: Rectangle) =>
                    <Embedded layout={layout}>
                      <Axis axis="x" width={5} color={0x808080} end={false} />
                      <Axis axis="y" width={5} color={0x808080} end={false} />

                      <Scale axis="x" unit={1} divide={w}>
                        <Tick size={10} width={2.5} color={0xc0c0c0} depth={0} />
                      </Scale>
                      <Scale axis="y" unit={1} divide={h}>
                        <Tick size={10} width={2.5} color={0xc0c0c0} depth={0} offset={[1, 0, 0]} />
                      </Scale>

                      <Sampled
                        axes='xy'
                        format='vec4<f32>'
                        size={[width, height]}
                        items={1}
                        centered={true}
                        expr={(emit, x, y) => {
                          emit(x, y, 0.5, 1);
                        }}              
                      >
                        <Point size={3} depth={0.15} />
                      </Sampled>

                      <Sampled
                        axes='xy'
                        format='vec4<f32>'
                        size={[width, height]}
                        items={2}
                        centered={true}
                        expr={(emit, x, y) => {
                          emit(x, y, 0.5, 1);
                          emit(x + 1, y, 0.5, 1);
                        }}              
                      >
                        <Arrow width={3} color={0xffffff} />
                      </Sampled>
                    </Embedded>
                  } />
                </Block>
              } />

              <RawTexture data={sdfTexture} render={(texture) => 
                <Block width={w} height={h} fill={[0.0, 0.0, 0.0, 1.0]} image={{
                  texture,
                  repeat: 'none',
                }}>
                  <Embed width="100%" height="100%" render={(layout: Rectangle) =>
                    <Embedded layout={layout}>
                      <Axis axis="x" width={5} color={0x808080} end={true} />
                      <Axis axis="y" width={5} color={0x808080} end={true} />

                      <Scale axis="x" unit={1} divide={w}>
                        <Tick size={10} width={2.5} color={0x808080} depth={0} />
                      </Scale>
                      <Scale axis="y" unit={1} divide={h}>
                        <Tick size={10} width={2.5} color={0x808080} depth={0} offset={[1, 0, 0]} />
                      </Scale>

                      <Sampled
                        axes='xy'
                        format='vec4<f32>'
                        size={[w, h]}
                        items={1}
                        centered={true}
                        expr={(emit, x, y) => {
                          emit(x, y, 0.5, 1);
                        }}              
                      >
                        <Point size={3} depth={0.15} />
                      </Sampled>

                      <Sampled
                        axes='xy'
                        format='vec4<f32>'
                        size={[w, h]}
                        items={2}
                        centered={true}
                        expr={(emit, x, y) => {
                          emit(x, y, 0.5, 1);
                          emit(x + 1, y, 0.5, 1);
                        }}              
                      >
                        <Arrow width={3} color={0xffffff} />
                      </Sampled>
                    </Embedded>
                  } />
                  
                </Block>
              } />
            </Flex>
          </Layout>
        </UI>
      </Pass>
    </Draw>
  );

  const root = document.querySelector('#use-gpu');

  return (
    <PanControls
      active={true}
      render={(x, y, zoom) =>
        <Flat x={x} y={y} zoom={zoom} focus={1/3}>
          {view}
        </Flat>
      }
    />
  );
};
