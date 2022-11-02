import type { LC } from '@use-gpu/live';

import React, { Gather, memo, useOne } from '@use-gpu/live';

import {
  Loop, Draw, Pass, Flat, Animate,
  GeometryData, PBRMaterial, ImageTexture,
  OrbitCamera, OrbitControls,
  Pick, Cursor, FaceLayer,
  Lights, PointLight,

  makeBoxGeometry,
} from '@use-gpu/workbench';

import {
  Scene, Node, Instances,
} from '@use-gpu/scene';

const COLOR_ON = [1, 1, 1, 1];
const COLOR_OFF = [0.5, 0.5, 0.5, 1.0];

const POSITION_KEYFRAMES = [
  [ 0, [-3,  0, 0]],
  [10, [ 0, -3, 0]],
  [20, [ 3,  0, 0]],
  [30, [ 0,  3, 0]],
  [40, [-3,  0, 0]],
];

const ROTATION_KEYFRAMES = [
  [ 0, [0,   0, 0]],
  [ 6, [0, 360, 0]],
  [ 8, [0, 360, 0]],
  [ 8, [0,   0, 0]],
  [14, [360, 0, 0]],
  [16, [360, 0, 0]],
];

const seq = (n: number, s: number = 0, d: number = 1): number[] => Array.from({ length: n }).map((_, i: number) => s + d * i);

export const SceneShadowPage: LC = (props) => {
  const geometry = useOne(() => makeBoxGeometry());

  const view = (
    <Gather
      children={[
        <GeometryData geometry={geometry} />,
        <ImageTexture url="/textures/test.png" />,
      ]}
      then={([
        mesh,
        texture,
      ]) => (
        <Loop>
          <Draw>
            <Cursor cursor='move' />
            <Pass>
              <Lights>
                <PointLight position={[-2.5, 3, 2, 1]} intensity={8} />

                <Scene>
                  <PBRMaterial
                    albedoMap={texture}
                  >
                    <Instances
                      mesh={mesh}
                      shaded
                      render={(Instance) => (<>

                        <Animate prop="rotation" keyframes={ROTATION_KEYFRAMES} loop ease="cosine">
                          <Node>
                            {seq(20).map(i => (
                              <Animate prop="position" keyframes={POSITION_KEYFRAMES} loop delay={-i * 2} ease="linear">
                                <Instance
                                  rotation={[Math.random()*360, Math.random()*360, Math.random()*360]}
                                  scale={[0.2, 0.2, 0.2]}
                                />
                              </Animate>
                            ))}
                          </Node>
                        </Animate>

                      </>)}
                    />
                  </PBRMaterial>
                  
                </Scene>
              </Lights>
            </Pass>
          </Draw>
        </Loop>
      )}
    />
  );

  return (
    <OrbitControls
      radius={5}
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
    />
  );
};
