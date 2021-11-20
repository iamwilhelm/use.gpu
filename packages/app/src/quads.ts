import { LiveComponent } from '@use-gpu/live/types';
import { TypedArray, ViewUniforms, UniformPipe, UniformAttribute, UniformType, VertexData, StorageSource } from '@use-gpu/core/types';
import { ViewContext, RenderContext } from '@use-gpu/components';
import { yeet, memoProps, useContext, useMemo, useOne, useState, useResource } from '@use-gpu/live';
import { makeUniforms, makeStorage, makeRenderPipeline, extractPropBindings, uploadBuffer } from '@use-gpu/core';
import { useBoundStorageShader } from '@use-gpu/components';

//import vertexShader from './glsl/quads-vertex.glsl';
//import fragmentShader from './glsl/quads-fragment.glsl';

export type QuadsProps = {
  position?: number[] | TypedArray,
  size?: number,

  positions?: StorageSource,
  sizes?: StorageSource,
  
  debug?: boolean,
};

const ZERO = [0, 0, 0, 1];

const DATA_BINDINGS = [
  { name: 'getPosition', format: 'vec4' },
  { name: 'getSize', format: 'float' },
] as UniformAttribute[];

export const Quads: LiveComponent<QuadsProps> = memoProps((fiber) => (props) => {
  const {uniforms, defs} = useContext(ViewContext);
  const renderContext = useContext(RenderContext);
  const {device, colorStates, depthStencilState, samples, languages} = renderContext;
  const {debug} = props;

  // Render shader
  const {glsl: {modules}} = languages;
  const vertexShader = !debug ? modules['instance/virtual'] : modules['instance/wireframe-strip'];
  const fragmentShader = !debug ? modules['instance/quad/fragment'] : modules['instance/line/fragment'];
  const codeBindings = { 'getVertex:getQuadVertex': modules['instance/quad/vertex'] };
  const defines = {
    WIREFRAME_STRIP_SEGMENTS: 5,
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
  useMemo(() => console.log('pipeline changed'), [pipeline]);

  // Uniforms
  const [
    uniform,
    constant,
    storage,
  ] = useMemo(() => {
    const uniform = makeUniforms(device, pipeline, defs, 0);
    const storage = attributes.length ? makeStorage(device, pipeline, dataBindings.links, 1) : null;
    const constant = constants.length ? makeUniforms(device, pipeline, constants, 2) : null;

    return [uniform, constant, storage];
  }, [device, defs, constants, attributes, pipeline, dataBindings]);

  // Return a lambda back to parent(s)
  return yeet((passEncoder: GPURenderPassEncoder) => {
    uniform.pipe.fill(uniforms);
    uploadBuffer(device, uniform.buffer, uniform.pipe.data);

    if (constant) {
      constant.pipe.fill(dataBindings.constants);
      uploadBuffer(device, constant.buffer, constant.pipe.data);
    }

    passEncoder.setPipeline(pipeline);
    passEncoder.setBindGroup(0, uniform.bindGroup);
    if (storage) passEncoder.setBindGroup(1, storage);
    if (constant) passEncoder.setBindGroup(2, constant.bindGroup);

    if (!debug) passEncoder.draw(4, instanceCount, 0, 0);
    else passEncoder.draw(4, 5 * instanceCount, 0, 0);
  }); 
}, 'Quads');
