import { LiveComponent } from '@use-gpu/live/types';
import { CanvasRenderingContextGPU } from '@use-gpu/webgpu/types';
import { CameraUniforms, UniformAttribute } from '@use-gpu/core/types';

import { defer } from '@use-gpu/live';

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

  return defer(AutoCanvas)({
    canvas, device, adapter,
    render: ({
      width, height, gpuContext,
      colorStates, colorAttachments,
      depthStencilState, depthStencilAttachment,
    }: CanvasRenderingContextGPU) =>

      defer(OrbitControls)({
        canvas,
        render: (radius: number, phi: number, theta: number) =>

          defer(OrbitCamera)({
            canvas, width, height,
            radius, phi, theta,
            render: (defs: UniformAttribute[], uniforms: CameraUniforms) =>

              defer(Draw)({
                device, gpuContext, colorAttachments,
                render: () =>

                  defer(Pass)({
                    device, colorAttachments, depthStencilAttachment,
                    render: (passEncoder: GPURenderPassEncoder) => [

                      defer(Cube, 'cube')({device, colorStates, depthStencilState, compileGLSL, defs, uniforms, passEncoder}),

                    ]
                  })
              })
          })
      })
  });
};

