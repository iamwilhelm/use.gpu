import { LiveComponent } from '@use-gpu/live/types';
import { CanvasRenderingContextGPU } from '@use-gpu/webgpu/types';
import { DataField, Emitter, StorageSource, ViewUniforms, UniformAttribute, RenderPassMode } from '@use-gpu/core/types';

import { use, useMemo, useOne, useResource, useState } from '@use-gpu/live';

import {
  Loop, Draw, Pass, Flat,
  CompositeData, Data, RawData, Raw,
  OrbitCamera, OrbitControls,
  Pick, Cursor, PointLayer, Ticks,
  Plot, Cartesian, Axis, Scale,
  RenderToTexture,
  Router, Routes,
} from '@use-gpu/components';
import { Mesh } from '../mesh';
import { makeMesh, makeTexture } from '../meshes/mesh';

export type GeometryPageProps = {
  canvas: HTMLCanvasElement,
};


let t = 0;

export const PlotPage: LiveComponent<PlotPageProps> = (props) => {
  const mesh = makeMesh();
  const texture = makeTexture();
  const {canvas} = props;
  
  const view = (
    use(Loop, {
      children: [
        use(Draw, {
          children: [

            use(Raw, () => {
              t = t + 1/60;
            }),
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
                      range: [[0, 1], [0, 1], [0, 1]],
                      scale: [1, 1, 1],
                      children: [

                        use(Axis, {
                          axis: 'x',
                          width: 20,
                          color: [0.75, 0.75, 0.75, 1],
                        }),
                        use(Scale, {
                          axis: 'x',
                          children: [
                            use(Ticks, { size: 50, width: 10, offset: [0, 1, 0], depth: 0 }),
                          ],
                        }),
                        use(Axis, {
                          axis: 'y',
                          width: 20,
                          color: [0.75, 0.75, 0.75, 1],
                          detail: 8,
                        }),
                        use(Axis, {
                          axis: 'z',
                          width: 20,
                          color: [0.75, 0.75, 0.75, 1],
                        }),
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
