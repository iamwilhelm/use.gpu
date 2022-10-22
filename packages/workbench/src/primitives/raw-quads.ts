import type { LiveComponent } from '@use-gpu/live';
import type {
  TypedArray, ViewUniforms, DeepPartial, Lazy,
  UniformPipe, UniformAttribute, UniformAttributeValue, UniformType,
  VertexData, TextureSource, LambdaSource, RenderPassMode,
} from '@use-gpu/core';
import type { ShaderSource, ShaderModule } from '@use-gpu/shader';

import { ViewContext } from '../providers/view-provider';
import { Virtual } from './virtual';

import { patch } from '@use-gpu/state';
import { use, memo, useCallback, useOne, useMemo } from '@use-gpu/live';
import { bindBundle, bindingsToLinks, bundleToAttributes } from '@use-gpu/shader/wgsl';
import { makeShaderBindings, resolve } from '@use-gpu/core';
import { useApplyTransform } from '../hooks/useApplyTransform';
import { useShaderRef } from '../hooks/useShaderRef';
import { useBoundShader } from '../hooks/useBoundShader';
import { useDataLength } from '../hooks/useDataBinding';

import { getQuadVertex } from '@use-gpu/wgsl/instance/vertex/quad.wgsl';
import { getMaskedColor } from '@use-gpu/wgsl/mask/masked.wgsl';

export type RawQuadsProps = {
  position?: number[] | TypedArray,
  rectangle?: number[] | TypedArray,
  color?: number[] | TypedArray,
  depth?: number,
  zBias?: number,
  mask?: number,
  uv?: number[] | TypedArray,

  positions?: ShaderSource,
  rectangles?: ShaderSource,
  colors?: ShaderSource,
  depths?: ShaderSource,
  zBiases?: ShaderSource,
  masks?: ShaderSource,
  uvs?: ShaderSource,

  texture?: TextureSource | LambdaSource | ShaderModule,

  alphaToCoverage?: boolean,
  count?: Lazy<number>,
  pipeline?: DeepPartial<GPURenderPipelineDescriptor>,
  mode?: RenderPassMode | string,
  id?: number,
};

const VERTEX_BINDINGS = bundleToAttributes(getQuadVertex);
const FRAGMENT_BINDINGS = bundleToAttributes(getMaskedColor);

const DEFINES_ALPHA = {
  HAS_EDGE_BLEED: true,
  HAS_ALPHA_TO_COVERAGE: false,
} as Record<string, any>;

const DEFINES_ALPHA_TO_COVERAGE = {
  HAS_EDGE_BLEED: true,
  HAS_ALPHA_TO_COVERAGE: true,
} as Record<string, any>;

const PIPELINE_ALPHA = {
  primitive: {
    topology: 'triangle-strip',
    stripIndexFormat: 'uint16',
  },
} as DeepPartial<GPURenderPipelineDescriptor>;

const PIPELINE_ALPHA_TO_COVERAGE = {
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

const PIPELINE = {
  primitive: {
    topology: 'triangle-strip',
    stripIndexFormat: 'uint16',
  },
} as DeepPartial<GPURenderPipelineDescriptor>;

export const RawQuads: LiveComponent<RawQuadsProps> = memo((props: RawQuadsProps) => {
  const {
    pipeline: propPipeline,
    alphaToCoverage = true,
    mode = 'opaque',
    id = 0,
    count = 1,
  } = props;

  const vertexCount = 4;
  const instanceCount = useDataLength(count, props.positions);

  const pipeline = useMemo(() =>
    patch(alphaToCoverage
      ? PIPELINE_ALPHA_TO_COVERAGE
      : PIPELINE_ALPHA,
    propPipeline),
    [propPipeline, alphaToCoverage]);

  const p = useShaderRef(props.position, props.positions);
  const r = useShaderRef(props.rectangle, props.rectangles);
  const c = useShaderRef(props.color, props.colors);
  const d = useShaderRef(props.depth, props.depths);
  const z = useShaderRef(props.zBias, props.zBiases);
  const u = useShaderRef(props.uv, props.uvs);

  const m = (mode !== 'debug') ? (props.masks ?? props.mask) : null;
  const t = props.texture;
  
  const [xf, scissor] = useApplyTransform(p);
  
  const getVertex = useBoundShader(getQuadVertex, VERTEX_BINDINGS, [xf, scissor, r, c, d, z, u]);
  const getFragment = useBoundShader(getMaskedColor, FRAGMENT_BINDINGS, [m, t]);

  const defines = useOne(() => (
    patch(alphaToCoverage ? DEFINES_ALPHA_TO_COVERAGE : DEFINES_ALPHA, {HAS_SCISSOR: !!scissor})
  ), scissor);

  return use(Virtual, {
    vertexCount,
    instanceCount,

    getVertex,
    getFragment,

    defines,

    pipeline,
    mode,
    id,
  });
}, 'RawQuads');
