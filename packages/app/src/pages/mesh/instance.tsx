import type { LC } from '@use-gpu/live';

import React, { Gather, memo } from '@use-gpu/live';

import {
  Loop, Draw, Pass, Flat, Animate,
  InterleavedData, PBRMaterial, ImageTexture,
  OrbitCamera, OrbitControls,
  Pick, Cursor, FaceLayer,
  Scene, Node, Instances,
  Lights, PointLight,
} from '@use-gpu/workbench';

import { meshVertexArray, makeTexture } from '../../meshes/cube';

const MESH_FIELDS = [
  ['vec4<f32>', 'position'],
  ['vec4<f32>', 'normal'],
  ['vec4<f32>', 'color'],
  ['vec2<f32>', 'uv'],
];

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

const Mesh = memo(({mesh, texture}) => {
  return (
    <Pick
      render={({id, hovered, presses}) =>
        <PBRMaterial albedoMap={texture} albedo={presses.left % 2 ? COLOR_ON : COLOR_OFF}>
          <FaceLayer
            id={id}
            {...mesh}
            shaded
          />
          {hovered ? <Cursor cursor='pointer' /> : null}
        </PBRMaterial>
      }

    />
  );
}, 'Mesh');

export const MeshInstancePage: LC = (props) => {
  const dataTexture = makeTexture();

  const view = (
    <Gather
      children={[
        <InterleavedData
          fields={MESH_FIELDS}
          data={meshVertexArray}
        />,
        <ImageTexture
          url="/textures/test.png"
        />
      ]}
      then={([
        positions, normals, colors, uvs,
        texture,
      ]) => {
        const mesh = {
          positions,
          normals,
          colors,
          uvs,
          shaded: true,
        };
      
        return (
          <Loop>
            <Draw>
              <Cursor cursor='move' />
              <Pass>
                <Lights>
                  <PointLight position={[-2.5, 3, 2, 1]} intensity={4} />

                  <Scene>
                    <PBRMaterial
                      albedoMap={texture}
                    >
                      <Instances
                        mesh={mesh}
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
        );
      }}
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
