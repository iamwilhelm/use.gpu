import { LiveComponent } from '@use-gpu/live/types';
import { CanvasRenderingContextGPU } from '@use-gpu/webgpu/types';
import { ViewUniforms, UniformAttribute } from '@use-gpu/core/types';

import { use, useOne } from '@use-gpu/live';

import {
  AutoCanvas,
  Loop, Draw, Pass,
  OrbitCamera, OrbitControls,
} from '@use-gpu/components';
import { Cube } from './cube';

export type AppProps = {
  device: GPUDevice,
  adapter: GPUAdapter,
  canvas: HTMLCanvasElement,
  compileGLSL: (s: string, t: string) => string,
};

export const App: LiveComponent<AppProps> = () => (props) => {
  const {canvas, device, adapter, compileGLSL} = props;

  return use(AutoCanvas)({
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
            render: (defs: UniformAttribute[], uniforms: ViewUniforms) =>

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
              })
          })
      });
    }
  });
};

