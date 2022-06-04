import { LC, PropsWithChildren } from '@use-gpu/live/types';
import { CanvasRenderingContextGPU } from '@use-gpu/webgpu/types';
import { Rectangle, DataField, Emitter, StorageSource, ViewUniforms, UniformAttribute, RenderPassMode } from '@use-gpu/core/types';

import React from '@use-gpu/live/jsx';
import { memo, fragment } from '@use-gpu/live';
import { makeRawTexture } from '@use-gpu/core';
import { glyphToRGBA, glyphToSDF, sdfToGradient, makeSDFStage, paintSubpixelOffsets } from '@use-gpu/text';
import { Image } from '@use-gpu/text/types';
import { GlyphControls } from '../../ui/glyph-controls';
import { vec3 } from 'gl-matrix';

import {
  LinearRGB, Draw, Pass, Flat, UI, Layout, Block, Inline, Text, Flex, Embed, RawTexture,
  Embedded, Axis, Grid, Scale, Tick, Point, Arrow, Sampled,
  PanControls,
  useDeviceContext, useFontContext, DebugProvider,
  OrbitCamera, OrbitControls,
} from '@use-gpu/components';

const SIZE = 64;
const DETAIL = 64;

export const DebugGlyphPage: LC = () => {

  const root = document.querySelector('#use-gpu');

  return (
    <GlyphControls
      container={root}
      hasGlyph
      hasContours
      hasRelax
      has3D
      render={({subpixel, contours, preprocess, postprocess, glyph, orbit}) =>       
        orbit
        ? [
          <OrbitControls
            radius={1000}
            moveSpeed={1/1000}
            bearing={0.3}
            pitch={0.5}
            render={(radius: number, phi: number, theta: number, target: vec3) =>
              <OrbitCamera
                radius={radius}
                phi={phi}
                theta={theta}
                target={target}
                near={0.1}
                far={5000}
              >
                <GlyphView subpixel={subpixel} contours={contours} preprocess={preprocess} postprocess={postprocess} glyph={glyph} />
              </OrbitCamera>
            }
          />,
        ] : [
          <PanControls
            key="glyph"
            active={true}
            zoom={2}
            render={(x, y, zoom) =>
              <Flat x={x} y={y} zoom={zoom} focus={1/3}>
                <GlyphView subpixel={subpixel} contours={contours} preprocess={preprocess} postprocess={postprocess} glyph={glyph} />
              </Flat>
            }
          />
        ]
      }
    />
  );
};

type GlyphViewProps = {
  subpixel: boolean,
  preprocess: boolean,
  postprocess: boolean,
  contours: boolean,
  glyph: string,
};

type DebugImage = {
  xs: Float32Array,
  ys: Float32Array,
  width: number,
  height: number,
};

const roundUp2 = (v: number) => {
  v--;
  v |= v >> 1;
  v |= v >> 2;
  v |= v >> 4;
  v |= v >> 8;
  v |= v >> 16;
  v++;
  return v;
};

