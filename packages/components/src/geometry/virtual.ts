import { LiveComponent } from '@use-gpu/live/types';
import {
  TypedArray, ViewUniforms, UniformPipe, UniformAttribute, UniformAttributeValue, UniformType,
  VertexData, StorageSource, RenderPassMode, DeepPartial,
} from '@use-gpu/core/types';
import { ShaderModule, ParsedBundle, ParsedModule } from '@use-gpu/shader/types';
import { ViewContext, RenderContext, PickingContext, usePickingContext } from '@use-gpu/components';
import { yeet, memo, useContext, useSomeContext, useNoContext, useMemo, useOne, useState, useResource } from '@use-gpu/live';
import {
  makeMultiUniforms, makeBoundUniforms,
  makeRenderPipeline,
  uploadBuffer,
} from '@use-gpu/core';
import { useBoundShader } from '../hooks/useBoundShader';

import instanceDrawVirtual from '@use-gpu/glsl/instance/draw/virtual.glsl';
import instanceDrawWireframeStrip from '@use-gpu/glsl/instance/draw/wireframe-strip.glsl';
import instanceFragmentSolid from '@use-gpu/glsl/instance/fragment/solid2.glsl';
import keyBy from 'lodash/keyBy';
import mapValues from 'lodash/mapValues';

export type VirtualProps = {
  pipeline: DeepPartial<GPURenderPipelineDescriptor>,
  mode?: RenderPassMode | string,
  id?: number,

  vertexCount: number,
  instanceCount: number,

  getVertex: ShaderModule,
  getFragment: ShaderModule,

  defines: Record<string, any>,
  deps: any[],
};

const getDebugShader = (topology: GPUPrimitiveTopology) => {
  if (topology === 'triangle-strip') return instanceDrawWireframeStrip;
  // TODO
  if (topology === 'triangle-list') return instanceDrawWireframeStrip;
  return instanceDrawWireframeStrip;
}

export const Virtual: LiveComponent<VirtualProps> = memo((fiber) => (props) => {
  const {
    vertexCount,
    instanceCount,
    getVertex,
    getFragment,

    pipeline: propPipeline,
    defines: propDefines,
    deps = null,
    mode = RenderPassMode.Opaque,
    id = 0,
  } = props;

  const isDebug = mode === RenderPassMode.Debug;
  const isPicking = mode === RenderPassMode.Picking;

  // Render set up
  const {viewUniforms, viewDefs} = useContext(ViewContext);
  const {renderContext, pickingUniforms, pickingDefs} = usePickingContext(isPicking);
  const {device, colorStates, depthStencilState, samples, languages} = renderContext;

  // Render shader
  const {glsl: {modules}} = languages;
  // TODO: non-strip topology
  const topology = propPipeline.primitive?.topology ?? 'triangle-list';
  const vertexShader = !isDebug ? instanceDrawVirtual : getDebugShader(topology);
  const fragmentShader = instanceFragmentSolid;

  const defines = useMemo(() => ({
    IS_PICKING: isPicking,
    VIEW_BINDGROUP: 0,
    VIEW_BINDING: 0,
    PICKING_BINDGROUP: 0,
    PICKING_BINDING: 1,
    VIRTUAL_BINDGROUP: 1,
    ...propDefines,
  }), [isPicking, propDefines]);

  // Shaders
  const {
    shader,
    uniforms,
    bindings,
  } = useBoundShader(
    vertexShader,
    fragmentShader,
    {getVertex, getFragment},
    defines,
    languages,
    deps,
    1,
  );

  // Rendering pipeline
  const [vertex, fragment] = shader;
  const pipeline = useMemo(() => {
    return makeRenderPipeline(
      renderContext,
      vertex,
      fragment,
      propPipeline,
    );
  }, [device, shader, propPipeline, colorStates, depthStencilState, samples, languages]);

  // Uniforms
  const [
    uniform,
    storage,
  ] = useMemo(() => {
    const defs = isPicking ? [viewDefs, pickingDefs] : [viewDefs];
    const uniform = makeMultiUniforms(device, pipeline, defs, 0);
    const storage = makeBoundUniforms(device, pipeline, uniforms, bindings, 1);
    return [uniform, storage];
  }, [device, viewDefs, uniforms, bindings, pipeline]);

  const uniformMap = keyBy(uniforms, ({uniform: {name}}) => name);
  const constantUniforms = mapValues(uniformMap, u => u.constant);

  // Return a lambda back to parent(s)
  return yeet({
    [mode]: (passEncoder: GPURenderPassEncoder) => {
      uniform.pipe.fill(viewUniforms);
      if (isPicking) uniform.pipe.fill(pickingUniforms);
      uploadBuffer(device, uniform.buffer, uniform.pipe.data);

      if (storage.pipe && storage.buffer) {
        storage.pipe.fill(constantUniforms);
        uploadBuffer(device, storage.buffer, storage.pipe.data);
      }

      passEncoder.setPipeline(pipeline);
      passEncoder.setBindGroup(0, uniform.bindGroup);
      if (storage.bindGroup) passEncoder.setBindGroup(1, storage.bindGroup);

      if (!isDebug) passEncoder.draw(vertexCount, instanceCount, 0, 0);
      else {
        if (topology === 'triangle-strip') {
          const tris = vertexCount - 2;
          const edges = tris * 2 + 1;
          passEncoder.draw(4, edges * instanceCount, 0, 0);
        }
        if (topology === 'triangle-list') {
          passEncoder.draw(4, vertexCount * instanceCount, 0, 0);
        }
      }
    },
  });
}, 'Virtual');
