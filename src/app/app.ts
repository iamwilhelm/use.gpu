import { LiveComponent } from '../live/types';
import { defer, useMemo, useOne } from '../live/live';
import {
  AutoSize, Canvas,
  Loop, Pass,
  Camera, CameraUniforms,
} from '../components';

import { Cube } from './cube';

import vertexShader from './glsl/vertex.glsl';
import fragmentShader from './glsl/fragment.glsl';

import { makeVertexBuffers, makeUniformBuffer, uploadBuffer } from '../core/buffer';
import { makeUniforms, makeUniformBindings } from '../core/uniform';
import { makeShader, makeShaderStage } from '../core/pipeline';

export type AppProps = {
  device: GPUDevice,
  adapter: GPUAdapter,
  canvas: HTMLCanvasElement,
  compileGLSL: (s: string, t: string) => any,
};

const updateFrameState = (device: GPUDevice, width: number, height: number) => {
  const {fov, near, far} = DEFAULT_CAMERA;
  const phi = 0.6;
  const theta = 0.4;
  
  const uniforms = {
    projectionMatrix: makeProjectionMatrix(width, height, fov, near, far),
    viewMatrix: makeOrbitMatrix(5, phi, theta),
  };
  
};

export const App: LiveComponent<AppProps> = (context) => (props) => {
  const {canvas, device, adapter, compileGLSL} = props;

  return defer(AutoSize)({
    canvas,
    render: (width: number, height: number) =>
      defer(Canvas)({
        canvas, device, adapter,
        render: ({
          swapChain, colorStates, colorAttachments, depthStencilState, depthStencilAttachment,
        }: CanvasRenderContextGPU) =>
          defer(Camera)({
            width, height,
            render: (defs: UniformAttribute[], uniforms: CameraUniforms) =>
              defer(Loop)({
                device, swapChain, colorAttachments,
                render: () =>
                  defer(Pass)({
                    device, colorAttachments, depthStencilAttachment,
                    render: (passEncoder: GPURenderPassEncoder) => [
                      defer(Cube, 'cube')({device, colorStates, depthStencilState, compileGLSL, defs, uniforms, passEncoder}),
                    ]
                  })
              })
          })
      }),
  });
};
