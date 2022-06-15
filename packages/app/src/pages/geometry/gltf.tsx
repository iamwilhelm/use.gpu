import { LC } from '@use-gpu/live/types';
import { CanvasRenderingContextGPU } from '@use-gpu/webgpu/types';
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
} from '@use-gpu/components';
import { GLTFData, GLTFModel } from '@use-gpu/gltf';

export const GeometryGLTFPage: LC = () => {

  const url = "/gltf/DamagedHelmet/DamagedHelmet.gltf";

  const view = (
    <LinearRGB>
      <Cursor cursor='move' />
      <Pass>

        <GLTFData
          url={url}
          render={(gltf: GLTF) =>
            <GLTFModel gltf={gltf} />
          }
        />

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
