import { LC } from '@use-gpu/live/types';
import { CanvasRenderingContextGPU } from '@use-gpu/webgpu/types';
import { Rectangle, DataField, Emitter, StorageSource, ViewUniforms, UniformAttribute, RenderPassMode } from '@use-gpu/core/types';

import React from '@use-gpu/live/jsx';
import { memo } from '@use-gpu/live';
import { makeRawTexture } from '@use-gpu/core';
import { glyphToRGBA, glyphToSDF, sdfToGradient, makeSDFStage, paintSubpixelOffsets } from '@use-gpu/text';
import { GlyphControls } from '../../ui/glyph-controls';

import {
  LinearRGB, Draw, Pass, Flat, UI, Layout, Block, Flex, Embed, RawTexture,
  Embedded, Axis, Grid, Scale, Tick, Point, Arrow, Sampled,
  PanControls, PanCamera,
  useDeviceContext, useFontContext,
} from '@use-gpu/components';

export const DebugGlyphPage: LC = () => {

  const root = document.querySelector('#use-gpu');

  return (
    <GlyphControls
      render={(subpixel) =>
        <PanControls
          active={true}
          zoom={1}
          render={(x, y, zoom) =>
            <Flat x={x} y={y} zoom={zoom} focus={1/3}>
              <GlyphView subpixel={subpixel} />
            </Flat>
          }
        />
    } />
  );
};

