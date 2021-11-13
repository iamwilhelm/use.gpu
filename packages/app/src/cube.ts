import { LiveComponent } from '@use-gpu/live/types';
import { ViewUniforms, UniformDefinition, UniformAttribute, UniformType } from '@use-gpu/core/types';

import { ViewContext, RenderContext } from '@use-gpu/components';
import { yeet, memoProps, useContext, useMemo, useOne, useState, useResource } from '@use-gpu/live';
import {
  makeVertexBuffers, makeUniformBuffer, uploadBuffer,
  makeUniforms, makeUniformBindings,
  makeShaderModule, makeShaderStage,
} from '@use-gpu/core';

import vertexShader from './glsl/cube-vertex.glsl';
import fragmentShader from './glsl/cube-fragment.glsl';

export const CUBE_UNIFORM_DEFS: UniformAttribute[] = [
  {
    name: 'blink',
    format: UniformType.float,
  },
];

import { makeCube } from './meshes/cube';

export type CubeProps = {
};

export const Cube: LiveComponent<CubeProps> = memoProps((fiber) => (props) => {
  const {uniforms, defs} = useContext(ViewContext);
  const {width, device, colorStates, depthStencilState, languages} = useContext(RenderContext);
  const {glsl: {compile}} = languages;

  // Blink state, flips every second
  const [blink, setBlink] = useState(0);
  const blinkUniform = {value: blink};
  useResource((dispose) => {
    const timer = setInterval(() => {
      setBlink(b => 1 - b);
    }, 1000);
    setTimeout(() => clearInterval(timer), 5500);
    dispose(() => clearInterval(timer));
  });

  // Cube vertex data
  const cube = useOne(makeCube);
  const vertexBuffers = useMemo(() =>
    makeVertexBuffers(device, cube.vertices), [device]);

  // Rendering pipeline
  const pipeline = useMemo(() => {
    const pipelineDesc: GPURenderPipelineDescriptor = {
      // @ts-ignore
      primitive: {
        topology: "triangle-list",
        cullMode: "back",
      },
      vertex:   makeShaderStage(device, makeShaderModule(compile(vertexShader, 'vertex')), {buffers: cube.attributes}),
      // @ts-ignore
      fragment: makeShaderStage(device, makeShaderModule(compile(fragmentShader, 'fragment')), {targets: colorStates}),
      depthStencil: depthStencilState,
    };
    return device.createRenderPipeline(pipelineDesc);
  }, [device, colorStates, depthStencilState]);

  // Uniforms
  const [uniformBuffer, uniformPipe, uniformBindGroup] = useMemo(() => {
    const uniformPipe = makeUniforms([...defs, ...CUBE_UNIFORM_DEFS]);
    const uniformBuffer = makeUniformBuffer(device, uniformPipe.data);
    const entries = makeUniformBindings([{resource: {buffer: uniformBuffer}}]);
    const uniformBindGroup = device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries,
    });
    return [uniformBuffer, uniformPipe, uniformBindGroup] as [GPUBuffer, UniformDefinition, GPUBindGroup];
  }, [device, defs, pipeline]);

  // Return a lambda back to parent(s)
  return yeet((passEncoder: GPURenderPassEncoder) => {
    uniformPipe.fill({...uniforms, blink: blinkUniform});
    uploadBuffer(device, uniformBuffer, uniformPipe.data);

    passEncoder.setPipeline(pipeline);
    passEncoder.setBindGroup(0, uniformBindGroup);
    passEncoder.setVertexBuffer(0, vertexBuffers[0]);
    passEncoder.draw(cube.count, 1, 0, 0);
  }); 
}, 'Cube');
