import type { LC, PropsWithChildren } from '@use-gpu/live';

import React, { Gather, memo, useOne } from '@use-gpu/live';

import {
  Loop, Draw, Pass, Flat, Animate, LinearRGB,
  GeometryData, PBRMaterial, ImageTexture,
  OrbitCamera, OrbitControls,
  Pick, Cursor, FaceLayer,
  Lights, DirectionalLight, AmbientLight,
  Shared,

  makeBoxGeometry, makePlaneGeometry,
} from '@use-gpu/workbench';

import {
  Scene, Node, Mesh, Instances,
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
  const boxGeometry = useOne(() => makeBoxGeometry(2));
  const planeGeometry = useOne(() => makePlaneGeometry(100, 100, 'xz'));

  return (
    <Gather
      children={[
        <GeometryData geometry={boxGeometry} />,
        <GeometryData geometry={planeGeometry} />,
        <ImageTexture url="/textures/test.png" />,
      ]}
      then={([
        boxMesh,
        planeMesh,
        texture,
      ]) => (
        <LinearRGB>
          <Loop>
            <Draw>
              <Cursor cursor='move' />
              <Camera>
                <Pass>
                  <Shared />
                  <Lights>
                    <AmbientLight intensity={1} />
                    <DirectionalLight position={[-2.5, 3, 2, 1]} intensity={8} />

                    <Scene>

                      <Node position={[0, -4, 0]}>
                        <PBRMaterial albedo={0x808080} roughness={0.7}>
                          <Mesh
                            mesh={planeMesh}
                            shaded
                          />
                        </PBRMaterial>
                      </Node>

                      <PBRMaterial albedoMap={texture} roughness={0.5}>
                        <Instances
                          mesh={boxMesh}
                          shaded
                          render={(Instance) => (<>
                            <Instance position={[0, -3, 0]} />
                            <Instance position={[-3, -2, -2]} scale={[2, 2, 2]} />
                            <Instance position={[2, -3, 4]} rotation={[0, 30, 0]} />
                          </>)}
                        />
                      </PBRMaterial>
                  
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
    radius={9}
    bearing={-1.8}
    pitch={0.4}
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
