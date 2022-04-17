import { LiveComponent } from '@use-gpu/live/types';
import {
  TypedArray, ViewUniforms, DeepPartial, Prop,
  UniformPipe, UniformAttribute, UniformAttributeValue, UniformType,
  VertexData, TextureSource, ShaderSource, RenderPassMode,
} from '@use-gpu/core/types';
import { ShaderModule } from '@use-gpu/shader/types';

import { ViewContext } from '../providers/view-provider';
import { PickingContext, useNoPicking } from '../render/picking';
import { Virtual } from './virtual';

import { patch } from '@use-gpu/state';
import { use, memo, useCallback, useFiber, useMemo, useOne, useState, useResource } from '@use-gpu/live';
import { bindBundle, bindingsToLinks } from '@use-gpu/shader/wgsl';
import { makeShaderBindings, resolve, BLEND_ALPHA } from '@use-gpu/core';
import { useApplyTransform } from '../hooks/useApplyTransform';
import { useShaderRef } from '../hooks/useShaderRef';

import { getLabelVertex } from '@use-gpu/wgsl/instance/vertex/label.wgsl';
import { getUIFragment } from '@use-gpu/wgsl/instance/fragment/ui.wgsl';

export type RawLabelsProps = {
  index?: number,
  indices?: ShaderSource,

  rectangle?: number[] | TypedArray,
  uv?: number[] | TypedArray,
  layout?: number[] | TypedArray,
  sdf?: number,

  position?: number[] | TypedArray,
  placement?: number[] | TypedArray,
  density?: number[] | TypedArray,
  offset?: number,
  size?: number,
  depth?: number,
  color?: number,
  outline?: number,
  outlineColor?: number[] | TypedArray,

  rectangles?: ShaderSource,
  uvs?: ShaderSource,
  layouts?: ShaderSource,
  sdfs?: ShaderSource,

  positions?: ShaderSource,
  placements?: ShaderSource,
  densities?: ShaderSource,
  offsets?: ShaderSource,
  sizes?: ShaderSource,
  depths?: ShaderSource,
  colors?: ShaderSource,
  outlines?: ShaderSource,
  outlineColors?: ShaderSource,

  texture?: TextureSource | LambdaSource | ShaderModule,

  count?: Prop<number>,
  pipeline?: DeepPartial<GPURenderPipelineDescriptor>,
  mode?: RenderPassMode | string,
  id?: number,
};

const ZERO = [0, 0, 0, 1];
const GRAY = [0.5, 0.5, 0.5, 1];

const VERTEX_BINDINGS = [

  { name: 'getIndex', format: 'u32', value: 0 },
  { name: 'getRectangle', format: 'vec4<f32>', value: [-1, -1, 1, 1] },
  { name: 'getUV', format: 'vec4<f32>', value: [0, 0, 1, 1] },
  { name: 'getLayout', format: 'vec2<f32>', value: [0, 0] },

  { name: 'getSDFConfig', format: 'vec4<f32>', value: [0, 0, 0, 0] },

  { name: 'getPosition', format: 'vec4<f32>', value: ZERO },
  { name: 'getPlacement', format: 'vec2<f32>', value: [0, 0] },
  { name: 'getOffset', format: 'f32', value: 0 },
  { name: 'getSize', format: 'f32', value: 1 },
  { name: 'getDepth', format: 'f32', value: 0 },
  { name: 'getColor', format: 'vec4<f32>', value: GRAY },
  { name: 'getExpand', format: 'f32', value: 0 },

] as UniformAttributeValue[];

const FRAGMENT_BINDINGS = [
  { name: 'getTexture', format: 'vec4<f32>', args: ['vec2<f32>'], value: [1.0, 1.0, 1.0, 1.0] },
] as UniformAttributeValue[];

const DEFINES = {
  HAS_EDGE_BLEED: true,
//  ALPHA_TO_COVERAGE_ENABLED: false,
  ALPHA_TO_COVERAGE_ENABLED: true,
};

const PIPELINE = {
  fragment: {
    targets: {
      0: { blend: {$set: undefined}, },
    },
  },
  multisample: {
    alphaToCoverageEnabled: true,
  },
  primitive: {
    topology: 'triangle-strip',
    stripIndexFormat: 'uint16',
  },
} as DeepPartial<GPURenderPipelineDescriptor>;

export const RawLabels: LiveComponent<RawLabelsProps> = memo((props: RawLabelsProps) => {
  const {
    pipeline: propPipeline,
    mode = RenderPassMode.Opaque,
    id = 0,
    count = 1,
  } = props;

  const vertexCount = 4;
  const instanceCount = useCallback(() => (props.indices?.length ?? resolve(count)), [props.indices, count]);

  const pipeline = useOne(() => patch(PIPELINE, propPipeline), propPipeline);
  const key = useFiber().id;

  const i = useShaderRef(props.index, props.indices);
  const r = useShaderRef(props.rectangle, props.rectangles);
  const u = useShaderRef(props.uv, props.uvs);
  const l = useShaderRef(props.layout, props.layouts);
  const a = useShaderRef(props.sdf, props.sdfs);

  const p = useShaderRef(props.position, props.positions);
  const c = useShaderRef(props.placement, props.placements);
  const o = useShaderRef(props.offset, props.offsets);
  const z = useShaderRef(props.size, props.sizes);
  const d = useShaderRef(props.depth, props.depths);
  const f = useShaderRef(props.color, props.colors);
  const e = useShaderRef(props.expand, props.expands);

  const xf = useApplyTransform(p);

  const t = props.texture;

  const [getVertex, getFragment] = useMemo(() => {
    const vertexBindings = makeShaderBindings<ShaderModule>(VERTEX_BINDINGS, [i, r, u, l, a, xf, c, o, z, d, f, e]);
    const fragmentBindings = makeShaderBindings<ShaderModule>(FRAGMENT_BINDINGS, [t]);

    const getVertex = bindBundle(getLabelVertex, bindingsToLinks(vertexBindings), null, key);
    const getFragment = bindBundle(getUIFragment, bindingsToLinks(fragmentBindings), null, key);
    return [getVertex, getFragment];
  }, [i, r, u, l, a, xf, c, o, z, d, f, e]);

  return use(Virtual, {
    vertexCount,
    instanceCount,

    getVertex,
    getFragment,

    defines: DEFINES,
    deps: null,

    renderer: 'ui',
    pipeline,
    mode,
    id,
  });
}, 'RawLabels');
