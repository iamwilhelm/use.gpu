import { LC } from '@use-gpu/live/types';
import { CanvasRenderingContextGPU } from '@use-gpu/webgpu/types';
import { DataField, Emitter, StorageSource, ViewUniforms, UniformAttribute, RenderPassMode } from '@use-gpu/core/types';

import { wgsl, bindModule, bundleToAttributes } from '@use-gpu/shader/wgsl';
import React from '@use-gpu/live/jsx';
import { use, useContext } from '@use-gpu/live';

import earcut from 'earcut';

import {
  Draw, Pass,
  Cursor, Pick, Raw,
  CompositeData, FaceSegments, FaceLayer,
  OrbitCamera, OrbitControls,
  LineLayer, ArrowLayer,
  Flat, UI, Layout, Absolute, Block, Inline, Text,
  PickingContext,
  useBoundSource, useDerivedSource,
} from '@use-gpu/components';

// Convex and concave polygon data

const convexDataFields = [
  ['array<vec4<f32>>', (o: any) => o.positions],
  ['vec4<f32>', 'color'],
] as DataField[];

const concaveDataFields = [
  ['array<vec4<f32>>', (o: any) => o.positions],
  ['vec4<f32>', 'color'],
  ['array<u32>', (o: any) => o.indices, true],
  ['u32', 'lookup'],
] as DataField[];

// Generate some random polygons

const seq = (n: number, s: number = 0, d: number = 1) => Array.from({ length: n }).map((_, i: number) => s + d * i);

const randomColor = () => [Math.random(), Math.random(), Math.random(), 1];
const randomInt = (min: number, max: number) => min + Math.round(Math.random() * (max - min));
const randomFloat = (min: number, max: number) => min + Math.random() * (max - min);

const circleX = (a: number, r: number) => Math.cos(a * Math.PI * 2) * r;
const circleY = (a: number, r: number) => Math.sin(a * Math.PI * 2) * r;

const N = 32;

let convexFaceData = seq(20).map(i => {
  const n = Math.max(3, randomInt(5, 16) - randomInt(0, 5));
  const r = randomFloat(0.15, 0.5);
  const o = [randomFloat(-2, 2), randomFloat(-1, 1), randomFloat(-2, -0.5)];
  return {
    positions: seq(n).map(j => [
      o[0] + circleX(j / n, r) * circleX(i / 20, 1),
      o[1] + circleY(j / n, r),
      o[2] + circleX(j / n, r) * circleY(i / 20, 1),
      1,
    ]),
    color: randomColor(),
  };
});

let concaveFaceData = seq(20).map(i => {
  const n = Math.max(3, randomInt(5, 24) - randomInt(0, 5));
  const r = randomFloat(0.15, 0.5);
  const o = [randomFloat(-2, 2), randomFloat(-1, 1), randomFloat(0.5, 2)];

  const positions = seq(n).map(j => {
    const spikes = randomInt(3, 10);
    const modulate = (1 + circleX(j / n * spikes, 1) * .5);
    return [
      o[0] + circleX(j / n, r * modulate) * circleX(i / 20, 1),
      o[1] + circleY(j / n, r * modulate),
      o[2] + circleX(j / n, r * modulate) * circleY(i / 20, 1),
    1,
    ];
  });

  const flatPos3D = positions.flatMap(p => p.slice(0, 3));
  const indices = earcut(flatPos3D, [], 3);

  return {
    positions,
    indices,
    color: randomColor(),
    lookup: i,
  };
});

export const GeometryFacesPage: LC = () => {

  // Display picking buffer for funsies
  const scale = 0.5;
  const {pickingSource} = useContext(PickingContext);
  const colorizeShader = wgsl`
    @link fn getSize() -> vec2<f32> {}
    @link fn getPicking(uv: vec2<i32>, level: i32) -> vec4<u32> {}
    @export fn main(uv: vec2<f32>) -> vec4<f32> {
      let iuv = vec2<i32>(uv * getSize() / ${scale});
      let pick = vec2<f32>(getPicking(iuv, 0).xy);
      return vec4<f32>(
        (pick.r / 16.0) % 1.0,
        (pick.g / 16.0) % 1.0,
        (pick.r + pick.g) / 256.0,
        1.0,
      );
    }
  `;
  const [GET_SIZE, GET_PICKING] = bundleToAttributes(colorizeShader);
  const getSize = useBoundSource(GET_SIZE, () => pickingSource.size);
  const getPicking = useBoundSource(GET_PICKING, pickingSource);
  const textureSource = useDerivedSource(bindModule(colorizeShader, {getPicking, getSize}), pickingSource);
  const pickingView = (
    <Flat>
      <UI>
        <Layout>
          <Absolute
            right={0}
          >
            <Block fill={[0, 0, 0, .5]}>
              <Block
                width={textureSource.size[0] * scale}
                height={textureSource.size[1] * scale}
                image={{texture: textureSource}}
                fill={[0, 0, 0, 1]}
              />
              <Inline align="center" margin={[0, 5]}><Text color={[1, 1, 1, 1]} size={24}>GPU Picking Buffer</Text></Inline>
            </Block>
          </Absolute>
        </Layout>
      </UI>
    </Flat>
  );
  
  // Render polygons
  const view = (
    <Draw>
      <Pass>
        <CompositeData
          fields={convexDataFields}
          data={convexFaceData}
          on={<FaceSegments />}
          render={(positions, colors, segments, lookups) =>
            <Pick
              onMouseOver={(mouse, index) => console.log('round', {mouse, index})}
              render={({id, hovered, index}) => [
                hovered ? <Cursor cursor='default' /> : null,
                <FaceLayer
                  id={id}
                  positions={positions}
                  segments={segments}
                  colors={colors}
                  lookups={lookups}
                />,
                hovered ? (
                  <CompositeData
                    fields={convexDataFields}
                    data={convexFaceData.slice(index, index + 1)}
                    on={<FaceSegments />}
                    render={(positions, colors, segments) =>
                      <FaceLayer
                        positions={positions}
                        segments={segments}
                        color={[1, 1, 1, 1]}
                      />
                    }
                  />
                ) : null
              ]}
            />
          }
        />

        <CompositeData
          fields={concaveDataFields}
          data={concaveFaceData}
          render={(positions, colors, indices, lookups) =>
            <Pick
              onMouseOver={(mouse, index) => console.log('spiky', {mouse, index})}
              render={({id, hovered, index}) => [
                hovered ? <Cursor cursor='default' /> : null,
                <FaceLayer
                  id={id}
                  positions={positions}
                  indices={indices}
                  colors={colors}
                  lookups={lookups}
                />,
                hovered ? (
                  <CompositeData
                    fields={concaveDataFields}
                    data={concaveFaceData.slice(index, index + 1)}
                    render={(positions, colors, indices) =>
                      <FaceLayer
                        positions={positions}
                        indices={indices}
                        color={[1, 1, 1, 1]}
                      />
                    }
                  />
                ) : null
              ]}
            />
          }
        />

        {pickingView}
      </Pass>
    </Draw>
  );

  return [
    <Cursor cursor='move' />,
    <OrbitControls
      radius={3}
      bearing={0.5}
      pitch={0.3}
      render={(radius: number, phi: number, theta: number) =>
        <OrbitCamera
          radius={radius}
          phi={phi}
          theta={theta}
        >
          {view}
        </OrbitCamera>
      }
    />,
  ];
};
