import type { LC } from '@use-gpu/live';

import React, { memo } from '@use-gpu/live';

import {
  Loop, Draw, Pass, Flat, Animate,
  InterleavedData, PBRMaterial, RawTexture,
  OrbitCamera, OrbitControls,
  Pick, Cursor, FaceLayer,
  Scene, Node, Primitive,
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

const KEYFRAMES = [
  [ 0, [-3,  0, 0]],
  [10, [ 0, -3, 0]],
  [20, [ 3,  0, 0]],
  [30, [ 0,  3, 0]],
  [40, [-3,  0, 0]],
];

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

// This uses a typical scene-graph arrangement to transform the mesh
export const MeshScenePage: LC = (props) => {
  const dataTexture = makeTexture();

  const view = (
    <InterleavedData
      fields={MESH_FIELDS}
      data={meshVertexArray}
      render={(positions, normals, colors, uvs) => (

        <RawTexture
          data={dataTexture}
          render={(texture) => (

            <Loop>
              <Draw>
                <Cursor cursor='move' />
                <Pass>
                  <Lights>
                    <PointLight position={[-2.5, 3, 2, 1]} intensity={4} />

                    <Scene>

                      <Animate prop="position" keyframes={KEYFRAMES} loop>
                        <Node rotation={[30, - 30, -30]}>
                          <Primitive>
                            <Mesh mesh={{positions, normals, colors, uvs}} texture={texture} />
                          </Primitive>      
                        </Node>
                      </Animate>

                      <Animate prop="position" keyframes={KEYFRAMES} loop delay={-20}>
                        <Node rotation={[30, - 30, -30]}>
                          <Primitive>
                            <Mesh mesh={{positions, normals, colors, uvs}} texture={texture} />
                          </Primitive>      
                        </Node>
                      </Animate>

                    </Scene>

                  </Lights>
                </Pass>
              </Draw>
            </Loop>
          )}
        />
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
