import type { LC, PropsWithChildren } from '@use-gpu/live';
import type { DataSchema } from '@use-gpu/core';

import React, { use } from '@use-gpu/live';
import { seq } from '@use-gpu/core';

import { PickingOverlay } from '../../ui/picking-overlay';

import {
  Pass, Cursor, Pick, FlatCamera,
  Data, getFaceSegments, getFaceSegmentsConcave,
  OrbitCamera, OrbitControls,
  FaceLayer,
} from '@use-gpu/workbench';

// Convex and concave polygon data

const convexDataSchema: DataSchema = {
  positions: {format: 'array<vec3<f32>>'},
  color: {format: 'vec3<f32>'},
};

const concaveDataSchema: DataSchema = {
  positions: {format: 'array<vec3<f32>>'},
  color: {format: 'vec3<f32>'},
  lookup: {format: 'u32'},
};

// Generate some random polygons

const randomColor = () => [Math.random(), Math.random(), Math.random()];
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
  };
});

const concaveFaceData = seq(20).map(i => {
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

export const GeometryFacesPage: LC = () => {

  // Render polygons
  const view = (<>
    <Camera>
      <Pass picking>

        <Data
          schema={convexDataSchema}
          data={convexFaceData}
          segments={getFaceSegments}
        >{
          (sources) =>
            <Pick
              onMouseOver={(mouse, index) => console.log('round', {mouse, index})}
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
                  >{
                    (positions, colors, segments) =>
                      <FaceLayer
                        positions={positions}
                        segments={segments}
                        color={[1, 1, 1, 1]}
                        side="both"
                        zBias={1}
                      />
                  }</Data>
                ) : null
              ]
            }</Pick>
        }</Data>

        <Data
          schema={concaveDataSchema}
          data={concaveFaceData}
          segments={getFaceSegmentsConcave}
        >{
          (sources) =>
            <Pick
              onMouseOver={(mouse, index) => console.log('spiky', {mouse, index})}
            >{
              ({id, hovered, index}) => [
                hovered ? <Cursor cursor='default' /> : null,
                <FaceLayer
                  id={id}
                  {...sources}
                  side="both"
                />,
                hovered ? (
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
                    }
                  }</Data>
                ) : null
              ]
            }</Pick>
        }</Data>

      </Pass>
    </Camera>

    <FlatCamera>
      <Pass overlay>
        <PickingOverlay />
      </Pass>
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
    render={(radius: number, phi: number, theta: number) =>
      <OrbitCamera
        radius={radius}
        phi={phi}
        theta={theta}
      >
        {children}
      </OrbitCamera>
    }
  />
);
