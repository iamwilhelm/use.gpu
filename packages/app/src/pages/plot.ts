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
  Plot, Cartesian, Axis, Grid, Scale, Tick, Label,
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
                  
                    use(Animation, {
                      loop: true,
                      mirror: true,
                      delay: 0,
                      frames: [
                        [0, [[0, 1], [0, 1], [0, 1]]],
                        [10, [[-20, 8], [0, 1], [0, 1]]],
                      ],
                      prop: 'range',
                      children:
                        use(Cartesian, {
                          range: [],
                          scale: [1, 1, 1],
                          children: [
                            use(Grid, {
                              axes: 'xy',
                              width: 3,
                              first: { detail: 3, divide: 5 },
                              second: { detail: 3, divide: 5 },
                              depth: 0.5,
                            }),
                            use(Grid, {
                              axes: 'xz',
                              width: 3,
                              first: { detail: 3, divide: 5 },
                              second: { detail: 3, divide: 5 },
                              depth: 0.5,
                            }),
                            use(Axis, {
                              axis: 'x',
                              width: 5,
                              color: [0.75, 0.75, 0.75, 1],
                              depth: 0.5,
                            }),
                            use(Scale, {
                              divide: 5,
                              axis: 'x',
                              children: [
                                use(Tick, {
                                  size: 50,
                                  width: 5,
                                  offset: [0, 1, 0],
                                  color: [0.75, 0.75, 0.75, 1],
                                  depth: 0.5,
                                }),
                                use(Label, {
                                  placement: 'bottom',
                                  color: '#808080',
                                  size: 32,
                                  offset: 16,
                                  expand: 5,
                                  depth: 0.5,
                                }),
                                use(Label, {
                                  placement: 'bottom',
                                  color: '#ffffff',
                                  size: 32,
                                  offset: 16,
                                  expand: 0,
                                  depth: 0.5,
                                }),
                              ],
                            }),
                            use(Axis, {
                              axis: 'y',
                              width: 5,
                              color: [0.75, 0.75, 0.75, 1],
                              detail: 8,
                              depth: 0.5,
                            }),
                            use(Axis, {
                              axis: 'z',
                              width: 5,
                              color: [0.75, 0.75, 0.75, 1],
                              depth: 0.5,
                            }),
                          ]
                        })                     
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
          //scale: 540,
          children: view,
        })  
    })
  );
};
