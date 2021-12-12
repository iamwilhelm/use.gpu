import { LiveComponent } from '@use-gpu/live/types';
import { CanvasRenderingContextGPU } from '@use-gpu/webgpu/types';
import { DataField, Emitter, ShaderLanguages, StorageSource, ViewUniforms, UniformAttribute, RenderPassMode } from '@use-gpu/core/types';

import { use, useMemo, useOne, useResource, useState } from '@use-gpu/live';

import {
  AutoCanvas,
  Loop, Draw, Pass,
  CompositeData, Data, RawData, Inline,
  OrbitCamera, OrbitControls,
  Picking, Pick, EventProvider,
  Cursor, Points, Lines,
  RawQuads as Quads, RawLines,
  RenderToTexture,
  ViewProvider,
} from '@use-gpu/components';
import { Mesh } from './mesh';
import { makeMesh } from './meshes/mesh';
import { UseInspect } from '@use-gpu/inspect';

import { circle, diamond, circleOutlined, diamondOutlined, squareOutlined } from '@use-gpu/glsl/mask/point.glsl';

export type AppProps = {
  device: GPUDevice,
  adapter: GPUAdapter,
  canvas: HTMLCanvasElement,
  languages: ShaderLanguages,
};

const seq = (n: number, s: number = 0, d: number = 1) => Array.from({ length: n }).map((_, i: number) => s + d * i);

const data = seq(10).map((i) => ({
  position: [Math.random()*4-2, Math.random()*4-2, Math.random()*4-2, 1],
  size: Math.random() * 50 + 10,
}));
const quadFields = [
  ['vec4', 'position'],
  ['float', 'size'],
] as DataField[];

const lineFields = [
  ['vec4', [0, 0, 0, 1, 1.5, 0, 0, 1, 1.5, 1.5, 0, 1, 1.5, 1.5, 1.5, 1, 1.5, -1.5, 1.5, 1]],
  ['int', [1, 3, 3, 3, 2]],
  ['float', [10, 10, 10, 10, 10]],
] as DataField[];

const lineData = seq(1).map((i) => ({
  path: seq(3 + i + Math.random() * 5).map(() => [Math.random()*4-2, Math.random()*4-2, Math.random()*4-2, 1]),
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
  ['vec4[]', (o: any) => o.path],
  ['vec4', 'color'],
  ['float', 'size'],
] as DataField[];

let t = 0;
let lj = 0;
const getLineJoin = () => ['bevel', 'miter', 'round'][lj = (lj + 1) % 3];

export const App: LiveComponent<AppProps> = (fiber) => (props) => {
  const {canvas, device, adapter, languages} = props;

  const inspect = useInspector();
  const mesh = makeMesh();

  const view = [
    use(Inline)(() => {
      t = t + 1/60;
    }),
    use(Pass)({
      children: [
        use(Data)({
          fields: lineFields,
          render: ([positions, segments, sizes]: StorageSource[]) => [
            //use(Quads)({ positions, size: [10, 10] }),
            use(RawLines)({ positions, segments, size: 50, join: 'round' }),
            use(RawLines)({ positions, segments, size: 50, join: 'round', mode: RenderPassMode.Debug }),
            //use(Lines)({ positions, segments, size: 50, join: getLineJoin(), mode: RenderPassMode.Picking }),
          ]
        }),
        use(CompositeData)({
          fields: lineDataFields,
          data: lineData,
          isLoop: (o: any) => o.loop,
          render: ([segments, positions, colors, sizes]: StorageSource[]) => [
            //use(Quads)({ positions, size: [10, 10] }),
            use(RawLines)({ segments, positions, colors, sizes, }),
            use(RawLines)({ segments, positions, colors, sizes, mode: RenderPassMode.Debug }),
            //use(Lines)({ positions, segments, size: 50, join: getLineJoin(), mode: RenderPassMode.Picking }),
          ]          
        }),
        use(RawData)({
          format: 'vec4',
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
            use(Points)({ positions, colors: positions, size: 50, perspective: 0.95, mode: RenderPassMode.Transparent }),
            //use(Quads)({ positions, size: [50, 50], id: 2, mode: RenderPassMode.Picking }),
            //use(Quads)({ positions, size: [50, 50], mode: RenderPassMode.Debug }),
            
            use(Points)({ positions, size: 100, perspective: 0.95, mode: RenderPassMode.Debug }),
          ],
        }),
        /*
        use(Data)({
          data,
          fields: quadFields,
          render: ([positions, sizes]: StorageSource[]) => [
            use(Quads)({ positions, sizes }),
            //use(Quads)({ positions, sizes, debug: true }),
          ],
        }),
        */
        /*
        use(RawData)({
          type: 'vec4',
          length: 100,
          expr: (emit) => emit(Math.random()*4-2, Math.random()*4-2, Math.random()*4-2, 1),
          render: (positions) => use(Quads)({ positions }),
          //live: true,
        }),
        */
        use(Pick)({
          render: ({id, hovered, clicked}) => [
            use(Mesh)({ mesh, blink: clicked }),
            use(Mesh)({ id, mesh, mode: RenderPassMode.Picking }),
            hovered ? use(Cursor)({ cursor: 'pointer' }) : null,
          ],
        }),
      ]
    }),
  ];

  return [
    use(AutoCanvas)({
      canvas, device, adapter, languages, samples: 4,
      children:
      
        use(Picking)({
          children:

            use(EventProvider)({
              element: canvas, children:

                use(OrbitControls)({
                  canvas,
                  render: (radius: number, phi: number, theta: number) =>

                    use(OrbitCamera)({
                      radius, phi, theta,
                      render: (defs: UniformAttribute[], uniforms: ViewUniforms) =>

                        use(ViewProvider)({
                          defs, uniforms, children:

//                            use(Loop)({
//                              children: [

                                //use(RenderToTexture)({
                                //  children: view,
                                //}),
          
                                use(Draw)({
                                  children: view,
                                }),

//                              ],
//                            })
          
                        })
                    })
                })
            })
        })
    }),
    inspect ? use(UseInspect)({fiber, canvas}) : null,
  ];
};

const useInspector = () => {
  const [inspect, setInspect] = useState<boolean>(true);
  useResource((dispose) => {
    const keydown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === 'i') setInspect((s) => !s);
      if (e.metaKey && e.key === 'j') setInspect((s) => s);
    }

    window.addEventListener('keydown', keydown);
    dispose(() => window.addEventListener('keydown', keydown));
  });

  return inspect;
}