const GlyphView = memo(({subpixel, preprocess, postprocess, contours, glyph}: GlyphViewProps) => {
  const device = useDeviceContext();
  const rustText = useFontContext();

  const glyphId = rustText.findGlyph(0, glyph ?? '@');
  const glyphMetrics = rustText.measureGlyph(0, glyphId ?? 5, DETAIL * 1.5);

  const {width, height, image} = glyphMetrics;

  const radius = 10;
  const paddedWidth = width + radius * 2;
  const paddedHeight = height + radius * 2;
  const padded = [paddedWidth, paddedHeight] as [number, number];

  const rgbaData = glyphToRGBA(image, width, height, radius).data;

  const debugs: Image[] = [];
  const pushDebug = (image: Image) => debugs.push(image);

  const sdfData = glyphToSDF(image, width, height, radius, radius, undefined, subpixel, preprocess, postprocess, pushDebug).data;
  const gradientData = sdfToGradient(sdfData, width, height, radius, radius).data;

  const rgbaTexture = {
    data: rgbaData,
    format: "rgba8unorm" as GPUTextureFormat,
    colorSpace: 'srgb',
    size: padded,
  };

  const sdfTexture = {
    data: sdfData,
    format: "rgba8unorm" as GPUTextureFormat,
    colorSpace: 'srgb',
    size: padded,
  };

  const gradientTexture = {
    data: gradientData,
    format: "rgba8unorm" as GPUTextureFormat,
    colorSpace: 'srgb',
    size: padded,
  };

  const s = Math.max(paddedWidth, paddedHeight);
  const sdf1 = makeSDFStage(s);
  const sdf2 = makeSDFStage(s);
  paintSubpixelOffsets(sdf1, image, width, height, radius, preprocess, true);
  paintSubpixelOffsets(sdf2, image, width, height, radius, preprocess, false);

  const {xo, yo, xi, yi} = sdf1;
  const {xo: xo2, yo: yo2, xi: xi2, yi: yi2} = sdf2;
  
  const outerField = {
    xs: xo,
    ys: yo,
    width: paddedWidth,
    height: paddedHeight,
  };

  const innerField = {
    xs: xi,
    ys: yi,
    width: paddedWidth,
    height: paddedHeight,
  };

  const outer2Field = {
    xs: xo2,
    ys: yo2,
    width: paddedWidth,
    height: paddedHeight,
  };

  const inner2Field = {
    xs: xi2,
    ys: yi2,
    width: paddedWidth,
    height: paddedHeight,
  };

  const gridEmitter = ({xs, ys, width, height}: DebugImage) =>
    (emit: Emitter, x: number, y: number, i: number, j: number) => {
      const index = i + j * paddedWidth;
      const dx = xs[index];
      const dy = ys[index];
      if (dx || dy) emit(x, y, 0, 1);
    };

  const pointEmitter = ({xs, ys, width, height}: DebugImage) =>
    (emit: Emitter, x: number, y: number, i: number, j: number) => {
      const index = i + j * paddedWidth;
      const dx = xs[index];
      const dy = ys[index];
      emit(x + dx, y + dy, 0, 1);
    };

  const shiftedPointEmitter = ({xs, ys, width, height}: DebugImage) =>
    (emit: Emitter, x: number, y: number, i: number, j: number) => {
      const index = i + j * paddedWidth;
      const dx = xs[index];
      const dy = ys[index];
      if (dx || dy) {
        emit(x + dx, y + dy, 0, 1);
      }
    };

  const arrowEmitter = ({xs, ys, width, height}: DebugImage) =>
    (emit: Emitter, x: number, y: number, i: number, j: number) => {
      const index = i + j * paddedWidth;
      const dx = xs[index];
      const dy = ys[index];

      if (dx || dy) {
        emit(x, y, 0, 1);
        emit(x + dx, y + dy, 0, 1);
      }
    };
  
  const debugFrame = (image: Image) => (
    image ? <TextureFrame texture={{
      data: image.data,
      format: "rgba8unorm",
      colorSpace: 'srgb',
      size: [image.width, image.height],
    }}>

      { image.xi && image.yi ? <Sampled
        axes='xy'
        format='vec4<f32>'
        size={padded}
        items={2}
        sparse
        centered
        expr={arrowEmitter({
          xs: image.xi,
          ys: image.yi,
          width: image.width,
          height: image.height,
        })}
      >
        <Arrow width={2} color={0x4080ff} depth={0.01} detail={4} zBias={100000} />
      </Sampled> : null}

      { image.xo && image.yo ? <Sampled
        axes='xy'
        format='vec4<f32>'
        size={padded}
        items={2}
        sparse
        centered
        expr={arrowEmitter({
          xs: image.xo,
          ys: image.yo,
          width: image.width,
          height: image.height,
        })}
      >
        <Arrow width={2} color={0x40c0ff} depth={0.01} detail={4} zBias={1} />
      </Sampled> : null}
    </TextureFrame> : null
  );
  
  return (
    <DebugProvider debug={{sdf2d: {subpixel, contours, preprocess, postprocess}}}>
      <LinearRGB>
        <Pass>
          <UI>
            <Layout>
              <Flex direction="y" anchor={"center"} align={"center"} height={'100%'}>

                <Block margin={20}>
                  <Inline align={"center"}>
                    <Text
                      size={32}
                      detail={64}
                      snap={false}
                      text={subpixel ? "The Subpixel Distance Transform" : "The Euclidean Distance Transform"}
                      color={[1, 1, 1, 1]}
                    />
                  </Inline>
                </Block>

                <Flex align={"center"} gap={10}>
                  <Block>
                    <TextureFrame texture={rgbaTexture}>
                    {subpixel ? <>
                      <Sampled
                        axes='xy'
                        format='vec4<f32>'
                        size={padded}
                        items={1}
                        sparse
                        centered
                        expr={gridEmitter(outerField)}
                      >
                        <Point size={0.5} depth={1} color={'#808080'} shape={'circleOutlined'} zBias={1} />
                      </Sampled>

                      <Sampled
                        axes='xy'
                        format='vec4<f32>'
                        size={padded}
                        items={1}
                        sparse
                        centered
                        expr={pointEmitter(outerField)}
                      >
                        <Point size={0.5} depth={1} color={preprocess ? '#80808080' : '#808080'} shape={'circle'} zBias={1} />
                      </Sampled>

                      {preprocess ? <Sampled
                        axes='xy'
                        format='vec4<f32>'
                        size={padded}
                        items={1}
                        sparse
                        centered
                        expr={pointEmitter(innerField)}
                      >
                        <Point size={0.5} depth={1} color={'#808080'} shape={'circle'} zBias={1} />
                      </Sampled> : null}

                      <Sampled
                        axes='xy'
                        format='vec4<f32>'
                        size={padded}
                        items={2}
                        sparse
                        centered
                        expr={arrowEmitter(preprocess ? innerField : outerField)}
                      >
                        <Arrow width={3} depth={0.05} color={0x40c0ff} detail={4} zBias={1} />
                      </Sampled>
                      </> : null}
                    </TextureFrame>

                    <TextureFrame texture={rgbaTexture}>
                    {subpixel ? <>
                      <Sampled
                        axes='xy'
                        format='vec4<f32>'
                        size={padded}
                        items={1}
                        sparse
                        centered
                        expr={shiftedPointEmitter(outer2Field)}
                      >
                        <Point size={0.5} depth={1} color={0x4080ff} zBias={1} />
                      </Sampled>

                      <Sampled
                        axes='xy'
                        format='vec4<f32>'
                        size={padded}
                        items={1}
                        sparse
                        centered
                        expr={shiftedPointEmitter(inner2Field)}
                      >
                        <Point size={0.5} depth={1} color={0x40c0ff} zBias={1} />
                      </Sampled>

                      <Sampled
                        axes='xy'
                        format='vec4<f32>'
                        size={padded}
                        items={2}
                        sparse
                        centered
                        expr={arrowEmitter(outer2Field)}
                      >
                        <Arrow width={3} depth={0.05} color={0x4080ff} detail={4} zBias={1} />
                      </Sampled>

                      <Sampled
                        axes='xy'
                        format='vec4<f32>'
                        size={padded}
                        items={2}
                        sparse
                        centered
                        expr={arrowEmitter(inner2Field)}
                      >
                        <Arrow width={3} depth={0.05} color={0x40c0ff} detail={4} zBias={1} />
                      </Sampled>
                      </> : null}
                    </TextureFrame>
                    
                    <Label>RGBA{subpixel ? ' + Offsets' + (preprocess ? ' (Relaxed)' : '') : ''}</Label>
                  </Block>

                  { debugs.length ? <>
                    <Block>
                      {debugFrame(debugs[0])}
                      <Label>Inside/Outside</Label>
                    </Block>
                    <Block>
                      {debugFrame(debugs[1])}
                      {debugFrame(debugs[2])}
                      <Label>{subpixel ? "ESDT Outside" : "EDT Outside"}</Label>
                    </Block>                
                    <Block>
                      {debugFrame(debugs[3])}
                      {debugFrame(debugs[4])}
                      <Label>{subpixel ? "ESDT Inside" : "EDT Inside"}</Label>
                    </Block>                
                    <Block>
                      {debugFrame(debugs[5])}
                      <Label>{subpixel ? "X and Y Offsets" + (postprocess ? '\n(Relaxed)' : '') : "Squared Distance"}</Label>
                    </Block>                
                  </> : null}

                  <RawTexture data={sdfTexture} render={(texture) =>
                    <Block>
                      <Block width={paddedWidth} height={paddedHeight} fill={[0.0, 0.0, 0.0, 1.0]} image={{
                        texture,
                        repeat: 'none',
                      }} />
                      <Label>SDF</Label>
                    </Block>
                  }/>
                  <Block>
                    <TextureFrame texture={gradientTexture} />
                    <Label>Gradient Error</Label>
                  </Block>

                  <Block margin={[10, 5]}>
                    <Inline>
                      <Text
                        size={SIZE}
                        detail={DETAIL}
                        lineHeight={height}
                        snap={false}
                        text={glyph}
                        color={[1, 1, 1, 1]}
                      />
                    </Inline>
                  </Block>
                </Flex>
              </Flex>
            </Layout>
          </UI>
        </Pass>
      </LinearRGB>
    </DebugProvider>
  );
}, 'View');

