import { LiveComponent } from '@use-gpu/live/types';
import { CanvasRenderingContextGPU } from '@use-gpu/webgpu/types';
import { ViewUniforms, UniformAttribute } from '@use-gpu/core/types';

import { use, useMemo, useOne, useResource, useState } from '@use-gpu/live';

import {
  AutoCanvas, GLSLProvider,
  Loop, Draw, Pass,
  OrbitCamera, OrbitControls,
  RenderToTexture,
  ViewProvider,
} from '@use-gpu/components';
import { Cube } from './cube';
import { Mesh } from './mesh';
import { makeMesh } from './meshes/mesh';
import { UseInspect } from '@use-gpu/inspect';

export type AppProps = {
  device: GPUDevice,
  adapter: GPUAdapter,
  canvas: HTMLCanvasElement,
  compileGLSL: (s: string, t: string) => string,
};

export const App: LiveComponent<AppProps> = (fiber) => (props) => {
  const {canvas, device, adapter, compileGLSL} = props;

  const inspect = useInspector();
  const mesh = makeMesh();

  const view = (
    use(Pass)({
      children: [
        use(Mesh)({ mesh }),
      ]
    })
  );

  return [
    use(GLSLProvider)({
      compileGLSL,
      children:

        use(AutoCanvas)({
          canvas, device, adapter,
          children:

            use(OrbitControls)({
              canvas,
              render: (radius: number, phi: number, theta: number) =>

                use(OrbitCamera)({
                  canvas, radius, phi, theta,
                  render: (defs: UniformAttribute[], uniforms: ViewUniforms) =>

                    use(Loop)({
                      children:
                        use(Draw)({
                          children:
                            use(ViewProvider)({
                              defs, uniforms, children: view,
                            })
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
  const [inspect, setInspect] = useState<boolean>(false);
  useResource((dispose) => {
    const keydown = (e) => {
      if (e.metaKey && e.key === 'i') setInspect((s) => !s);
    }

    window.addEventListener('keydown', keydown);
    dispose(() => window.addEventListener('keydown', keydown));
  });

  return inspect;
}


/*
  use(RenderToTexture)({
    device, width, height,
    render: (renderContext: CanvasRenderingContextGPU) => {
      const {
        colorStates, colorAttachments,
        depthStencilState, depthStencilAttachment,
      } = renderContext;

      return use(Pass)({
        device, colorAttachments, depthStencilAttachment,
        children: [

          use(Cube)({device, colorStates, depthStencilState, compileGLSL, defs, uniforms}),

        ]
      });
    },
  }),
*/
