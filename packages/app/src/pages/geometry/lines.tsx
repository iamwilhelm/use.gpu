import type { LC, PropsWithChildren } from '@use-gpu/live';
import type { DataField } from '@use-gpu/core';

import React, { use } from '@use-gpu/live';
import { vec3 } from 'gl-matrix';

import {
  Pass,
  Cursor,
  Data2, getLineSegments, getArrowSegments,
  OrbitCamera, OrbitControls,
  LineLayer, ArrowLayer,
} from '@use-gpu/workbench';

import { lineData, zigzagData, arrowData } from './line-data';

// Line data fields

const dataSchema = {
  // Use data[n].path as position
  positions: {format: 'array<vec3<f32>>', prop: 'path'},
  // Use data[n].color as color
  colors: {format: 'vec4<f32>', prop: 'color'},
  // Use data[n].width as color
  widths: {format: 'f32', prop: 'width'},
};

const isLoop  = (i: number) => lineData[i].loop;
const isStart = (i: number) => lineData[i].start;
const isEnd   = (i: number) => lineData[i].end;

export const GeometryLinesPage: LC = () => {

  return (
    <Camera>
      <Cursor cursor='move' />
      <Pass>
        <Data2
          schema={dataSchema}
          data={lineData}
          loop={isLoop}
          segments={getLineSegments}
          render={(props) =>
            <LineLayer {...props} depth={0.5} />
          }
        />

        {/*
        <Data2
          schema={dataSchema}
          data={zigzagData}
          segments={getLineSegments}
          render={(props) =>
            <LineLayer {...props} depth={0.5} join='round' />
          }
        />

        <Data2
          schema={dataSchema}
          data={arrowData}
          loop={isLoop}
          start={isStart}
          end={isEnd}
          segments={getArrowSegments}
          render={(props) =>
            <ArrowLayer
              {...props}
              depth={0.5}
            />
          }
        />
        */}
      </Pass>
    </Camera>
  );
};

const Camera = ({children}: PropsWithChildren<object>) => (
  <OrbitControls
    radius={3}
    bearing={0.5}
    pitch={0.3}
    render={(radius: number, phi: number, theta: number, target: vec3) =>
      <OrbitCamera
        radius={radius}
        phi={phi}
        theta={theta}
        target={target}
        scale={2160}
      >
        {children}
      </OrbitCamera>
    }
  />
);
