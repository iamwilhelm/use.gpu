import { LiveComponent } from '@use-gpu/live/types';
import { CanvasRenderingContextGPU } from '@use-gpu/webgpu/types';
import { DataField, Emitter, StorageSource, ViewUniforms, UniformAttribute, RenderPassMode } from '@use-gpu/core/types';

import { use, useMemo, useOne, useResource, useState } from '@use-gpu/live';

import {
  Loop, Draw, Pass, Flat,
  CompositeData, Data, RawData, Raw,
  OrbitCamera, OrbitControls,
  Pick, Cursor,
  Plot, Cartesian,
  RenderToTexture,
  Router, Routes,
} from '@use-gpu/components';
import { Mesh } from '../mesh';
import { makeMesh, makeTexture } from '../meshes/mesh';

export type GeometryPageProps = {
  canvas: HTMLCanvasElement,
};


let t = 0;
let lj = 0;
const getLineJoin = () => ['bevel', 'miter', 'round'][lj = (lj + 1) % 3];

export const PlotPage: LiveComponent<PlotPageProps> = (props) => {
  const mesh = makeMesh();
  const texture = makeTexture();
  const {canvas} = props;

  const view = (
    use(Draw, {
      live: true,
      children: [
        use(Raw, () => {
          t = t + 1/60;
        }),
        use(Pass, {
          children: [
      
            use(Plot, {
              children: [
                use(Cartesian, {
                  
                })
              ]
            })

          ]
        }),
      ],
    })
  );

  return (
    use(OrbitControls, {
      canvas,
      render: (radius: number, phi: number, theta: number) =>

        use(OrbitCamera, {
          radius, phi, theta,
          scale: 1080,
          children: view,
        })  
    })
  );
};
