import { LiveComponent } from '@use-gpu/live/types';
import { ViewUniforms, UniformPipe, UniformAttribute, UniformType, VertexData, RenderPassMode } from '@use-gpu/core/types';
import { ViewContext, RenderContext, PickingContext, useNoPicking } from '@use-gpu/components';
import { yeet, memo, useContext, useSomeContext, useNoContext, useMemo, useOne, useState, useResource } from '@use-gpu/live';
import {
  makeVertexBuffers, makeMultiUniforms, 
  makeRenderPipeline, makeShaderModule,
  uploadBuffer,
} from '@use-gpu/core';
import { linkModule as link } from '@use-gpu/shader';

export const MESH_UNIFORM_DEFS: UniformAttribute[] = [
  {
    name: 'lightPosition',
    format: UniformType.vec4,
  },
];

const LIGHT = [0.5, 3, 2, 1];

export type MeshProps = {
  mesh: VertexData,
  mode?: RenderPassMode,
  id?: number,
};

export const Mesh: LiveComponent<MeshProps> = memo((fiber) => (props) => {
  const {
    mesh,
    mode = RenderPassMode.Render,
    id = 0,
  } = props;

  const {viewUniforms, viewDefs} = useContext(ViewContext);
  const renderContext = useContext(RenderContext);

  const isDebug = mode === RenderPassMode.Debug;
  const isPicking = mode === RenderPassMode.Picking;
  const pickingContext = isPicking ? useSomeContext(PickingContext) : useNoContext();  
  const {pickingDefs, pickingUniforms} = pickingContext?.usePicking(id) ?? useNoPicking();

  const resolvedContext = pickingContext?.renderContext ?? renderContext;
  const {device, colorStates, depthStencilState, samples, languages} = resolvedContext;

  const vertexBuffers = useMemo(() =>
    makeVertexBuffers(device, mesh.vertices), [device, mesh]);

  const defines = {
    IS_PICKING: isPicking,
    VIEW_BINDING: 0,
    LIGHT_BINDING: 1,
    PICKING_BINDING: 1,
  };

  // Render shader
  const {glsl: {compile, modules, cache}} = languages;
  const vertexShader = !isDebug ? modules['instance/mesh'] : module['instance/virtual/wireframe-mesh']
  const fragmentShader = !isDebug ? modules['instance/fragment/mesh'] : modules['instance/fragment/solid'];

  // Rendering pipeline
  const pipeline = useMemo(() => {
    const vertexLinked = link(vertexShader, modules, {}, defines, cache);
    const fragmentLinked = link(fragmentShader, modules, {}, defines, cache);

    const vertex = makeShaderModule(compile(vertexLinked, 'vertex'));
    const fragment = makeShaderModule(compile(fragmentLinked, 'fragment'));
    
    return makeRenderPipeline(
      resolvedContext,
      vertex,
      fragment,
      {
        primitive: {
          topology: "triangle-list",
          cullMode: "back",
        },
        vertex:   {buffers: mesh.attributes},
        fragment: {},
      }
    );
  }, [device, colorStates, depthStencilState, samples, languages]);

  // Uniforms
  const uniform = useMemo(() => {
    const meshDefs = MESH_UNIFORM_DEFS;
    const defs = isPicking ? [viewDefs, pickingDefs] : [viewDefs, meshDefs];
    const uniform = makeMultiUniforms(device, pipeline, defs, 0);
    return uniform;
  }, [device, viewDefs, pickingDefs, isPicking, pipeline]);

  // Return a lambda back to parent(s)
  return yeet({
    [mode]: (passEncoder: GPURenderPassEncoder) => {
      uniform.pipe.fill(viewUniforms);
      uniform.pipe.fill({ lightPosition: LIGHT });
      if (isPicking) uniform.pipe.fill(pickingUniforms);
      uploadBuffer(device, uniform.buffer, uniform.pipe.data);

      passEncoder.setPipeline(pipeline);
      passEncoder.setBindGroup(0, uniform.bindGroup);
      passEncoder.setVertexBuffer(0, vertexBuffers[0]);
      passEncoder.draw(mesh.count, 1, 0, 0);
    }
  }); 
}, 'Mesh');
