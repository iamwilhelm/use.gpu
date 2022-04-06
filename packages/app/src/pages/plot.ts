import { LiveComponent } from '@use-gpu/live/types';
import { CanvasRenderingContextGPU } from '@use-gpu/webgpu/types';
import { DataField, Emitter, StorageSource, ViewUniforms, UniformAttribute, RenderPassMode } from '@use-gpu/core/types';

import { use, useMemo, useOne, useResource, useState } from '@use-gpu/live';

import {
  Loop, Draw, Pass, Flat,
  CompositeData, Data, RawData, Raw,
  OrbitCamera, OrbitControls,
  Pick, Cursor,
  Plot, Cartesian, Axis,
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
    use(Loop, {
      children: [
        use(Draw, {
          live: true,
          children: [

            use(Cursor, { cursor: 'move' }),
            use(Pass, {
              children: [
      
                use(Pick, {
                  render: ({id, hovered, presses}) => [
                    //use(Mesh, { texture, mesh, blink: presses.left }),
                    use(Mesh, { id, texture, mesh, mode: RenderPassMode.Picking }),
                    hovered ? use(Cursor, { cursor: 'pointer' }) : null,
                  ],
                }),
          
                use(Plot, {
                  children: [

                    use(Cartesian, {
                      scale: [3, 3, 3],
                      children: [

                        use(Axis, {
                          width: 20,
                          color: [1, 1, 1, 0.5],
                          detail: 2,
                        })
                      ]
                    })
                  ]
                })

              ]
            }),
          ],

        }),
      ]
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
