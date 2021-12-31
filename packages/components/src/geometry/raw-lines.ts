import { LiveComponent } from '@use-gpu/live/types';
import {
  TypedArray, ViewUniforms, DeepPartial,
  UniformPipe, UniformAttribute, UniformAttributeValue, UniformType,
  VertexData, StorageSource, RenderPassMode,
} from '@use-gpu/core/types';
import { ShaderModule } from '@use-gpu/shader/types';

import { ViewContext } from '../providers/view-provider';
import { PickingContext, useNoPicking } from '../render/picking';
import { Virtual } from './virtual';

import { use, yeet, memo, patch, useMemo, useOne, useState, useResource } from '@use-gpu/live';
import { bindBundle, bindingsToLinks } from '@use-gpu/shader/glsl';
import { makeShaderBindings } from '@use-gpu/core';

import { getLineVertex } from '@use-gpu/glsl/instance/vertex/line.glsl';
import { getPassThruFragment } from '@use-gpu/glsl/mask/passthru.glsl';

export type RawLinesProps = {
  position?: number[] | TypedArray,
  segment?: number,
  size?: number,
  color?: number[] | TypedArray,
  depth?: number,

  positions?: StorageSource,
  segments?: StorageSource,
  sizes?: StorageSource,
  colors?: StorageSource,
  depths?: number,

  getPosition?: ShaderModule,
  getSegment?: ShaderModule,
  getSize?: ShaderModule,
  getColor?: ShaderModule,
  getDepth?: ShaderModule,

  join?: 'miter' | 'round' | 'bevel',

  pipeline: DeepPartial<GPURenderPipelineDescriptor>,
  mode?: RenderPassMode,
  id?: number,
};

const ZERO = [0, 0, 0, 1];

const VERTEX_BINDINGS = [
  { name: 'getPosition', format: 'vec4', value: ZERO },
  { name: 'getSegment', format: 'int', value: 0 },
  { name: 'getColor', format: 'vec4', value: [0.5, 0.5, 0.5, 1] },
  { name: 'getSize', format: 'float', value: 1 },
  { name: 'getDepth', format: 'float', value: 0 },
] as UniformAttributeValue[];

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

const PIPELINE = {
  primitive: {
    topology: 'triangle-strip',
    stripIndexFormat: 'uint16',
  },
};

export const RawLines: LiveComponent<RawLinesProps> = memo((fiber) => (props) => {
  const {
    pipeline: propPipeline,
    mode = RenderPassMode.Opaque,
    id = 0,
  } = props;

  // Customize line shader
  let {join, depth = 0} = props;
  const j = (join! in LINE_JOIN_SIZE) ? join! : 'bevel';

  const style = LINE_JOIN_STYLE[j];
  const segments = LINE_JOIN_SIZE[j];
  const tris = (1+segments) * 2;
  const defines = {
    LINE_JOIN_STYLE: style,
    LINE_JOIN_SIZE: segments,
    STRIP_SEGMENTS: tris,
  };

  // Set up draw
  const vertexCount = tris * 3;
  const instanceCount = (props.positions?.length || 2) - 1;

  const pipeline = useOne(() => patch(PIPELINE, propPipeline), propPipeline);

  const vertexBindings = makeShaderBindings<ShaderModule>(VERTEX_BINDINGS, [
    props.positions ?? props.position ?? props.getPosition,
    props.segments ?? props.segment ?? props.getSegment,
    props.colors ?? props.color ?? props.getColor,
    props.sizes ?? props.size ?? props.getSize,
    props.depths ?? props.depth ?? props.getDepth,
  ]);

  const key = fiber.id;
  const getVertex = bindBundle(getLineVertex, bindingsToLinks(vertexBindings), {}, key);
  const getFragment = getPassThruFragment;

  return use(Virtual)({
    vertexCount,
    instanceCount,

    getVertex,
    getFragment,

    defines,
    deps: [j],

    pipeline,
    mode,
    id,
  });
}, 'RawLines');
