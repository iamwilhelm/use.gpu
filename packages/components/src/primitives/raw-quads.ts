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
import { makeShaderBindings, resolve } from '@use-gpu/core';
import { useApplyTransform } from '../hooks/useApplyTransform';
import { useShaderRef } from '../hooks/useShaderRef';

import { getQuadVertex } from '@use-gpu/wgsl/instance/vertex/quad.wgsl';
import { getMaskedFragment } from '@use-gpu/wgsl/mask/masked.wgsl';

export type RawQuadsProps = {
  position?: number[] | TypedArray,
  size?: number[],
  color?: number[],
  depth?: number,
  mask?: number,
  uv?: number[] | TypedArray,

  positions?: ShaderSource,
  sizes?: ShaderSource,
  colors?: ShaderSource,
  depths?: ShaderSource,
  masks?: ShaderSource,
  uvs?: ShaderSource,

  texture?: TextureSource | LambdaSource | ShaderModule,

  count?: Prop<number>,
  pipeline?: DeepPartial<GPURenderPipelineDescriptor>,
  mode?: RenderPassMode | string,
  id?: number,
};

const ZERO = [0, 0, 0, 1];
const GRAY = [0.5, 0.5, 0.5, 1];

const VERTEX_BINDINGS = [
  { name: 'getPosition', format: 'vec4<f32>', value: ZERO },
  { name: 'getColor', format: 'vec4<f32>', value: GRAY },
  { name: 'getSize', format: 'vec2<f32>', value: [1, 1] },
  { name: 'getDepth', format: 'f32', value: 0 },
  { name: 'getUV', format: 'vec4<f32>', value: [0, 0, 1, 1] },
] as UniformAttributeValue[];

const FRAGMENT_BINDINGS = [
  { name: 'getMask', format: 'f32', args: ['vec2<f32>'], value: 1 },
  { name: 'getTexture', format: 'vec4<f32>', args: ['vec2<f32>'], value: [1.0, 1.0, 1.0, 1.0] },
] as UniformAttributeValue[];

const DEFINES = {
  HAS_EDGE_BLEED: true,
};

const PIPELINE = {
  primitive: {
    topology: 'triangle-strip',
    stripIndexFormat: 'uint16',
  },
} as DeepPartial<GPURenderPipelineDescriptor>;

export const RawQuads: LiveComponent<RawQuadsProps> = memo((props: RawQuadsProps) => {
  const {
    pipeline: propPipeline,
    mode = RenderPassMode.Opaque,
    id = 0,
    count = 1,
  } = props;

  const vertexCount = 4;
  const instanceCount = useCallback(() => (props.positions?.length ?? resolve(count)), [props.positions, count]);

  const pipeline = useOne(() => patch(PIPELINE, propPipeline), propPipeline);
  const key = useFiber().id;

  const p = useShaderRef(props.positions, props.position);
  const c = useShaderRef(props.colors, props.color);
  const s = useShaderRef(props.sizes, props.size);
  const d = useShaderRef(props.depths, props.depth);
  const u = useShaderRef(props.uvs, props.uv);

  const m = (mode !== RenderPassMode.Debug) ? (props.masks ?? props.mask) : null;
  const t = props.texture;
  
  const xf = useApplyTransform(p);

  const [getVertex, getFragment] = useMemo(() => {
    const vertexBindings = makeShaderBindings<ShaderModule>(VERTEX_BINDINGS, [xf, c, s, d, u]);
    const fragmentBindings = makeShaderBindings<ShaderModule>(FRAGMENT_BINDINGS, [m, t]);

    const getVertex = bindBundle(getQuadVertex, bindingsToLinks(vertexBindings), null, key);
    const getFragment = bindBundle(getMaskedFragment, bindingsToLinks(fragmentBindings), null, key);
    return [getVertex, getFragment];
  }, [xf, c, s, d, u, m, t]);

  return use(Virtual, {
    vertexCount,
    instanceCount,

    getVertex,
    getFragment,

    defines: DEFINES,
    deps: null,

    pipeline,
    mode,
    id,
  });
}, 'RawQuads');
