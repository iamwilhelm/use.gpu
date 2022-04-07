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

import { patch } from '@use-gpu/state';
import { use, yeet, memo, useFiber, useMemo, useOne, useState, useResource } from '@use-gpu/live';
import { bindBundle, bindingsToLinks } from '@use-gpu/shader/wgsl';
import { makeShaderBindings } from '@use-gpu/core';

import { getLineVertex } from '@use-gpu/wgsl/instance/vertex/line.wgsl';
import { getPassThruFragment } from '@use-gpu/wgsl/mask/passthru.wgsl';

export type RawLinesProps = {
  position?: number[] | TypedArray,
  segment?: number,
  color?: number[] | TypedArray,
  width?: number,
  depth?: number,
  trim?: number[] | TypedArray,
	size?: number,

  positions?: StorageSource,
  segments?: StorageSource,
  colors?: StorageSource,
  widths?: StorageSource,
  depths?: StorageSource,
  trims?: StorageSource,
  sizes?: StorageSource,

  getPosition?: ShaderModule,
  getSegment?: ShaderModule,
  getColor?: ShaderModule,
  getWidth?: ShaderModule,
  getDepth?: ShaderModule,
  getTrim?: StorageSource,
  getSize?: StorageSource,

  join?: 'miter' | 'round' | 'bevel',

  count?: number,
  pipeline?: DeepPartial<GPURenderPipelineDescriptor>,
  mode?: RenderPassMode,
  id?: number,
};

const ZERO = [0, 0, 0, 1];

const VERTEX_BINDINGS = [
  { name: 'getPosition', format: 'vec4<f32>', value: ZERO },
  { name: 'getSegment', format: 'i32', value: 0 },
  { name: 'getColor', format: 'vec4<f32>', value: [0.5, 0.5, 0.5, 1] },
  { name: 'getWidth', format: 'f32', value: 1 },
  { name: 'getDepth', format: 'f32', value: 0 },
  { name: 'getTrim', format: 'vec4<i32>', value: [0, 0, 0, 0] },
  { name: 'getSize', format: 'f32', value: 1 },
] as UniformAttributeValue[];

const LINE_JOIN_SIZE = {
  'bevel': 1,
  'miter': 2,
  'round': 4,
} as Record<string, number>;

const LINE_JOIN_STYLE = {
  'bevel': 0,
  'miter': 1,
  'round': 2,
} as Record<string, number>;

const PIPELINE = {
  primitive: {
    topology: 'triangle-strip',
    stripIndexFormat: 'uint16',
  },
} as DeepPartial<GPURenderPipelineDescriptor>;

export const RawLines: LiveComponent<RawLinesProps> = memo((props: RawLinesProps) => {
  const {
    pipeline: propPipeline,
    count = 2,
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
  };

  // Set up draw
  const vertexCount = 2 + tris;
  const instanceCount = ((props.positions?.length ?? count) || 2) - 1;

  const pipeline = useOne(() => patch(PIPELINE, propPipeline), propPipeline);
  const key = useFiber().id;

  const p = props.positions ?? props.position ?? props.getPosition;
  const g = props.segments ?? props.segment ?? props.getSegment;
  const c = props.colors ?? props.color ?? props.getColor;
  const w = props.widths ?? props.width ?? props.getWidth;
  const d = props.depths ?? props.depth ?? props.getDepth;
  const t = props.trims ?? props.trim ?? props.getTrim;
  const z = props.sizes ?? props.size ?? props.getSize;

  const [getVertex, getFragment] = useMemo(() => {
    const vertexBindings = makeShaderBindings<ShaderModule>(VERTEX_BINDINGS, [p, g, c, w, d, t, z]);

    const getVertex = bindBundle(getLineVertex, bindingsToLinks(vertexBindings), {}, key);
    const getFragment = getPassThruFragment;

    return [getVertex, getFragment];
  }, [p, g, c, w, d, t, z]);

  return use(Virtual, {
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
