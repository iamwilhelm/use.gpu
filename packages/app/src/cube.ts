import { LiveComponent } from '@use-gpu/live/types';
import { CameraUniforms, UniformDefinition, UniformAttribute } from '@use-gpu/core/types';

import { yield, memoProps, useMemo, useOne } from '@use-gpu/live';
import {
  makeVertexBuffers, makeUniformBuffer, uploadBuffer,
  makeUniforms, makeUniformBindings,
  makeShader, makeShaderStage,
} from '@use-gpu/core';

import vertexShader from './glsl/vertex.glsl';
import fragmentShader from './glsl/fragment.glsl';

import { makeCube } from './meshes/cube';

export type CubeProps = {
  device: GPUDevice,
  colorStates: GPUColorStateDescriptor,
  depthStencilState: GPUDepthStencilStateDescriptor,
  defs: UniformAttribute[]
  uniforms: CameraUniforms,
  compileGLSL: (s: string, t: string) => any,
};

export const Cube: LiveComponent<CubeProps> = memoProps((fiber) => (props) => {
  const {device, colorStates, depthStencilState, defs, uniforms, compileGLSL} = props;

  const cube = useOne(fiber)(makeCube);
  const vertexBuffers = useMemo(fiber)(() =>
    makeVertexBuffers(device, cube.vertices), [device]);

  const pipeline = useMemo(fiber)(() => {
    const pipelineDesc: GPURenderPipelineDescriptor = {
      // @ts-ignore
      primitive: {
        topology: "triangle-list",
        cullMode: "back",
      },
      vertex:   makeShaderStage(device, makeShader(compileGLSL(vertexShader, 'vertex')), {buffers: cube.attributes}),
      // @ts-ignore
      fragment: makeShaderStage(device, makeShader(compileGLSL(fragmentShader, 'fragment')), {targets: colorStates}),
      depthStencil: depthStencilState,
    };
    return device.createRenderPipeline(pipelineDesc);
  }, [device, colorStates, depthStencilState]);

  const [uniformBuffer, uniformPipe, uniformBindGroup] = useMemo(fiber)(() => {
    const uniformPipe = makeUniforms(defs);
    const uniformBuffer = makeUniformBuffer(device, uniformPipe.data);
    const entries = makeUniformBindings([{resource: {buffer: uniformBuffer}}]);
    const uniformBindGroup = device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries,
    });
    return [uniformBuffer, uniformPipe, uniformBindGroup] as [GPUBuffer, UniformDefinition, GPUBindGroup];
  }, [device, defs, pipeline]);

  return yield((passEncoder: GPURenderPassEncoder) => {
    uniformPipe.fill(uniforms);
    uploadBuffer(device, uniformBuffer, uniformPipe.data);

    passEncoder.setPipeline(pipeline);
    passEncoder.setBindGroup(0, uniformBindGroup);
    passEncoder.setVertexBuffer(0, vertexBuffers[0]);
    passEncoder.draw(cube.count, 1, 0, 0);
  });
}, 'Cube');
