import { LC } from '@use-gpu/live/types';
import { DataField, Emitter, StorageSource, ViewUniforms, UniformAttribute, RenderPassMode } from '@use-gpu/core/types';
import { GLTF } from '@use-gpu/gltf/types';

import React from '@use-gpu/live/jsx';
import { use } from '@use-gpu/live';
import { vec3 } from 'gl-matrix';

import {
  LinearRGB, Pass, Fetch,
  CompositeData, Data, RawData, Raw, LineSegments,
  OrbitCamera, OrbitControls,
  Cursor, PointLayer, LineLayer,
  Lights, PointLight,
} from '@use-gpu/workbench';
import { GLTFData, GLTFModel } from '@use-gpu/gltf';

export const GeometryGLTFPage: LC = () => {

  const url = "/gltf/DamagedHelmet/DamagedHelmet.gltf";

  const view = (
    <LinearRGB>
      <Cursor cursor='move' />
      <Pass>
        <Lights>
          <PointLight position={[10, 20, 30]} color={[1, 0.5, 0.25]} />
          <PointLight position={[-30, 10, 10]} color={[0, 0.5, 1.0]} />
          <GLTFData
            url={url}
            render={(gltf: GLTF) =>
              <GLTFModel gltf={gltf} />
            }
          />
        </Lights>
      </Pass>
    </LinearRGB>
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
          scale={1080}
        >
          {view}
        </OrbitCamera>
      }
    />
  );
};
