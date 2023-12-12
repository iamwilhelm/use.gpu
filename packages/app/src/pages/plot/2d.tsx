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

            <Transform position={[50, 100]} rotation={[0, 0, 90]}>
              <Point
                positions={[[0, 0], [10, 0], [20, 0], [30, 0], [40, 0]]}
                size={10}
                color={'#3090ff'}
              />
            </Transform>

            <Point
              position={[50, 50]}
              size={20}
              color={'#ffffff'}
            />

            <Line
              position={[[100, 50], [150, 150]]}
              width={5}
              color={'#c00040'}
            />

            <Line
              position={[[150, 50], [200, 150], [250, 50]]}
              width={5}
              color={'#c04000'}
            />

            <Line
              positions={[
                [[300, 50], [350, 150], [400, 50], [450, 150]],
                [[300, 150], [350, 250], [400, 150], [450, 250]],
              ]}
              width={5}
              color={'#40c000'}
            />

            <Line
              positions={[
                [[300, 250], [350, 350], [400, 250], [450, 350]],
                [[300, 350], [350, 450], [400, 350], [450, 450]],
              ]}
              width={10}
              color={['#ffa040', '#7f40a0']}
              join="miter"
            />

            <Transform position={[0, 400]}>
              <Line
                positions={[
                  [[300, 50], [350, 150], [400, 50], [450, 150]],
                  [[300, 150], [350, 250], [400, 150], [450, 250]],
                ]}
                width={10}
                color={['#ffa040', '#7f40a0']}
                join="miter"
                depth={1}
              />
            </Transform>

            <Line
              positions={[
                [[550, 50], [500, 150], [600, 150]],
                [[550, 250], [500, 350], [600, 350]],
              ]}
              width={10}
              color={['#40a0ff', '#a0407f']}
              join="round"
              loop
            />

            <Transform position={[0, 400]}>
              <Line
                positions={[
                  [[550, 50], [500, 150], [600, 150]],
                  [[550, 250], [500, 350], [600, 350]],
                ]}
                width={10}
                depth={1}
                color={['#a040ff', '#40a07f']}
                join="round"
                loop
              />
            </Transform>

            <Cartesian
              range={[[0, 100], [0, 100]]}
              position={[300, 500, 1]}
              scale={[200, 100, 1]}
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
