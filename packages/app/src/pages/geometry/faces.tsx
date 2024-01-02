import type { LC, PropsWithChildren } from '@use-gpu/live';
import type { DataSchema } from '@use-gpu/core';

import React, { use } from '@use-gpu/live';
import { seq, lerp } from '@use-gpu/core';

import { PickingOverlay } from '../../ui/picking-overlay';

import {
  Pass, Cursor, Pick, FlatCamera,
  Data, getFaceSegments, getFaceSegmentsConcave,
  OrbitCamera, OrbitControls,
  FaceLayer,
} from '@use-gpu/workbench';

import { InfoBox } from '../../ui/info-box';

// Convex and concave polygon data

const convexDataSchema: DataSchema = {
  positions: {format: 'array<vec3<f32>>'},
  colors: {format: 'vec3<f32>', prop: 'color'},
  lookups: {format: 'u32', prop: 'lookup'},
};

const concaveDataSchema: DataSchema = {
  positions: {format: 'array<vec3<f32>>'},
  colors: {format: 'vec3<f32>', prop: 'color'},
  lookups: {format: 'u32', prop: 'lookup'},
};

// Generate some random polygons

const randomColor = () => [Math.random(), Math.random(), Math.random()*Math.random()];
const randomInt = (min: number, max: number) => min + Math.round(Math.random() * (max - min));
const randomFloat = (min: number, max: number) => min + Math.random() * (max - min);

const circleX = (a: number, r: number) => Math.cos(a * Math.PI * 2) * r;
const circleY = (a: number, r: number) => Math.sin(a * Math.PI * 2) * r;

const N = 32;

const convexFaceData = seq(20).map(i => {
  const n = Math.max(3, randomInt(5, 16) - randomInt(0, 5));
  const r = randomFloat(0.15, 0.5);
  const o = [randomFloat(-2, 2), randomFloat(-1, 1), randomFloat(-2, -0.5)];
  return {
    positions: seq(n).map(j => [
      o[0] + circleX(j / n, r) * circleX(i / 20, 1),
      o[1] + circleY(j / n, r),
      o[2] + circleX(j / n, r) * circleY(i / 20, 1),
    ]),
    color: randomColor(),
    lookup: i,
  };
});

const concaveFaceData2 = seq(20).map(i => {
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
    ];
  });

  return {
    positions,
    color: randomColor(),
    lookup: i,
  };
});

const n = 24;
const r = .25;
const o = [0, 0, 0];
const concaveFaceData = [{
  positions: seq(n).map(j => {
    const m1 = 1 + 1.5 * ((j*1.316) % 2);
    const m2 = circleX(j / n * 12, 1) * .5 + 1;
    const modulate = lerp(m1, m2, .8);
    return [
      o[0] + circleX(j / n, r * modulate),
      o[1] + circleY(j / n, r * modulate),
      o[2],
    ];
  }),
  color: [0.5, 0.75, 1],
  lookup: 0,
}];

export const GeometryFacesPage: LC = () => {

  // Render polygons using FaceLayer directly.
  const view = (<>
    <InfoBox>Use &lt;Data&gt; for convex segmentation and concave triangulation with &lt;FaceLayer&gt;. Uses &lt;Pick&gt; for mouse picking.</InfoBox>
    <Camera>
      <Pass picking>

        <Data
          schema={convexDataSchema}
          data={convexFaceData}
          segments={getFaceSegments}
        >{
          (sources) =>
            <Pick
              onMouseOver={(mouse, index) => console.log('Round shape', {mouse, index})}
            >{
              ({id, hovered, index}) => [
                hovered ? <Cursor cursor='default' /> : null,
                <FaceLayer
                  id={id}
                  side="both"
                  {...sources}
                />,
                hovered ? (
                  <Data
                    schema={convexDataSchema}
                    data={convexFaceData}
                    segments={getFaceSegments}
                    count={1}
                    skip={index}
                  >{
                    ({positions, segments}) =>
                      <FaceLayer
                        {...{positions, segments}}
                        color={[1, 1, 1, 1]}
                        side="both"
                        zBias={1}
                      />
                  }</Data>
                ) : null
              ], () => {}
            }</Pick>
        }</Data>

        <Data
          schema={concaveDataSchema}
          data={concaveFaceData}
          segments={getFaceSegmentsConcave}
        >{
          (sources) =>
            <Pick
              onMouseOver={(mouse, index) => console.log('Spiky shape', {mouse, index})}
            >{
              ({id, hovered, index}) => [
                hovered ? <Cursor cursor='default' /> : null,
                <FaceLayer
                  id={id}
                  {...sources}
                  side="both"
                />,
                hovered && false ? (
                  <Data
                    schema={concaveDataSchema}
                    data={concaveFaceData}
                    segments={getFaceSegmentsConcave}
                    count={1}
                    skip={index}
                  >{
                    ({positions, indices}) =>
                      <FaceLayer
                        {...{positions, indices}}
                        color={[1, 1, 1, 1]}
                        side="both"
                        zBias={1}
                      />
                  }</Data>
                ) : null
              ]
            }</Pick>
        }</Data>

      </Pass>
    </Camera>

    <FlatCamera>{/*
      <Pass overlay>
        <PickingOverlay />
      </Pass>
    */}
    </FlatCamera>
  </>);

  return [
    <Cursor cursor='move' />,
    view,
  ];
};

const Camera = ({children}: PropsWithChildren<object>) => (
  <OrbitControls
    radius={3}
    bearing={0.5}
    pitch={0.3}
  >{
    (radius: number, phi: number, theta: number, target: vec3) =>
      <OrbitCamera
        radius={radius}
        phi={phi}
        theta={theta}
        target={target}
      >
        {children}
      </OrbitCamera>
  }</OrbitControls>
);
