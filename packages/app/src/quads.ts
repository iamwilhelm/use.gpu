import { LiveComponent } from '@use-gpu/live/types';
import { TypedArray, ViewUniforms, UniformPipe, UniformAttribute, UniformType, VertexData, StorageSource, RenderPassMode } from '@use-gpu/core/types';
import { ViewContext, PickingContext, useNoPicking, Virtual } from '@use-gpu/components';
import { use, memo, useMemo, useOne, useState, useResource } from '@use-gpu/live';
import { makeMultiUniforms, makeUniformsWithStorage, makeRenderPipeline, extractPropBindings, uploadBuffer } from '@use-gpu/core';
import { useBoundStorageShader } from '@use-gpu/components';

import instanceVertexQuad from 'instance/vertex/quad.glsl';

export type QuadsProps = {
  position?: number[] | TypedArray,
  size?: number,
  color?: number[],

  positions?: StorageSource,
  sizes?: StorageSource,
  colors?: StorageSource,
  
  mode?: RenderPassMode | string,
  id?: number,
};

const ZERO = [0, 0, 0, 1];
const GRAY = [0.5, 0.5, 0.5, 1];

const DATA_BINDINGS = [
  { name: 'getPosition', format: 'vec4' },
  { name: 'getColor', format: 'vec4' },
  { name: 'getSize', format: 'float' },
] as UniformAttribute[];

const DEFINES = {
  STRIP_SEGMENTS: 2,
};

export const Quads: LiveComponent<QuadsProps> = memo((fiber) => (props) => {
  const {
    mode = RenderPassMode.Render,
    id = 0,
  } = props;

  const vertexCount = 4;
  const instanceCount = props.positions?.length || 1;

  const propBindings = [
    props.positions ?? props.position ?? ZERO,
    props.colors ?? props.color ?? GRAY,
    props.sizes ?? props.size ?? 1,
  ];
  const codeBindings = {
    'getVertex:getQuadVertex': instanceVertexQuad,
  };  

  return use(Virtual)({
    topology: 'triangle-strip',
    vertexCount,
    instanceCount,

    attributes: DATA_BINDINGS,
    propBindings,
    codeBindings,
    defines: DEFINES,
    deps: null,

    mode,
    id,
  });
}, 'Quads');
