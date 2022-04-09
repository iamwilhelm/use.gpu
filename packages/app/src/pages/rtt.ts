import { LiveComponent } from '@use-gpu/live/types';
import { CanvasRenderingContextGPU } from '@use-gpu/webgpu/types';
import { DataField, Emitter, StorageSource, ViewUniforms, UniformAttribute, RenderPassMode } from '@use-gpu/core/types';

import { use, useMemo, useOne, useResource, useState, memoArgs } from '@use-gpu/live';

import {
  Loop, Draw, Pass, Flat, UI, Layout, Absolute, Inline, Block, Text,
  CompositeData, Data, RawData, Raw,
  OrbitCamera, OrbitControls,
  Pick, Cursor, PointLayer, LineLayer,
  RenderToTexture, LinearRGB, TextureShader,
  RawFullScreen,
  Router, Routes,
} from '@use-gpu/components';
import { Mesh } from '../mesh';
import { makeMesh, makeTexture } from '../meshes/mesh';

export type RTTPageProps = {
  canvas: HTMLCanvasElement,
};

const seq = (n: number, s: number = 0, d: number = 1) => Array.from({ length: n }).map((_, i: number) => s + d * i);

const quadFields = [
  ['vec4<f32>', 'position'],
  ['f32', 'width'],
] as DataField[];

const lineFields = [
  ['vec4<f32>', [2, -2, 2, 1, 2, -2, -2, 1, -2, -2, -2, 1, -2, -2, 0, 1, 0, -2, 0, 1, 0, 0, 0, 1]],
  ['i32', [1, 3, 3, 3, 3, 2]],
  ['f32', [10, 10, 10, 10, 10]],
] as DataField[];

const lineData = seq(1).map((i) => ({
  path: seq(30 + i + Math.random() * 5).map(() => [Math.random()*2-1, Math.random()*0-1 - 2, Math.random()*2-1, 1]),
  color: [Math.random(), Math.random(), Math.random(), 1], 
  width: Math.random() * 20 + 1,
  loop: false,
}));

lineData.push({
  path: [[2, 0, 0, 1], [2, 1, 0, 1], [2, 1, 1, 1], [2, 0, 1, 1]],
  color: [0.7, 0, 0.5, 1],
  width: 20,
  loop: true,
})

const lineDataFields = [
  ['array<vec4<f32>>', (o: any) => o.path],
  ['vec4<f32>', 'color'],
  ['f32', 'width'],
] as DataField[];

let t = 0;

export const RTTPage: LiveComponent<RTTPageProps> = (props) => {
  const mesh = makeMesh();
  const texture = makeTexture();
  const {canvas} = props;

  const view = (
    use(LinearRGB, {
      children:
        use(Draw, {
          children: [
            use(Raw, () => {
              t = t + 1/60;
            }),
            use(Cursor, { cursor: 'move' }),
            use(Pass, {
              picking: true,
              children: [

                use(CompositeData, {
                  fields: lineDataFields,
                  data: lineData,
                  loop: (o: any) => o.loop,
                  render: ([segments, positions, colors, widths]: StorageSource[]) => [
                    use(LineLayer, { segments, positions, colors, widths }),
                  ]          
                }),
            
                use(RawData, {
                  format: 'vec4<f32>',
                  length: 100,
                  live: true,
                  expr: (emit: Emitter, i: number) => {
                    const s = ((i*i + i) % 13133.371) % 1000;
                    emit(
                      Math.cos(t * 1.31 + Math.sin((t + s) * 0.31) + s) * 2,
                      Math.sin(t * 1.113 + Math.sin((t - s) * 0.414) - s) * 2,
                      Math.cos(t * 0.981 + Math.cos((t + s*s) * 0.515) + s*s) * 2,
                      1,
                    );
                  },
                  render: (positions) => [
                    use(PointLayer, { positions, colors: positions, size: 20, depth: 1, mode: RenderPassMode.Transparent }),
                  ],
                }),
                use(Pick, {
                  render: ({id, hovered, presses}) => [
                    use(Mesh, { texture, mesh, blink: presses.left }),
                    use(Mesh, { id, texture, mesh, mode: RenderPassMode.Picking }),
                    hovered ? use(Cursor, { cursor: 'pointer' }) : null,
                  ],
                }),

                use(Flat, {
                  children: 

                    use(UI, {
                      children:
                
                        use(Layout, {
                          children: 
              
                            use(Absolute, {
                              left: '50%',
                              top: '50%',
                              right: 0,
                              bottom: 0,
                              children: [

                                use(Block, {
                                  children: [
                              
                                    use(Inline, {
                                      margin: [0, 32, 0, 0],
                                      children: [
                    
                                        use(Text, { size: 32, color: [1, 1, 1, 1], content: "A simple and efficient method is presented which allows improved rendering of glyphs composed of curved and linear elements. A distance field is generated from a high resolution image, and then stored into a channel of a lower-resolution texture." })
                  
                                      ],
                                    }),

                                    use(Inline, {
                                      margin: [0, 32, 0, 0],
                                      children: [
                    
                                        use(Text, { size: 32, color: [1, 1, 1, 1], content: "In the simplest case, this texture can then be rendered simply by using the alpha-testing and alpha-thresholding feature of modern GPUs, without a custom shader. This allows the technique to be used on even the lowest-end 3D graphics hardware." })
                  
                                      ],
                                    }),

                                  ],
                                })

                              ],
                            }),
                        
                        })
                      
                    })

                }),
            
              ],
            }),
          ],
        }),
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
