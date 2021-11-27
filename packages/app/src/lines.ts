import { LiveComponent } from '@use-gpu/live/types';
import { TypedArray, ViewUniforms, UniformPipe, UniformAttribute, UniformType, VertexData, StorageSource, RenderPassMode } from '@use-gpu/core/types';
import { ViewContext, PickingContext, useNoPicking, Virtual } from '@use-gpu/components';
import { use, yeet, memo, useMemo, useOne, useState, useResource } from '@use-gpu/live';
import { makeMultiUniforms, makeUniformsWithStorage, makeRenderPipeline, extractPropBindings, uploadBuffer } from '@use-gpu/core';
import { useBoundStorageShader } from '@use-gpu/components';

import instanceVertexLine from 'instance/vertex/line.glsl';

export type LinesProps = {
  position?: number[] | TypedArray,
  segments?: number[] | TypedArray,
  size?: number,

  positions?: StorageSource,
  segments?: StorageSource,
  sizes?: StorageSource,

  depth?: number,
  join: 'miter' | 'round' | 'bevel',

  mode?: RenderPassMode,
  id?: number,
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

export const Lines: LiveComponent<LinesProps> = memo((fiber) => (props) => {
  const {
    mode = RenderPassMode.Render,
    id = 0,
  } = props;

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
    STRIP_SEGMENTS: tris,
  };
  const codeBindings = {
    'getVertex:getLineVertex': instanceVertexLine,
  };

  const propBindings = [
    props.position ?? ZERO,
    props.positions,
    props.segment ?? 0,
    props.segments,
    props.size ?? 1,
    props.sizes,
  ];
  
  const vertexCount = vertices;
  const instanceCount = (props.positions?.length || 2) - 1;

  return use(Virtual)({
    topology: 'triangle-strip',
    vertexCount,
    instanceCount,

    attributes: DATA_BINDINGS,
    propBindings,
    codeBindings,
    defines,
    deps: [join],

    mode,
    id,
  });
}, 'Lines');
