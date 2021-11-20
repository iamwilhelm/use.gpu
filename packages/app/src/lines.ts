import { LiveComponent } from '@use-gpu/live/types';
import { TypedArray, ViewUniforms, UniformPipe, UniformAttribute, UniformType, VertexData, StorageSource, RenderPassMode } from '@use-gpu/core/types';
import { ViewContext, RenderContext } from '@use-gpu/components';
import { yeet, memoProps, useContext, useMemo, useOne, useState, useResource } from '@use-gpu/live';
import { makeUniforms, makeUniformsWithStorage, makeRenderPipeline, extractPropBindings, uploadBuffer } from '@use-gpu/core';
import { useBoundStorageShader } from '@use-gpu/components';
import { defineGLSL } from '@use-gpu/shader';

//import vertexShader from './glsl/quads-vertex.glsl';
//import fragmentShader from './glsl/quads-fragment.glsl';

export type QuadsProps = {
  position?: number[] | TypedArray,
  segments?: number[] | TypedArray,
  size?: number,

  positions?: StorageSource,
  segments?: StorageSource,
  sizes?: StorageSource,

  depth?: number,
  join: 'miter' | 'round' | 'bevel',

  debug?: boolean,
  mode?: RenderPassMode,
};

const ZERO = [0, 0, 0, 1];

const DATA_BINDINGS = [
  { name: 'getPosition', format: 'vec4' },
  { name: 'getSegment', format: 'int' },
  { name: 'getSize', format: 'float' },
] as UniformAttribute[];

const LINE_JOIN_SIZE = {
  'bevel': 1,
  'miter': 2,
  'round': 4,
};

const LINE_JOIN_STYLE = {
  'bevel': 0,
  'miter': 1,
  'round': 2,
};

export const Lines: LiveComponent<QuadLinesProps> = memoProps((fiber) => (props) => {
  const {
    debug = false,
    mode = RenderPassMode.Render,
  } = props;

  const {uniforms, defs} = useContext(ViewContext);
  const renderContext = useContext(RenderContext);
  const {device, colorStates, depthStencilState, samples, languages} = renderContext;

  // Customize shader
  let {join, depth = 0} = props;
  join = join in LINE_JOIN_SIZE ? join : 'bevel';
  const style = LINE_JOIN_STYLE[join];
  const segments = LINE_JOIN_SIZE[join];

  const vertices = 4 + segments*2;
  const tris = (1+segments) * 2;
  const edges = tris*2 + 1;

  const defines = {
    LINE_JOIN_STYLE: style,
    LINE_JOIN_SIZE: segments,
    WIREFRAME_STRIP_SEGMENTS: edges,
  };

  // Render shader
  const {glsl: {modules}} = languages;
  const vertexShader = !debug ? modules['instance/virtual'] : modules['instance/wireframe-strip'];
  const fragmentShader = modules['instance/line/fragment'];
  const codeBindings = { 'getVertex:getLineVertex': modules['instance/vertex/line'] };

  // Data bindings
  const dataBindings = useOne(() => extractPropBindings(DATA_BINDINGS, [
    props.position ?? ZERO,
    props.positions,
    props.segment ?? 0,
    props.segments,
    props.size ?? 1,
    props.sizes,
  ]), props);

  let instanceCount = props.positions?.length || 2;
  instanceCount--;

  // Shaders and data bindings
  const [vertex, fragment, attributes, constants] = useBoundStorageShader(
    vertexShader,
    fragmentShader,
    DATA_BINDINGS,
    dataBindings,
    codeBindings,
    defines,
    languages,
    [join],
    1,
  );
  
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
  return yeet((passEncoder: GPURenderPassEncoder, renderMode: RenderPassMode) => {
    if (renderMode !== mode) return;

    uniform.pipe.fill(uniforms);
    uploadBuffer(device, uniform.buffer, uniform.pipe.data);

    storage.pipe.fill(dataBindings.constants);
    uploadBuffer(device, storage.buffer, storage.pipe.data);

    passEncoder.setPipeline(pipeline);
    passEncoder.setBindGroup(0, uniform.bindGroup);
    passEncoder.setBindGroup(1, storage.bindGroup);

    if (!debug) passEncoder.draw(vertices, instanceCount, 0, 0);
    else passEncoder.draw(4, edges * instanceCount, 0, 0);
  }); 
}, 'Lines');
