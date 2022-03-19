import { LiveComponent } from '@use-gpu/live/types';
import { CanvasRenderingContextGPU } from '@use-gpu/webgpu/types';
import { DataField, Emitter, StorageSource, ViewUniforms, UniformAttribute, RenderPassMode } from '@use-gpu/core/types';

import { use, useMemo, useOne, useResource, useState, memoArgs } from '@use-gpu/live';

import {
  Loop, Draw, Pass, Flat, UI, Layout, Absolute, Inline, Text,
  CompositeData, Data, RawData, Raw,
  OrbitCamera, OrbitControls,
  Pick, Cursor, Points, Lines,
  RenderToTexture, TextureShader,
  RawFullScreen,
  Router, Routes,
} from '@use-gpu/components';
import { Mesh } from '../mesh';
import { makeMesh, makeTexture } from '../meshes/mesh';

export type RTTPageProps = {
  canvas: HTMLCanvasElement,
};

const seq = (n: number, s: number = 0, d: number = 1) => Array.from({ length: n }).map((_, i: number) => s + d * i);

const data = seq(10).map((i) => ({
  position: [Math.random()*4-2, Math.random()*4-2, Math.random()*4-2, 1],
  size: Math.random() * 50 + 10,
}));

const quadFields = [
  ['vec4<f32>', 'position'],
  ['f32', 'size'],
] as DataField[];

const lineFields = [
  ['vec4<f32>', [2, -2, 2, 1, 2, -2, -2, 1, -2, -2, -2, 1, -2, -2, 0, 1, 0, -2, 0, 1, 0, 0, 0, 1]],
  ['i32', [1, 3, 3, 3, 3, 2]],
  ['f32', [10, 10, 10, 10, 10]],
] as DataField[];

const lineData = seq(1).map((i) => ({
  path: seq(3 + i + Math.random() * 5).map(() => [Math.random()*2-1, Math.random()*2-1 - 2, Math.random()*2-1, 1]),
  color: [Math.random(), Math.random(), Math.random(), 1], 
  size: Math.random() * 20 + 1,
  loop: false,
}));

lineData.push({
  path: [[2, 0, 0, 1], [2, 1, 0, 1], [2, 1, 1, 1], [2, 0, 1, 1]],
  color: [0.7, 0, 0.5, 1],
  size: 20,
  loop: true,
})

const lineDataFields = [
  ['array<vec4<f32>>', (o: any) => o.path],
  ['vec4<f32>', 'color'],
  ['f32', 'size'],
] as DataField[];

let t = 0;
let lj = 0;
const getLineJoin = () => ['bevel', 'miter', 'round'][lj = (lj + 1) % 3];

export const RTTPage: LiveComponent<RTTPageProps> = (props) => {
  const mesh = makeMesh();
  const texture = makeTexture();
  const {canvas} = props;

  const Post = memoArgs(
    (rtt: TextureSource) =>
      use(Pass)({
        picking: false,
        children: [
      
          use(TextureShader)({
            texture: rtt,
            render: (getTexture: ShaderModule) => 
              use(RawFullScreen)({
                getTexture,
              }),
          }),

        ]
      }),
      'Post',
  );

  const view = [
    use(RenderToTexture)({
      presentationFormat: "rgba16float",
      colorSpace: 'linear',
      children: [
        use(Raw)(() => {
          t = t + 1/60;
        }),
        use(Pass)({
          picking: true,
          children: [
            use(CompositeData)({
              fields: lineDataFields,
              data: lineData,
              isLoop: (o: any) => o.loop,
              render: ([segments, positions, colors, sizes]: StorageSource[]) => [
                use(Lines)({ segments, positions, colors, sizes, }),
              ]          
            }),
            
            use(Data)({
              fields: lineFields,
              render: ([positions, segments, sizes]: StorageSource[]) => [
                use(Lines)({ positions, segments, size: 50, join: 'round' }),
                use(Lines)({ positions, segments, size: 50, join: 'round', mode: RenderPassMode.Debug }),
                use(Lines)({ positions, segments, size: 50, join: 'round', mode: RenderPassMode.Debug, depth: 1 }),
              ]
            }),
            use(CompositeData)({
              fields: lineDataFields,
              data: lineData,
              isLoop: (o: any) => o.loop,
              render: ([segments, positions, colors, sizes]: StorageSource[]) => [
                use(Lines)({ segments, positions, colors, sizes, }),
              ]          
            }),
            use(RawData)({
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
                use(Points)({ positions, colors: positions, size: 20, depth: 1, mode: RenderPassMode.Transparent }),
                use(Points)({ positions, size: 20, depth: 1, mode: RenderPassMode.Debug }),
                use(Points)({ positions, size: 20, depth: 0, mode: RenderPassMode.Debug }),
              ],
            }),
            use(Pick)({
              render: ({id, hovered, clicked}) => [
                use(Mesh)({ texture, mesh, blink: clicked }),
                use(Mesh)({ id, texture, mesh, mode: RenderPassMode.Picking }),
                hovered ? use(Cursor)({ cursor: 'pointer' }) : null,
              ],
            }),
            use(Flat)({
              children: 

                use(UI)({
                  children:
                
                    use(Layout)({
                      children: 
              
                        use(Absolute)({
                          left: '50%',
                          top: '50%',
                          right: 0,
                          bottom: 0,
                          children: [

                            use(Inline)({
                              children: [
                    
                                use(Text)({ size: 32, color: [0.5, 0.5, 0.5, 1], content: "A simple and efficient method is presented which allows improved rendering of glyphs composed of curved and linear elements. A distance field is generated from a high resolution image, and then stored into a channel of a lower-resolution texture.\n\nIn the simplest case, this texture can then be rendered simply by using the alpha-testing and alpha-thresholding feature of modern GPUs, without a custom shader. This allows the technique to be used on even the lowest-end 3D graphics hardware." })
                  
                              ],
                            }),

                          ],
                        }),
                        
                    })
                      
                })

            }),
            
          ],
        }),
      ],
      then: (texture) =>  
        use(Draw)({
          live: true,
          children:
            use(Post)(texture),
        }),
    }),
  ];

  return (
    use(OrbitControls)({
      canvas,
      render: (radius: number, phi: number, theta: number) =>

        use(OrbitCamera)({
          radius, phi, theta,
          scale: 1080,
          children: view,
        })  
    })
  );
};