const GlyphView = memo(({subpixel}: {subpixel: boolean}) => {
  const device = useDeviceContext();
  const rustText = useFontContext();

  const glyphMetrics = rustText.measureGlyph(0, 54, 128);

  const {width, height, image} = glyphMetrics;
  const size = [width, height];

  const radius = 10;
  const paddedWidth = width + radius * 2;
  const paddedHeight = height + radius * 2;
  const padded = [paddedWidth, paddedHeight];

  const rgbaData = glyphToRGBA(image, width, height).data;
  const sdfData = glyphToSDF(image, width, height, radius, radius, subpixel).data;
  const gradientData = sdfToGradient(sdfData, width, height, radius, radius).data;

  const rgbaTexture = {
    data: rgbaData,
    format: "rgba8unorm",
    size,
  };

  const sdfTexture = {
    data: sdfData,
    format: "rgba8unorm",
    size: padded,
  };

  const gradientTexture = {
    data: gradientData,
    format: "rgba8unorm",
    size: padded,
  };

  const s = Math.max(paddedWidth, paddedHeight);
  const sdf = makeSDFStage(s);
  paintSubpixelOffsets(sdf, image, width, height, radius);
  
  const {xo, yo, xi, yi} = sdf;
  
  return (
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
                      <Grid axis="xy" width={2} color={0xcccccc} first={{divide: width / 10}} second={{divide: height / 10}} />

                      <Scale axis="x" unit={1} divide={width}>
                        <Tick size={10} width={2.5} color={0xc0c0c0} depth={0} />
                      </Scale>
                      <Scale axis="y" unit={1} divide={height}>
                        <Tick size={10} width={2.5} color={0xc0c0c0} depth={0} offset={[1, 0, 0]} />
                      </Scale>

                      <Sampled
                        axes='xy'
                        format='vec4<f32>'
                        size={[width, height]}
                        items={1}
                        sparse
                        centered
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
                        sparse
                        centered
                        expr={(emit, x, y) => {
                          const i = Math.floor(x + radius) + Math.floor(y + radius) * paddedWidth;
                          const dx = xo[i];
                          const dy = yo[i];
                        
                          if (dx) {
                            emit(x, y, 0.5, 1);
                            emit(x + dx, y, 0.5, 1);
                          }
                        }}              
                      >
                        <Arrow width={3} color={0xffffff} />
                      </Sampled>

                      <Sampled
                        axes='xy'
                        format='vec4<f32>'
                        size={[width, height]}
                        items={2}
                        sparse
                        centered
                        expr={(emit, x, y) => {
                          const i = Math.floor(x + radius) + Math.floor(y + radius) * paddedWidth;
                          const dx = xi[i];
                          const dy = yi[i];
                        
                          if (dy) {
                            emit(x, y, 0.5, 1);
                            emit(x, y + dy, 0.5, 1);
                          }
                        }}              
                      >
                        <Arrow width={3} color={0xffffff} />
                      </Sampled>
                    </Embedded>
                  } />
                </Block>
              } />

              <RawTexture data={sdfTexture} render={(texture) => 
                <Block width={paddedWidth} height={paddedHeight} fill={[0.0, 0.0, 0.0, 1.0]} image={{
                  texture,
                  repeat: 'none',
                }}>
                  <Embed width="100%" height="100%" render={(layout: Rectangle) =>
                    <Embedded layout={layout}>
                      <Axis axis="x" width={5} color={0x808080} end={true} />
                      <Axis axis="y" width={5} color={0x808080} end={true} />
                      <Grid axis="xy" width={2} color={0xcccccc} first={{divide: paddedWidth / 10}} second={{divide: paddedHeight / 10}} />

                      <Scale axis="x" unit={1} divide={paddedWidth}>
                        <Tick size={10} width={2.5} color={0x808080} depth={0} />
                      </Scale>
                      <Scale axis="y" unit={1} divide={paddedHeight}>
                        <Tick size={10} width={2.5} color={0x808080} depth={0} offset={[1, 0, 0]} />
                      </Scale>

                      <Sampled
                        axes='xy'
                        format='vec4<f32>'
                        size={padded}
                        items={1}
                        sparse
                        centered
                        expr={(emit, x, y) => {
                          const i = Math.floor(x) + Math.floor(y) * paddedWidth;
                          const dx = xo[i];
                          const dy = yo[i];

                          if (dx) emit(x + dx, y, 0.5, 1);
                        }}              
                      >
                        <Point size={3} depth={0.15} color={0x3090FF} />
                      </Sampled>

                      <Sampled
                        axes='xy'
                        format='vec4<f32>'
                        size={padded}
                        items={1}
                        sparse
                        centered
                        expr={(emit, x, y) => {
                          const i = Math.floor(x) + Math.floor(y) * paddedWidth;
                          const dx = xo[i];
                          const dy = yo[i];

                          if (dy) emit(x, y + dy, 0.5, 1);
                        }}              
                      >
                        <Point size={3} depth={0.15} color={0x3090FF} />
                      </Sampled>

                      <Sampled
                        axes='xy'
                        format='vec4<f32>'
                        size={padded}
                        items={1}
                        sparse
                        centered
                        expr={(emit, x, y) => {
                          const i = Math.floor(x) + Math.floor(y) * paddedWidth;
                          const dx = xi[i];
                          const dy = yi[i];

                          if (dx) emit(x + dx, y, 0.5, 1);
                        }}              
                      >
                        <Point size={3} depth={0.15} color={0xFF9030} />
                      </Sampled>

                      <Sampled
                        axes='xy'
                        format='vec4<f32>'
                        size={padded}
                        items={1}
                        sparse
                        centered
                        expr={(emit, x, y) => {
                          const i = Math.floor(x) + Math.floor(y) * paddedWidth;
                          const dx = xi[i];
                          const dy = yi[i];

                          if (dy) emit(x, y + dy, 0.5, 1);
                        }}              
                      >
                        <Point size={3} depth={0.15} color={0xFF9030} />
                      </Sampled>

                      <Sampled
                        axes='xy'
                        format='vec4<f32>'
                        size={padded}
                        items={2}
                        sparse
                        centered
                        expr={(emit, x, y) => {
                          const i = Math.floor(x) + Math.floor(y) * paddedWidth;
                          const dx = xo[i];
                          const dy = yo[i];
                        
                          if (dx) {
                            emit(x, y, 0.5, 1);
                            emit(x + dx, y, 0.5, 1);
                          }
                        }}              
                      >
                        <Arrow width={3} color={0xffffff} />
                      </Sampled>

                      <Sampled
                        axes='xy'
                        format='vec4<f32>'
                        size={padded}
                        items={2}
                        sparse
                        centered
                        expr={(emit, x, y) => {
                          const i = Math.floor(x) + Math.floor(y) * paddedWidth;
                          const dx = xo[i];
                          const dy = yo[i];
                        
                          if (dy) {
                            emit(x, y, 0.5, 1);
                            emit(x, y + dy, 0.5, 1);
                          }
                        }}              
                      >
                        <Arrow width={3} color={0xffffff} />
                      </Sampled>

                      <Sampled
                        axes='xy'
                        format='vec4<f32>'
                        size={padded}
                        items={2}
                        sparse
                        centered
                        expr={(emit, x, y) => {
                          const i = Math.floor(x) + Math.floor(y) * paddedWidth;
                          const dx = xi[i];
                          const dy = yi[i];
                        
                          if (dx) {
                            emit(x, y, 0.5, 1);
                            emit(x + dx, y, 0.5, 1);
                          }
                        }}              
                      >
                        <Arrow width={3} color={0xffffff} />
                      </Sampled>

                      <Sampled
                        axes='xy'
                        format='vec4<f32>'
                        size={padded}
                        items={2}
                        sparse
                        centered
                        expr={(emit, x, y) => {
                          const i = Math.floor(x) + Math.floor(y) * paddedWidth;
                          const dx = xi[i];
                          const dy = yi[i];
                        
                          if (dy) {
                            emit(x, y, 0.5, 1);
                            emit(x, y + dy, 0.5, 1);
                          }
                        }}              
                      >
                        <Arrow width={3} color={0xffffff} />
                      </Sampled>
                    </Embedded>
                  } />
                
                </Block>
              } />


              <RawTexture data={gradientTexture} render={(texture) => 
                <Block width={paddedWidth} height={paddedHeight} fill={[0.0, 0.0, 0.0, 1.0]} image={{
                  texture,
                  repeat: 'none',
                }}>
                  <Embed width="100%" height="100%" render={(layout: Rectangle) =>
                    <Embedded layout={layout}>
                      <Axis axis="x" width={5} color={0x808080} end={true} />
                      <Axis axis="y" width={5} color={0x808080} end={true} />

                      <Scale axis="x" unit={1} divide={paddedWidth}>
                        <Tick size={10} width={2.5} color={0x808080} depth={0} />
                      </Scale>
                      <Scale axis="y" unit={1} divide={paddedHeight}>
                        <Tick size={10} width={2.5} color={0x808080} depth={0} offset={[1, 0, 0]} />
                      </Scale>
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
}, 'View');