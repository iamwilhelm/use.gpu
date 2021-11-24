import { LiveComponent } from '@use-gpu/live/types';
import { TypedArray, ViewUniforms, UniformPipe, UniformAttribute, UniformType, VertexData, StorageSource, RenderPassMode, ShaderLib } from '@use-gpu/core/types';
import { ViewContext, RenderContext, PickingContext, useNoPicking } from '@use-gpu/components';
import { yeet, memo, useContext, useSomeContext, useNoContext, useMemo, useOne, useState, useResource } from '@use-gpu/live';
import { makeMultiUniforms, makeUniformsWithStorage, makeRenderPipeline, extractPropBindings, uploadBuffer } from '@use-gpu/core';
import { useBoundStorageShader } from '@use-gpu/components';

//import vertexShader from './glsl/quads-vertex.glsl';
//import fragmentShader from './glsl/quads-fragment.glsl';

export type VirtualProps = {
  topology: string,
  vertexCount: number,
  instanceCount: number,

  attributes: UniformAttribute[],
  propBindings: any[],
  codeBindings: ShaderLib,
  defines: Record<string, any>,
  deps: any[],

  mode?: RenderPassMode | string,
  id?: number,
};

export const Virtual: LiveComponent<VirtualProps> = memo((fiber) => (props) => {
  const {
    topology,
    attributes: propAttributes,
    propBindings,
    codeBindings,
    defines,
    vertexCount,
    instanceCount,
    deps = null,
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

  // Render shader
  const {glsl: {modules}} = languages;
  // TODO: non-strip topology
  const vertexShader = !isDebug ? modules['instance/virtual'] : modules['instance/wireframe-strip'];
  const fragmentShader = !isDebug ? modules['instance/fragment/solid'] : modules['instance/fragment/solid'];

  // Data bindings
  const dataBindings = useOne(() => extractPropBindings(propAttributes, propBindings), propBindings);
  const extDefines = useMemo(() => ({
    ...defines,
    IS_PICKING: isPicking,
  }), [isPicking, defines]);

  // Shaders and data bindings
  const [vertex, fragment, attributes, constants] = useBoundStorageShader(
    vertexShader,
    fragmentShader,
    propAttributes,
    dataBindings,
    codeBindings,
    extDefines,
    languages,
    deps,
    1,
  );

  // Rendering pipeline
  const pipeline = useMemo(() =>
    makeRenderPipeline(
      resolvedContext,
      vertex,
      fragment,
      {
        primitive: {
          topology,
          stripIndexFormat: 'uint16',
        },
        vertex:   {},
        fragment: {},
      }
    ),
    [device, vertex, fragment, topology, colorStates, depthStencilState, samples, languages]
  );

  // Uniforms
  const [
    uniform,
    storage,
  ] = useMemo(() => {
    const defs = isPicking ? [viewDefs, pickingDefs] : [viewDefs];
    const uniform = makeMultiUniforms(device, pipeline, defs, 0);
    const storage = makeUniformsWithStorage(device, pipeline, constants, dataBindings.links, 1);
    return [uniform, storage];
  }, [device, viewDefs, constants, attributes, pipeline, dataBindings]);

  // Return a lambda back to parent(s)
  return yeet({
    [mode]: (passEncoder: GPURenderPassEncoder) => {
      uniform.pipe.fill(viewUniforms);
      if (isPicking) uniform.pipe.fill(pickingUniforms);
      uploadBuffer(device, uniform.buffer, uniform.pipe.data);

      storage.pipe.fill(dataBindings.constants);
      uploadBuffer(device, storage.buffer, storage.pipe.data);

      passEncoder.setPipeline(pipeline);
      passEncoder.setBindGroup(0, uniform.bindGroup);
      passEncoder.setBindGroup(1, storage.bindGroup);

      if (!isDebug) passEncoder.draw(vertexCount, instanceCount, 0, 0);
      else {
        // TODO: topology
        const tris = (vertexCount - 2);
        const edges = tris * 2 + 1;
        passEncoder.draw(4, edges * instanceCount, 0, 0);
      }
    },
  }); 
}, 'Virtual');
