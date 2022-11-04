import type { LC, PropsWithChildren } from '@use-gpu/live';

import React, { Gather, memo, useOne } from '@use-gpu/live';

import {
  Loop, Draw, Pass, Flat, Animate, LinearRGB,
  GeometryData, PBRMaterial, ImageTexture,
  OrbitCamera, OrbitControls,
  Pick, Cursor,
  Lights, PointLight,
  
  makeBoxGeometry,
} from '@use-gpu/workbench';

import {
  Scene, Node, Mesh,
} from '@use-gpu/scene';

const COLOR_ON = [1, 1, 1, 1];
const COLOR_OFF = [0.5, 0.5, 0.5, 1.0];

const KEYFRAMES = [
  [ 0, [-3,  0, 0]],
  [10, [ 0, -3, 0]],
  [20, [ 3,  0, 0]],
  [30, [ 0,  3, 0]],
  [40, [-3,  0, 0]],
];

const PickableMesh = memo(({id, mesh, texture}) => {
  return (
    <Pick
      render={({id, hovered, presses}) =>
        <PBRMaterial albedoMap={texture} albedo={presses.left % 2 ? COLOR_ON : COLOR_OFF}>
          <Mesh
            id={id}
            mesh={mesh}
            shaded
          />
          {hovered ? <Cursor cursor='pointer' /> : null}
        </PBRMaterial>
      }
    />
  );
}, 'Mesh');

// This uses a typical scene-graph arrangement with an image texture
export const SceneBasicPage: LC = (props) => {
  const geometry = useOne(() => makeBoxGeometry(2));

  return (
    <Gather
      children={[
        <GeometryData geometry={geometry} />,
        <ImageTexture url="/textures/test.png" />,
      ]}
      then={([
        mesh,
        texture,
      ]) => (
        <LinearRGB>
          <Loop>
            <Draw>
              <Cursor cursor='move' />
              <Camera>
                <Pass>
                  <Lights>
                    <PointLight position={[-2.5, 3, 2, 1]} intensity={8} />

                    <Scene>

                      <Animate prop="position" keyframes={KEYFRAMES} loop>
                        <Node rotation={[30, - 30, -30]}>
                          <PickableMesh mesh={mesh} texture={texture} />
                        </Node>
                      </Animate>

                      <Animate prop="position" keyframes={KEYFRAMES} loop delay={-20}>
                        <Node rotation={[30, - 30, -30]}>
                          <PickableMesh mesh={mesh} texture={texture} />
                        </Node>
                      </Animate>

                    </Scene>

                  </Lights>
                </Pass>
              </Camera>
            </Draw>
          </Loop>
        </LinearRGB>
      )}
    />
  );
};

const Camera = ({children}: PropsWithChildren<object>) => (
  <OrbitControls
    radius={5}
    bearing={0.5}
    pitch={0.3}
    render={(radius: number, phi: number, theta: number, target: vec3) =>
      <OrbitCamera
        radius={radius}
        phi={phi}
        theta={theta}
        target={target}
      >
        {children}
      </OrbitCamera>
    }
  />
);
