import type { LiveComponent } from '@use-gpu/live';
import type {
  TypedArray, ViewUniforms, DeepPartial, Lazy,
  UniformPipe, UniformAttribute, UniformAttributeValue, UniformType,
  VertexData, DataBounds,
} from '@use-gpu/core';
import type { ShaderSource } from '@use-gpu/shader';

import { Virtual } from './virtual';

import { patch } from '@use-gpu/state';
import { use, yeet, memo, useCallback, useMemo, useOne, useNoCallback } from '@use-gpu/live';
import { bindBundle, bindingsToLinks, bundleToAttributes, getBundleKey } from '@use-gpu/shader/wgsl';
import { RenderPassMode, resolve, makeShaderBindings } from '@use-gpu/core';
import { useApplyTransform } from '../hooks/useApplyTransform';
import { useShaderRef } from '../hooks/useShaderRef';
import { useBoundShader } from '../hooks/useBoundShader';
import { useDataLength } from '../hooks/useDataBinding';
import { usePickingShader } from '../providers/picking-provider';

import { getLineVertex } from '@use-gpu/wgsl/instance/vertex/line.wgsl';
import { getPassThruColor } from '@use-gpu/wgsl/mask/passthru.wgsl';

export type RawLinesProps = {
  position?: number[] | TypedArray,
  segment?: number,
  color?: number[] | TypedArray,
  width?: number,
  depth?: number,
  zBias?: number,
  trim?: number[] | TypedArray,
  size?: number,

  positions?: ShaderSource,
  segments?: ShaderSource,
  colors?: ShaderSource,
  widths?: ShaderSource,
  depths?: ShaderSource,
  zBiases?: ShaderSource,
  trims?: ShaderSource,
  sizes?: ShaderSource,

  lookups?: ShaderSource,
  ids?:     ShaderSource,
  lookup?:  number,
  id?:      number,

  join?: 'miter' | 'round' | 'bevel',

  count?: Lazy<number>,
  pipeline?: DeepPartial<GPURenderPipelineDescriptor>,
  mode?: RenderPassMode | string,
  id?: number,
};

const ZERO = [0, 0, 0, 1];

const VERTEX_BINDINGS = bundleToAttributes(getLineVertex);

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
    mode = 'opaque',
  } = props;

  // Customize line shader
  let {join, depth = 0} = props;
  const j = (join! in LINE_JOIN_SIZE) ? join! : 'bevel';

  const style = LINE_JOIN_STYLE[j];
  const segments = LINE_JOIN_SIZE[j];
  const tris = (1+segments) * 2;

  // Set up draw
  const vertexCount = 2 + tris;
  const instanceCount = useDataLength(count, props.positions, -1);

  const pipeline = useOne(() => patch(PIPELINE, propPipeline), propPipeline);

  const p = useShaderRef(props.position, props.positions);
  const g = useShaderRef(props.segment, props.segments);
  const c = useShaderRef(props.color, props.colors);
  const w = useShaderRef(props.width, props.widths);
  const d = useShaderRef(props.depth, props.depths);
  const z = useShaderRef(props.zBias, props.zBiases);
  const t = useShaderRef(props.trim, props.trims);
  const e = useShaderRef(props.size, props.sizes);
  
  const l = useShaderRef(null, props.lookups);

  const [xf, scissor, getBounds] = useApplyTransform(p);

  let bounds: Lazy<DataBounds> | null = null;
  if (getBounds && props.positions?.bounds) {
    bounds = useCallback(() => getBounds(props.positions!.bounds), [props.positions, getBounds]);
  }
  else {
    useNoCallback();
  }

  const getVertex = useBoundShader(getLineVertex, VERTEX_BINDINGS, [xf, scissor, g, c, w, d, z, t, e, l]);
  const getPicking = usePickingShader(props);
  const getFragment = getPassThruColor;

  const links = useOne(() => ({getVertex, getFragment, getPicking}),
    getBundleKey(getVertex) + getBundleKey(getFragment) + +(getPicking && getBundleKey(getPicking)));

  const defines = useMemo(() => ({
    HAS_SHADOW: false,
    HAS_SCISSOR: !!scissor,
    HAS_ALPHA_TO_COVERAGE: false,
    LINE_JOIN_STYLE: style,
    LINE_JOIN_SIZE: segments,
  }), [j, scissor]);
  
  return use(Virtual, {
    vertexCount,
    instanceCount,
    bounds,

    links,
    defines,

    renderer: 'solid',
    pipeline,
    mode,
  });
}, 'RawLines');
