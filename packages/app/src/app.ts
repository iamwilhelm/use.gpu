import { LiveComponent } from '@use-gpu/live/types';
import { CanvasRenderingContextGPU } from '@use-gpu/webgpu/types';
import { ViewUniforms, UniformAttribute } from '@use-gpu/core/types';

import { use, useOne } from '@use-gpu/live';

import {
  AutoCanvas,
  Loop, Draw, Pass,
  OrbitCamera, OrbitControls,
  RenderToTexture,
} from '@use-gpu/components';
import { Cube } from './cube';
import { UseInspect } from '@use-gpu/inspect';

export type AppProps = {
  device: GPUDevice,
  adapter: GPUAdapter,
  canvas: HTMLCanvasElement,
  compileGLSL: (s: string, t: string) => string,
};

export const App: LiveComponent<AppProps> = (fiber) => (props) => {
  const {canvas, device, adapter, compileGLSL} = props;

  return [
    use(AutoCanvas)({
      canvas, device, adapter,
      render: (renderContext: CanvasRenderingContextGPU) => {
    
        const {
          width, height, gpuContext,
          colorStates, colorAttachments,
          depthStencilState, depthStencilAttachment,
        } = renderContext;

        return use(OrbitControls)({
          canvas,
          render: (radius: number, phi: number, theta: number) =>

            use(OrbitCamera)({
              canvas, width, height,
              radius, phi, theta,
              render: (defs: UniformAttribute[], uniforms: ViewUniforms) => [
              
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

                use(Draw)({
                  device, gpuContext, colorAttachments,
                  children: [

                    use(Pass)({
                      device, colorAttachments, depthStencilAttachment,
                      children: [

                        use(Cube)({device, colorStates, depthStencilState, compileGLSL, defs, uniforms}),

                      ]
                    })

                  ],
                }),

              ],
            })
        });
      }
    }),
    use(UseInspect)({fiber, canvas}),
  ];
};

