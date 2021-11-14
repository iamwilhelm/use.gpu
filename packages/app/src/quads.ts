import { LiveComponent } from '@use-gpu/live/types';
import { ViewUniforms, UniformDefinition, UniformAttribute, UniformType, VertexData, StorageSource } from '@use-gpu/core/types';
import { ViewContext, RenderContext } from '@use-gpu/components';
import { yeet, memoProps, useContext, useMemo, useOne, useState, useResource } from '@use-gpu/live';
import { linkModule } from '@use-gpu/shader';
import {
  makeVertexBuffers, makeUniformBuffer, uploadBuffer,
  makeUniforms, makeUniformBindings,
  makeRenderPipeline, makeShaderModule,
  makeStorageBindings, makeStorageAccessors,
} from '@use-gpu/core';

//import vertexShader from './glsl/quads-vertex.glsl';
import fragmentShader from './glsl/quads-fragment.glsl';

export type QuadsProps = {
  positions: StorageSource,
};

export const Quads: LiveComponent<QuadsProps> = memoProps((fiber) => (props) => {

  const {uniforms, defs} = useContext(ViewContext);
  const renderContext = useContext(RenderContext);
  const {device, colorStates, depthStencilState, samples, languages} = renderContext;
  const {glsl: {compile, modules}} = languages;

  // Storage
  const {positions} = props;
  const links = useMemo(() => {
    if (positions.type !== 'vec4') throw new Error("Positions must be vec4");
    return {getPosition: positions};
  }, [device, positions]);

  const [vertex, fragment] = useMemo(() => {
    const accessors = makeStorageAccessors(links, 1);
    const vertexShader = modules['instance/quad/vertex'];
    //const vertexShader = modules['instance/quad/vertex'];
    console.log(linkModule(vertexShader, modules, accessors))

    const vertex = makeShaderModule(compile(linkModule(vertexShader, modules, accessors), 'vertex'));
    const fragment = makeShaderModule(compile(linkModule(fragmentShader, modules, accessors), 'fragment'));

    return [vertex, fragment];
  }, [links]);

  // Rendering pipeline
  const pipeline = useMemo(() =>
    makeRenderPipeline(
      renderContext,
      vertex,
      fragment,
      {
        primitive: {
          topology: "triangle-strip",
          stripIndexFormat: 'uint16',
        },
        vertex:   {},
        fragment: {},
      }
    ),
    [device, colorStates, depthStencilState, samples, languages]
  );

  // Uniforms
  const [uniformBuffer, uniformPipe, uniformBindGroup, storageBindGroup] = useMemo(() => {
    const uniformPipe = makeUniforms(defs);

    const uniformBuffer = makeUniformBuffer(device, uniformPipe.data);
    const uniformEntries = makeUniformBindings([{resource: {buffer: uniformBuffer}}]);
    const uniformBindGroup = device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: uniformEntries,
    });

    const storageEntries = makeStorageBindings(links);
    const storageBindGroup = device.createBindGroup({
      layout: pipeline.getBindGroupLayout(1),
      entries: storageEntries,
    });

    return [uniformBuffer, uniformPipe, uniformBindGroup, storageBindGroup]
      as [GPUBuffer, UniformDefinition, GPUBindGroup, GPUBindGroup];
  }, [device, defs, pipeline, links]);

  // Return a lambda back to parent(s)
  return yeet((passEncoder: GPURenderPassEncoder) => {
    uniformPipe.fill(uniforms);
    uploadBuffer(device, uniformBuffer, uniformPipe.data);

    passEncoder.setPipeline(pipeline);
    passEncoder.setBindGroup(0, uniformBindGroup);
    passEncoder.setBindGroup(1, storageBindGroup);
    passEncoder.draw(4, positions.length * 4, 0, 0);
  }); 
}, 'Quads');
