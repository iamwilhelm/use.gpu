import type { LC } from '@use-gpu/live';

import React from '@use-gpu/live';

import {
  Loop, Draw, Pass, Flat,
  InterleavedData, PBRMaterial, RawTexture,
  OrbitCamera, OrbitControls,
  Pick, Cursor, FaceLayer,
  Scene, Node,
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

export const MeshScenePage: LC = (props) => {
  const dataTexture = makeTexture();

  const view = (
    <Draw>
      <Cursor cursor='move' />
      <Pass>
        <Lights>
          <PointLight position={[-2.5, 3, 2, 1]} intensity={4} />

          <Scene>
            <Node>

              <InterleavedData
                fields={MESH_FIELDS}
                data={meshVertexArray}
                render={(positions, normals, colors, uvs) => (

                  <RawTexture
                    data={dataTexture}
                    render={(texture) => (

                      <Pick
                        render={({id, hovered, presses}) =>
                          <PBRMaterial albedoMap={texture} albedo={presses.left % 2 ? COLOR_ON : COLOR_OFF}>
                            <FaceLayer
                              id={id}
                              positions={positions}
                              normals={normals}
                              colors={colors}
                              uvs={uvs}
                              shaded
                            />
                            {hovered ? <Cursor cursor='pointer' /> : null}
                          </PBRMaterial>
                        }

                      />
                    )}
                  />

                )}
              />
      
            </Node>
          </Scene>

        </Lights>
      </Pass>
    </Draw>
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
