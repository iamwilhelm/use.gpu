import { LiveComponent } from '@use-gpu/live/types';
import { TypedArray, ViewUniforms, UniformPipe, UniformAttribute, UniformType, VertexData, StorageSource, RenderPassMode } from '@use-gpu/core/types';
import { ViewContext, RenderContext, PickingContext } from '@use-gpu/components';
import { yeet, memoProps, useContext, useSomeContext, useNoContext, useMemo, useOne, useState, useResource } from '@use-gpu/live';
import { makeUniformsWithStorage, makeUniforms, makeRenderPipeline, extractPropBindings, uploadBuffer } from '@use-gpu/core';
import { useBoundStorageShader } from '@use-gpu/components';

//import vertexShader from './glsl/quads-vertex.glsl';
//import fragmentShader from './glsl/quads-fragment.glsl';

export type QuadsProps = {
  position?: number[] | TypedArray,
  size?: number,

  positions?: StorageSource,
  sizes?: StorageSource,
  
  mode?: RenderPassMode | string,
  debug?: boolean,
};

const ZERO = [0, 0, 0, 1];

const DATA_BINDINGS = [
  { name: 'getPosition', format: 'vec4' },
  { name: 'getSize', format: 'float' },
] as UniformAttribute[];

export const Quads: LiveComponent<QuadsProps> = memoProps((fiber) => (props) => {
  const {
    debug = false,
    mode = RenderPassMode.Render,
  } = props;

  const {uniforms, defs} = useContext(ViewContext);
  const renderContext = useContext(RenderContext);

  const isPicking = mode === RenderPassMode.Picking;
  const pickingContext = isPicking ? useSomeContext(PickingContext) : useNoContext();
  
  const resolvedContext = pickingContext?.renderContext ?? renderContext;
  const {device, colorStates, depthStencilState, samples, languages} = resolvedContext;

  // Render shader
  const {glsl: {modules}} = languages;
  const vertexShader = !debug ? modules['instance/virtual'] : modules['instance/wireframe-strip'];
  const fragmentShader = !debug ? modules['instance/fragment/solid'] : modules['instance/fragment/solid'];
  const codeBindings = { 'getVertex:getQuadVertex': modules['instance/vertex/quad'] };
  const defines = {
    WIREFRAME_STRIP_SEGMENTS: 5,
    IS_PICKING: isPicking,
  };

  // Data bindings
  const dataBindings = useOne(() => extractPropBindings(DATA_BINDINGS, [
    props.position ?? ZERO,
    props.positions,
    props.size ?? 1,
    props.sizes,
  ]), props);

  const instanceCount = (props.positions ?? props.sizes)?.length || 1;

  // Shaders and data bindings
  const [vertex, fragment, attributes, constants] = useBoundStorageShader(
    vertexShader,
    fragmentShader,
    DATA_BINDINGS,
    dataBindings,
    codeBindings,
    defines,
    languages,
    null,
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
          topology: "triangle-strip",
          stripIndexFormat: 'uint16',
        },
        vertex:   {},
        fragment: {},
      }
    ),
    [device, vertex, fragment, colorStates, depthStencilState, samples, languages]
  );

  // Uniforms
  const [
    uniform,
    storage,
  ] = useMemo(() => {
    const uniform = makeUniforms(device, pipeline, defs, 0);
    const storage = makeUniformsWithStorage(device, pipeline, constants, dataBindings.links, 1);
    return [uniform, storage];
  }, [device, defs, constants, attributes, pipeline, dataBindings]);

  // Return a lambda back to parent(s)
  return yeet({mode, pass: (passEncoder: GPURenderPassEncoder) => {
    uniform.pipe.fill(uniforms);
    uploadBuffer(device, uniform.buffer, uniform.pipe.data);

    storage.pipe.fill(dataBindings.constants);
    uploadBuffer(device, storage.buffer, storage.pipe.data);

    passEncoder.setPipeline(pipeline);
    passEncoder.setBindGroup(0, uniform.bindGroup);
    passEncoder.setBindGroup(1, storage.bindGroup);

    if (!debug) passEncoder.draw(4, instanceCount, 0, 0);
    else passEncoder.draw(4, 5 * instanceCount, 0, 0);
  }}); 
}, 'Quads');
