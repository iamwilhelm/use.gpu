import { LC, PropsWithChildren } from '@use-gpu/live/types';
import { CanvasRenderingContextGPU } from '@use-gpu/webgpu/types';
import { Rectangle, DataField, Emitter, StorageSource, ViewUniforms, UniformAttribute, RenderPassMode } from '@use-gpu/core/types';

import React from '@use-gpu/live/jsx';
import { memo } from '@use-gpu/live';
import { makeRawTexture } from '@use-gpu/core';
import { glyphToRGBA, glyphToSDF, sdfToGradient, makeSDFStage, paintSubpixelOffsets } from '@use-gpu/text';
import { GlyphControls } from '../../ui/glyph-controls';

import {
  LinearRGB, Draw, Pass, Flat, UI, Layout, Block, Inline, Text, Flex, Embed, RawTexture,
  Embedded, Axis, Grid, Scale, Tick, Point, Arrow, Sampled,
  PanControls, PanCamera,
  useDeviceContext, useFontContext, DebugProvider,
} from '@use-gpu/components';

export const DebugGlyphPage: LC = () => {

  const root = document.querySelector('#use-gpu');

  return (
    <GlyphControls
      hasGlyph
      hasContours
      render={({subpixel, contours, glyph}) =>
        <PanControls
          key="glyph"
          active={true}
          zoom={8}
          render={(x, y, zoom) =>
            <Flat x={x} y={y} zoom={zoom} focus={1/3}>
              <GlyphView subpixel={subpixel} contours={contours} glyph={glyph} />
            </Flat>
          }
        />
    } />
  );
};

type GlyphViewProps = {
  subpixel: boolean,
  contours: boolean,
  glyph: string,
};

const GlyphView = memo(({subpixel, contours, glyph}) => {
  const device = useDeviceContext();
  const rustText = useFontContext();

  const SIZE = 60;

  const glyphId = rustText.findGlyph(0, glyph ?? '@');
  const glyphMetrics = rustText.measureGlyph(0, glyphId ?? 5, SIZE);

  const {width, height, image} = glyphMetrics;
  const size = [width, height];

  const radius = 10;
  const paddedWidth = width + radius * 2;
  const paddedHeight = height + radius * 2;
  const padded = [paddedWidth, paddedHeight];

  const rgbaData = glyphToRGBA(image, width, height).data;

  const sdfDataX = glyphToSDF(image, width, height, radius, radius, subpixel, 0.25, 1).data;
  const sdfDataY = glyphToSDF(image, width, height, radius, radius, subpixel, 0.25, 2).data;
  const sdfData  = glyphToSDF(image, width, height, radius, radius, subpixel, undefined, undefined).data;

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

  const sdfTextureX = {
    data: sdfDataX,
    format: "rgba8unorm",
    size: padded,
  };

  const sdfTextureY = {
    data: sdfDataY,
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
    <DebugProvider debug={{sdf2d: {subpixel, contours}}}>
    <Draw>
      <Pass>
        <UI>
          <Layout>
        
            <Flex align={"center"} height={'100%'}>
              <TextureFrame margin={radius} texture={rgbaTexture}>
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
                  <Point size={0.5} depth={1} />
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
                  
                    if (dx || dy) {
                      emit(x, y, 0.5, 1);
                      emit(x + dx, y + dy, 0.5, 1);
                    }
                  }}              
                >
                  <Arrow width={3} color={0xff6090} />
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
                  
                    if (dx || dy) {
                      emit(x, y, 0.5, 1);
                      emit(x + dx, y + dy, 0.5, 1);
                    }
                  }}              
                >
                  <Arrow width={3} color={0x60d0ff} />
                </Sampled>
              </TextureFrame>

              <TextureFrame texture={sdfTextureX} />
              <TextureFrame texture={sdfTextureY} />

              <RawTexture data={sdfTexture} render={(texture) => 
                <Block width={paddedWidth} height={paddedHeight} fill={[0.0, 0.0, 0.0, 1.0]} image={{
                  texture,
                  repeat: 'none',
                }} />
              }/>

              <TextureFrame texture={sdfTexture}>
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

                    if (dx || dy) emit(x + dx, y + dy, 0.5, 1);
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

                    if (dx || dy) emit(x + dx, y + dy, 0.5, 1);
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
              </TextureFrame>

              <TextureFrame texture={gradientTexture} />
              
              <Block width={100} margin={radius}>
                <Inline>
                  <Text
                    size={SIZE}
                    lineHeight={height * 0.8}
                    snap={false}
                    text={glyph}
                    color={[1, 1, 1, 1]}
                  />
                </Inline>
              </Block>
            </Flex>
          </Layout>
        </UI>
      </Pass>
    </Draw>
    </DebugProvider>
  );
}, 'View');

type TextureFrameProps = {
  texture: any,
  width: number,
  height: number,
  margin: number,
}

const TextureFrame: LC<TextureFrameProps> = (props: PropsWithChildren<TextureFrameProps>) => {
  const {margin, texture, children} = props;
  const {size: [width, height]} = texture;

  return (
    <RawTexture data={texture} render={(texture) => 
      <Block margin={margin} width={width} height={height} fill={[0.0, 0.0, 0.0, 1.0]} image={{
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
            {children}
          </Embedded>
        } />
      </Block>
    }/>
  );
}
