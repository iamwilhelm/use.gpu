import { LiveComponent } from '@use-gpu/live/types';
import { ViewUniforms, UniformPipe, UniformAttribute, UniformType, VertexData, RenderPassMode } from '@use-gpu/core/types';
import { ViewContext, RenderContext, PickingContext, usePickingContext } from '@use-gpu/components';
import { yeet, memo, useContext, useNoContext, useMemo, useOne, useState, useResource } from '@use-gpu/live';
import {
  makeVertexBuffers, makeMultiUniforms, 
  makeRenderPipeline, makeShaderModule,
  uploadBuffer,
} from '@use-gpu/core';
import { linkBundle } from '@use-gpu/shader/glsl';

import instanceDrawMesh from '@use-gpu/glsl/instance/draw/mesh.glsl';
import instanceFragmentMesh from '@use-gpu/glsl/instance/fragment/mesh.glsl';
import instanceFragmentSolid from '@use-gpu/glsl/instance/fragment/solid.glsl';
//import instanceVirtualWireframeMesh from 'instance/virtual/wireframe-mesh.glsl';

export const MESH_UNIFORM_DEFS: UniformAttribute[] = [
  {
    name: 'lightPosition',
    format: UniformType.vec4,
  },
  {
    name: 'lightColor',
    format: UniformType.vec4,
  },
];

const LIGHT = [-2.5, 3, 2, 1];

export type MeshProps = {
  mesh: VertexData,
  mode?: RenderPassMode,
  id?: number,
  blink?: boolean,
};

export const Mesh: LiveComponent<MeshProps> = memo((fiber) => (props) => {
  const {
    mesh,
    mode = RenderPassMode.Opaque,
    id = 0,
    blink,
  } = props;

  let blinkState = useOne(() => ({ state: false }));
  useOne(() => {
    if (blink) blinkState.state = !blinkState.state
  }, blink);

  const {viewUniforms, viewDefs} = useContext(ViewContext);
  
  const isDebug = mode === RenderPassMode.Debug;
  const isPicking = mode === RenderPassMode.Picking;
  const {renderContext, pickingUniforms, pickingDefs} = usePickingContext(id, isPicking);
  const {device, colorStates, depthStencilState, samples, languages} = renderContext;

  const vertexBuffers = useMemo(() =>
    makeVertexBuffers(device, mesh.vertices), [device, mesh]);

  const defines = {
    IS_PICKING: isPicking,
    VIEW_BINDGROUP: 0,
    VIEW_BINDING: 0,
    LIGHT_BINDGROUP: 0,
    LIGHT_BINDING: 1,
    PICKING_BINDGROUP: 0,
    PICKING_BINDING: 1,
  };

  // Render shader
  const {glsl: {compile, cache}} = languages;
  // TODO: mesh debug
  const vertexShader = !isDebug ? instanceDrawMesh : instanceDrawMesh;
  const fragmentShader = !isDebug ? instanceFragmentMesh : instanceFragmentSolid;

  // Rendering pipeline
  const pipeline = useMemo(() => {
    const vertexLinked = linkBundle(vertexShader, {}, defines, cache);
    const fragmentLinked = linkBundle(fragmentShader, {}, defines, cache);

    const vertex = makeShaderModule(compile(vertexLinked, 'vertex'));
    const fragment = makeShaderModule(compile(fragmentLinked, 'fragment'));
    
    return makeRenderPipeline(
      renderContext,
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
      const l = blinkState.state ? 1 : 0.5;

      uniform.pipe.fill(viewUniforms);
      uniform.pipe.fill({ lightPosition: LIGHT, lightColor: [l, l, l, 1] });
      if (isPicking) uniform.pipe.fill(pickingUniforms);
      uploadBuffer(device, uniform.buffer, uniform.pipe.data);

      passEncoder.setPipeline(pipeline);
      passEncoder.setBindGroup(0, uniform.bindGroup);
      passEncoder.setVertexBuffer(0, vertexBuffers[0]);
      passEncoder.draw(mesh.count, 1, 0, 0);
    }
  }); 
}, 'Mesh');
