import type { LC, PropsWithChildren } from '@use-gpu/live';

import React, { use } from '@use-gpu/live';

import {
  Loop, Pass, FlatCamera, ArrayData, Data, RawData,
  PanControls,
  Pick, Cursor,
  Animate,
} from '@use-gpu/workbench';
import {
  Plot, Layer, Cartesian, Axis, Grid, Point, Line, Arrow, Face, Transform,
} from '@use-gpu/plot';
import { vec3 } from 'gl-matrix';

import { InfoBox } from '../../ui/info-box';

let t = 0;

const BACKGROUND = [0, 0, 0.09, 1];

const KEYFRAMES = [
  [ 0, 0],
  [10, 360],
] as Keyframe[];

export const Plot2DPage: LC = () => {

  return (<>
    <InfoBox>Draw 2D and 3D shapes using the plot API and animate their transforms like CSS.</InfoBox>
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

            <Point
              positions={[[50, 100], [50, 130], [50, 160], [50, 190], [50, 220]]}
              size={10}
              color={'#3090ff'}
            />

            <Point
              positions={[[50, 250], [50, 280]]}
              size={10}
              color={'#30ff90'}
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
              width={10}
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
                width={12}
                color={['#ffa040', '#7f40a0']}
                join="round"
              />
            </Transform>

            <Transform position={[10, 0]}>
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
            </Transform>

            <Transform position={[10, 400]}>
              <Line
                positions={[
                  [[550, 50], [500, 150], [600, 150]],
                  [[550, 250], [500, 350], [600, 350]],
                ]}
                width={10}
                color={['#a040ff', '#40a07f']}
                join="round"
                depth={1}
                loop
              />
            </Transform>

            <Transform position={[150, 650]} scale={1.2}>
              <Animate paused keyframes={KEYFRAMES} prop="rotation" ease="linear">
                <Transform rotation={30}>
                  <Line
                    positions={[
                      [[-50, -50], [50, -50], [50, 50], [-50, 50]],
                    ]}
                    width={10}
                    color={['#40a0ff']}
                    join="round"
                    depth={1}
                    loop
                  />
                </Transform>
              </Animate>
            </Transform>

            <Transform position={[150, 600]} scale={0.75}>
              <Animate paused keyframes={KEYFRAMES} speed={0.5} prop="rotation" ease="linear">
                <Transform rotation={30}>
                  <Line
                    positions={[
                      [[-50, -50], [50, -50], [50, 50], [-50, 50]],
                    ]}
                    width={10}
                    color={['#9f40a0']}
                    join="round"
                    depth={1}
                    loop
                  />
                </Transform>
              </Animate>
            </Transform>

            <Transform>
              <Arrow
                position={[[100, 200], [250, 300]]}
                width={10}
                color={"#3090ff"}
                end
                flat
              />
            </Transform>

            <Transform position={[100, 350]} rotation={-20}>
              <Arrow
                positions={[
                  [[-50, -50], [0, 0], [-50, 50], [0, 100]],
                  [[50, 50], [100, 100], [50, 150], [100, 200]],
                ]}
                width={10}
                color={"#40a030"}
                start={true}
                ends={[false, true]}
                depth={1}
              />
            </Transform>

            <Transform position={[620, 50]} scale={[0.8, 0.8]}>
              <Face
                position={[[0, 0], [50, 0], [100, 100], [50, 100]]}
                color={"#823456"}
              />

              <Face
                position={[[100, 0], [150, 0], [200, 100], [150, 100]]}
                color={"#823456"}
              />
            </Transform>

            <Transform position={[650, 200]} scale={[0.8, 0.8]}>
              <Face
                position={[[0, 0], [150, 0], [100, 50], [150, 100], [0, 100], [50, 50]]}
                color={"#823456"}
                concave
              />
              <Line
                position={[[0, 0], [150, 0], [100, 50], [150, 100], [0, 100], [50, 50]]}
                color={"#ffffff"}
                width={2}
                zIndex={2}
                loop
              />
              <Transform position={[0, 120]}>
                <Face
                  position={[[0, 0], [150, 0], [100, 50], [150, 100], [0, 100], [50, 50]]}
                  color={"#348256"}
                  concave
                />
                <Line
                  position={[[0, 0], [150, 0], [100, 50], [150, 100], [0, 100], [50, 50]]}
                  color={"#ffffff"}
                  width={2}
                  zIndex={2}
                  loop
                />
              </Transform>

              <Transform position={[0, 240]}>
                <Face
                  positions={[[
                    [[0, 0], [150, 0], [150, 150], [0, 150]],
                    [[75, 45], [105, 75], [75, 105], [45, 75]],
                  ]]}
                  color={"#348256"}
                  concave
                />
                <Line
                  positions={[
                    [[0, 0], [150, 0], [150, 150], [0, 150]],
                    [[75, 45], [105, 75], [75, 105], [45, 75]],
                  ]}
                  color={"#ffffff"}
                  width={2}
                  zIndex={2}
                  loop
                />
              </Transform>
            </Transform>

            <Transform position={[0, 240]}>
              <Line
                position={[0, 0], [100, 0]}
                width={10}
                color={'#ffffff'}
              />
            </Transform>

            <Cartesian
              range={[[0, 100], [0, 100]]}
              position={[400, 400, 0]}
              scale={[400, 400, 1]}
            >


              <Axis
                origin={[100, 100]}
                axis='x'
                width={5}
                color="#a0a0a0"
                end
              />

              <Axis
                origin={[100, 100]}
                axis='y'
                width={5}
                color="#a0a0a0"
                end
              />
            </Cartesian>

          </Plot>
        </Pass>
      </Camera>
    </Loop>
  </>);
}

const Camera = ({children}: PropsWithChildren<object>) => (
  <PanControls
    active={true}
    render={(x, y, zoom) =>
      <FlatCamera x={x} y={y} zoom={zoom}>
        {children}
      </FlatCamera>
    }
  />
);
