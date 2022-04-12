import { LiveComponent } from '@use-gpu/live/types';
import { CanvasRenderingContextGPU } from '@use-gpu/webgpu/types';
import { DataField, Emitter, StorageSource, ViewUniforms, UniformAttribute, RenderPassMode } from '@use-gpu/core/types';

import { use, useMemo, useOne, useResource, useState } from '@use-gpu/live';

import {
  Loop, Draw, Pass, Flat,
  CompositeData, Data, RawData, Raw,
  OrbitCamera, OrbitControls,
  Pick, Cursor, PointLayer,
  Animation,
  Plot, Cartesian, Axis, Scale, Tick, Label,
  RenderToTexture,
  Router, Routes,
} from '@use-gpu/components';
import { Mesh } from '../mesh';
import { makeMesh, makeTexture } from '../meshes/mesh';

export type GeometryPageProps = {
  canvas: HTMLCanvasElement,
};


console.log({Animation})
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
                  
                  /*
                    use(Animation, {
                      loop: false,
                      mirror: true,
                      delay: 0,
                      frames: [
                        [0,  [[0.25, 1], [0, 1], [0, 1]]],
                        [20, [[-1, 1], [0, 1], [0, 1]]],
                      ],
                      prop: 'range',
                      children:
                  */

                        use(Cartesian, {
                          range: [],
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
                              /*
                                use(Tick, {
                                  size: 50,
                                  width: 10,
                                  offset: [0, 1, 0],
                                  color: [0.75, 0.75, 0.75, 1],
                                }),
                              */
                                use(Label, {
                                  size: 72,
                                  color: '#808080',
                                  expand: 5,
                                  placement: 'bottom',
                                }),
                                use(Label, {
                                  size: 72,
                                  color: '#ffffff',
                                  expand: 0,
                                  placement: 'bottom',
                                }),
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
//                    })

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
          //scale: 540,
          children: view,
        })  
    })
  );
};
