import type { LC, PropsWithChildren } from '@use-gpu/live';

import React, { Gather } from '@use-gpu/live';

import {
  Loop, Draw, Pass, Flat,
  InterleavedData, PBRMaterial, RawTexture,
  OrbitCamera, OrbitControls,
  Pick, Cursor, FaceLayer,
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

// This is a reimplementation of app/components/mesh using standard use.gpu components
export const MeshInterleavedPage: LC = (props) => {
  const dataTexture = makeTexture();

  return (
    <Gather
      children={[
        <InterleavedData
          fields={MESH_FIELDS}
          data={meshVertexArray}
        />,
        <RawTexture
          data={dataTexture}
        />
      ]}
      then={([
        positions, normals, colors, uvs,
        texture,
      ]) => (
        <Draw>
          <Cursor cursor='move' />
          <Camera>
            <Pass>
              <Lights>
                <PointLight position={[-2.5, 3, 2, 1]} intensity={4} />

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
  
              </Lights>
            </Pass>
          </Camera>
        </Draw>
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
