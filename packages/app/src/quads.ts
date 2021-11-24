import { LiveComponent } from '@use-gpu/live/types';
import { TypedArray, ViewUniforms, UniformPipe, UniformAttribute, UniformType, VertexData, StorageSource, RenderPassMode } from '@use-gpu/core/types';
import { ViewContext, RenderContext, PickingContext, useNoPicking } from '@use-gpu/components';
import { use, memo, useContext, useSomeContext, useNoContext, useMemo, useOne, useState, useResource } from '@use-gpu/live';
import { makeMultiUniforms, makeUniformsWithStorage, makeRenderPipeline, extractPropBindings, uploadBuffer } from '@use-gpu/core';
import { useBoundStorageShader } from '@use-gpu/components';

import { Virtual } from './virtual';

//import vertexShader from './glsl/quads-vertex.glsl';
//import fragmentShader from './glsl/quads-fragment.glsl';

export type QuadsProps = {
  position?: number[] | TypedArray,
  size?: number,

  positions?: StorageSource,
  sizes?: StorageSource,
  
  mode?: RenderPassMode | string,
  id?: number,
};

const ZERO = [0, 0, 0, 1];

const DATA_BINDINGS = [
  { name: 'getPosition', format: 'vec4' },
  { name: 'getSize', format: 'float' },
] as UniformAttribute[];

const DEFINES = {
  STRIP_SEGMENTS: 5,
};

export const Quads: LiveComponent<QuadsProps> = memo((fiber) => (props) => {
  const {
    mode = RenderPassMode.Render,
    id = 0,
  } = props;

  const renderContext = useContext(RenderContext);
  const {languages: {glsl: {modules}}} = renderContext;
  const codeBindings = { 'getVertex:getQuadVertex': modules['instance/vertex/quad'] };

  const propBindings = [
    props.position ?? ZERO,
    props.positions,
    props.size ?? 1,
    props.sizes,
  ];
  
  const vertexCount = 4;
  const instanceCount = props.positions?.length || 1;

  return use(Virtual)({
    topology: 'triangle-strip',
    vertexCount,
    instanceCount,

    attributes: DATA_BINDINGS,
    propBindings,
    codeBindings,
    DEFINES,
    deps: null,

    mode,
    id,
  });
}, 'Quads');
