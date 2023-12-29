import type { LC, PropsWithChildren } from '@use-gpu/live';
import type { DataSchema, Emit, Time } from '@use-gpu/core';

import React, { use } from '@use-gpu/live';
import { seq } from '@use-gpu/core';
import { vec3 } from 'gl-matrix';

import {
  Loop, Pass,
  Data, RawData, getLineSegments,
  OrbitCamera, OrbitControls, FPSControls,
  Cursor, PointLayer, LineLayer,
} from '@use-gpu/workbench';

// Line data fields

const basicLineSchema = {
  positions: {format: 'array<vec3<f32>>'},
  segments: {format: 'array<i8>'},
} as DataSchema;

const segmentedLineSchema = {
  positions: {format: 'array<vec3<f32>>', prop: 'path'},
  colors: {format: 'vec3<f32>', prop: 'color'},
  widths: {format: 'f32', prop: 'width'},
  zBiases: {format: 'f32', prop: 'zBias'},
} as DataSchema;

// Generate a line voxel grid

// Take random +/- X/Y/Z steps
const vecSteps = [
  vec3.fromValues(1, 0, 0),
  vec3.fromValues(-1, 0, 0),
  vec3.fromValues(0, 1, 0),
  vec3.fromValues(0, -1, 0),
  vec3.fromValues(0, 0, 1),
  vec3.fromValues(0, 0, -1),
];

const lineData = seq(20).map((i) => ({
  path: seq(30).reduce((arr, i) => {
    let last = arr[arr.length - 1] ?? vec3.create();
    let dir = Math.floor(Math.random() * 6);
    let next = vec3.clone(vecSteps[dir]);
    vec3.add(next, next, last as any);
    arr.push([next[0], next[1], next[2]]);
    return arr;
  }, [] as number[][]),
  color: [Math.random()*Math.random(), Math.random(), Math.random()],
  width: Math.random() * 20 + 1,
  zBias: i / 100,
  loop: false,
}));

export const GeometryDataPage: LC = () => {

  return (
    <Loop>
      <Cursor cursor='move' />

      <Camera>
        <Pass>

          <Data
            // Drive LineLayer directly
            schema={basicLineSchema}
            data={{
              positions: [-5, -2.5, 0, 5, -2.5, 0, 0, -2.5, -5, 0, -2.5, 5],
              segments: [1, 2, 1, 2], // 1 = start, 2 = end, 3 = middle
            }}
          >{
            (props) => <LineLayer {...props} width={5} depth={1} color={[0.125, 0.25, 0.5, 1]} />
          }</Data>

          <Data
            // OR Generate line segment data automatically
            schema={segmentedLineSchema}
            data={lineData}
            segments={getLineSegments}
          >{
            (props) => <LineLayer {...props} join='round' depth={0.9} />
          }</Data>

          {/*
          <RawData
            format='vec3<f32>'
            length={100}
            live
            time
            expr={(emit: Emit, i: number, time: Time) => {
              const s = ((i*i + i) % 13133.371) % 1000;
              const t = time.elapsed / 2000;
              emit(
                Math.cos(t * 1.31 + Math.sin((t + s) * 0.31) + s) * 2,
                Math.sin(t * 1.113 + Math.sin((t - s) * 0.414) - s) * 2,
                Math.cos(t * 0.981 + Math.cos((t + s*s) * 0.515) + s*s) * 2,
              );
            }}
          >{
            (positions) =>
              <PointLayer
                positions={positions}
                colors={positions}
                shape='diamond'
                hollow
                size={50}
                depth={1}
                mode={'transparent'}
              />
            }
          </RawData>
          */}
        </Pass>
      </Camera>
    </Loop>
  );
};

const Camera = ({children}: PropsWithChildren<object>) => (
  <FPSControls
    position={[0.5, 0.5, 3.5]}
    bearing={0.1}
    pitch={0.1}
    moveSpeed={8}
    render={(phi: number, theta: number, target: vec3) =>
      <OrbitCamera
        radius={0}
        phi={phi}
        theta={theta}
        target={target}
        scale={1080}
      >
        {children}
      </OrbitCamera>
    }
  />
);