type TextureFrameProps = {
  texture: any,
  margin?: number,
}

const TextureFrame: LC<TextureFrameProps> = (props: PropsWithChildren<TextureFrameProps>) => {
  const {margin, texture, children} = props;
  const {size: [width, height]} = texture;
  
  return (
    <RawTexture data={texture} render={(texture) =>
      <Block margin={margin} width={width} height={height} fill={[0.0, 0.0, 0.0, 1.0]} image={{
        texture,
        fit: 'contain',
        repeat: 'none',
      }}>
        <Embed width="100%" height="100%">
          <Embedded>
            <Axis axis="x" width={5} color={0x808080} end={false} />
            <Axis axis="y" width={5} color={0x808080} end={false} />
            <Grid axes="xy" width={2} color={0xcccccc} first={{divide: width / 10}} second={{divide: height / 10}} zBias={0} />

            <Scale axis="x" unit={1} divide={width}>
              <Tick size={10} width={2.5} color={0xc0c0c0} depth={0} />
            </Scale>
            <Scale axis="y" unit={1} divide={height}>
              <Tick size={10} width={2.5} color={0xc0c0c0} depth={0} offset={[1, 0, 0]} />
            </Scale>
            {children}
          </Embedded>
        </Embed>
      </Block>
    }/>
  );
}

type LabelProps = {
  children: string | string[],
}

const Label: LC<LabelProps> = (props: PropsWithChildren<LabelProps>) => (
  <Block margin={[0, 3, 0, 0]}>
    <Inline align={"center"}>
      <Text
        size={10}
        snap={false}
        text={Array.isArray(props.children) ? props.children.join('') : props.children}
        color={[1, 1, 1, 0.75]}
      />
    </Inline>
  </Block>
);
