import type { LiveComponent } from '@use-gpu/live';
import type {
  TypedArray, ViewUniforms, DeepPartial, Lazy,
  UniformPipe, UniformAttribute, UniformAttributeValue, UniformType,
  VertexData, TextureSource, LambdaSource, RenderPassMode, DataBounds,
} from '@use-gpu/core';
import type { ShaderSource, ShaderModule } from '@use-gpu/shader';

import { Virtual } from './virtual';

import { patch } from '@use-gpu/state';
import { use, memo, useCallback, useMemo, useOne, useNoCallback } from '@use-gpu/live';
import { bindBundle, bindingsToLinks, bundleToAttributes, getBundleKey } from '@use-gpu/shader/wgsl';
import { makeShaderBindings, resolve, BLEND_ALPHA } from '@use-gpu/core';
import { useApplyTransform } from '../hooks/useApplyTransform';
import { useShaderRef } from '../hooks/useShaderRef';
import { useBoundShader } from '../hooks/useBoundShader';
import { useDataLength } from '../hooks/useDataBinding';
import { usePickingShader } from '../providers/picking-provider';

import { getLabelVertex } from '@use-gpu/wgsl/instance/vertex/label.wgsl';
import { getUIFragment } from '@use-gpu/wgsl/instance/fragment/ui.wgsl';

export type RawLabelsProps = {
  index?: number,
  indices?: ShaderSource,

  rectangle?: number[] | TypedArray,
  uv?: number[] | TypedArray,
  layout?: number[] | TypedArray,
  sdf?: number[] | TypedArray,

  position?: number[] | TypedArray,
  placement?: number[] | TypedArray,
  offset?: number,
  size?: number,
  depth?: number,
  color?: number[] | TypedArray,
  expand?: number,

  rectangles?: ShaderSource,
  uvs?: ShaderSource,
  layouts?: ShaderSource,
  sdfs?: ShaderSource,

  positions?: ShaderSource,
  placements?: ShaderSource,
  offsets?: ShaderSource,
  sizes?: ShaderSource,
  depths?: ShaderSource,
  colors?: ShaderSource,
  expands?: ShaderSource,

  texture?: TextureSource | LambdaSource | ShaderModule,
  flip?: [number, number],

  lookups?: ShaderSource,
  ids?:     ShaderSource,
  lookup?:  number,
  id?:      number,

  alphaToCoverage?: boolean,
  count?: Lazy<number>,
  pipeline?: DeepPartial<GPURenderPipelineDescriptor>,
  mode?: RenderPassMode | string,
};

const VERTEX_BINDINGS = bundleToAttributes(getLabelVertex);
const FRAGMENT_BINDINGS = bundleToAttributes(getUIFragment);

const DEFINES_ALPHA = {
  HAS_EDGE_BLEED: true,
  HAS_ALPHA_TO_COVERAGE: false,
  DEBUG_SDF: false,
};

const DEFINES_ALPHA_TO_COVERAGE = {
  HAS_EDGE_BLEED: true,
  HAS_ALPHA_TO_COVERAGE: true,
  DEBUG_SDF: false,
};

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

export const RawLabels: LiveComponent<RawLabelsProps> = memo((props: RawLabelsProps) => {
  const {
    pipeline: propPipeline,
    alphaToCoverage = true,
    mode = 'opaque',
    id = 0,
    count = 1,
  } = props;

  const vertexCount = 4;
  const instanceCount = useDataLength(count, props.indices);

  const pipeline = useMemo(() =>
    patch(alphaToCoverage
      ? PIPELINE_ALPHA_TO_COVERAGE
      : PIPELINE_ALPHA,
    propPipeline),
    [propPipeline, alphaToCoverage]);

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

  const q  = useShaderRef(props.flip);

  const [xf, scissor, getBounds] = useApplyTransform(p);

  let bounds: Lazy<DataBounds> | null = null;
  if (getBounds && props.positions?.bounds) {
    bounds = useCallback(() => {
      return getBounds(props.positions!.bounds);
    }, [props.positions, getBounds]);
  }
  else {
    useNoCallback();
  }

  const t = props.texture;

  const getVertex = useBoundShader(getLabelVertex, VERTEX_BINDINGS, [i, r, u, l, a, xf, c, o, z, d, f, e, q]);
  const getPicking = usePickingShader(props);
  const getFragment = useBoundShader(getUIFragment, FRAGMENT_BINDINGS, [t]);
  const links = useOne(() => ({getVertex, getFragment, getPicking}),
    getBundleKey(getVertex) + getBundleKey(getFragment) + +(getPicking && getBundleKey(getPicking)));

  return use(Virtual, {
    vertexCount,
    instanceCount,
    bounds,

    links,
    defines: alphaToCoverage ? DEFINES_ALPHA_TO_COVERAGE : DEFINES_ALPHA,

    renderer: 'ui',
    pipeline,
    mode,
  });
}, 'RawLabels');
