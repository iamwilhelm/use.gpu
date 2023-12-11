import type { LC, PropsWithChildren } from '@use-gpu/live';

import React, { use } from '@use-gpu/live';

import {
  Loop, Pass, Flat,
  ArrayData, Data, RawData,
  PanControls,
  Pick, Cursor,
  Animate,
} from '@use-gpu/workbench';
import {
  Plot, Cartesian, Axis, Grid, Point, Line, Transform,
} from '@use-gpu/plot';
import { vec3 } from 'gl-matrix';

let t = 0;

const BACKGROUND = [0, 0, 0.09, 1];

export const Plot2DPage: LC = () => {
  
  return (
    <Loop>
      <Cursor cursor="move" />
      <Camera>
        <Pass>
          <Plot>

            <Point
              position={[50, 50]}
              size={20}
              color={'#ffffff'}
            />

            <Transform position={[50, 100]} rotation={[0, 0, 90]}>
              <Point
                positions={[[0, 0], [10, 0], [20, 0], [30, 0], [40, 0]]}
                size={10}
                color={'#3090ff'}
              />
            </Transform>
            
            {/*
            <Line
              position={[[50, 150], [150, 150]]}
              width={5}
              color={'#c00040'}
            />

            <Cartesian
              scale={[2, 1, 1]}
            >
              <Grid
                axes='xy'
                width={2}
                first={{ detail: 3, divide: 5 }}
                second={{ detail: 3, divide: 5 }}
                depth={0.5}
                zBias={-1}
                auto
              />

              <Axis
                axis='x'
                width={5}
                color="#a0a0a0"
              />

              <Axis
                axis='y'
                width={5}
                color="#a0a0a0"
              />
            </Cartesian>
            */}
          </Plot>
        </Pass>
      </Camera>
    </Loop>
  );
}

const Camera = ({children}: PropsWithChildren<object>) => (
  <PanControls
    active={true}
    render={(x, y, zoom) =>
      <Flat x={x} y={y} zoom={zoom}>
        {children}
      </Flat>
    }
  />
);
