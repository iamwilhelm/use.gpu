import type { LC, PropsWithChildren } from '@use-gpu/live';
import type { DataField } from '@use-gpu/core';

import React, { use } from '@use-gpu/live';
import { vec3 } from 'gl-matrix';

import {
  Pass,
  Cursor,
  CompositeData, LineSegments, ArrowSegments,
  OrbitCamera, OrbitControls,
  LineLayer, ArrowLayer,
} from '@use-gpu/workbench';

import { lineData, zigzagData, arrowData } from './line-data';

// Line data fields

const dataSchema = {
  positions: {
    format: 'vec3<f32>',
    // Path is an array
    composite: true,
    // Accessor function
    accessor: (o: any) => o.path,
  },
  colors: {
    format: 'vec4<f32>',
    // String accessor
    accessor: 'color',
  },
  widths: {
    format: 'f32',
    accessor: 'width',
  },
};

const isLoop = (o: any) => o.loop;
const isStart = (o: any) => o.start;
const isEnd = (o: any) => o.end;

export const GeometryLinesPage: LC = () => {

  return (
    <Camera>
      <Cursor cursor='move' />
      <Pass>
        <CompositeData
          schema={dataSchema}
          data={lineData}
          loop={isLoop}
          on={<LineSegments />}
          render={(props) =>
            <LineLayer {...props} depth={0.5} />
          }
        />

        <CompositeData
          schema={dataSchema}
          data={zigzagData}
          on={<LineSegments />}
          render={(props) =>
            <LineLayer {...props} depth={0.5} join='round' />
          }
        />

        <CompositeData
          schema={dataSchema}
          data={arrowData}
          loop={isLoop}
          start={isStart}
          end={isEnd}
          on={<ArrowSegments />}
          render={(props) =>
            <ArrowLayer
              positions={positions}
              colors={colors}
              widths={widths}
              segments={segments}
              anchors={anchors}
              trims={trims}
              depth={0.5}
            />
          }
        />
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
