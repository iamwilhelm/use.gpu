import type { LiveComponent } from '@use-gpu/live';
import type {
  TypedArray, ViewUniforms, DeepPartial, Lazy,
  UniformPipe, UniformAttribute, UniformAttributeValue, UniformType,
  VertexData, DataBounds,
} from '@use-gpu/core';
import type { ShaderSource } from '@use-gpu/shader';

import { Virtual } from './virtual';

import { use, yeet, memo, useCallback, useMemo, useOne, useNoCallback } from '@use-gpu/live';
import { bindBundle, bindingsToLinks } from '@use-gpu/shader/wgsl';
import { resolve } from '@use-gpu/core';

import { useMaterialContext } from '../providers/material-provider';
import { PickingSource, usePickingShader } from '../providers/picking-provider';

import { useApplyTransform } from '../hooks/useApplyTransform';
import { getBoundShader, useBoundShader, useNoBoundShader } from '../hooks/useBoundShader';
import { useBoundSource, useNoBoundSource } from '../hooks/useBoundSource';
import { useDataLength } from '../hooks/useDataBinding';
import { useInstanceCount, useNoInstanceCount } from '../hooks/useInstanceCount';
import { usePipelineOptions, PipelineOptions } from '../hooks/usePipelineOptions';
import { useShaderRef } from '../hooks/useShaderRef';

import { getLineSegment } from '@use-gpu/wgsl/geometry/segment.wgsl';
import { getLineVertex } from '@use-gpu/wgsl/instance/vertex/line.wgsl';
import { getInstancedIndex } from '@use-gpu/wgsl/instance/instanced-index.wgsl';

export type RawLinesFlags = {
  join?: 'miter' | 'round' | 'bevel',
} & Pick<Partial<PipelineOptions>, 'mode' | 'alphaToCoverage' | 'depthTest' | 'depthWrite' | 'blend'>;

export type RawLinesProps = {
  position?: number[] | TypedArray,
  segment?: number,
  uv?: number[] | TypedArray,
  st?: number[] | TypedArray,
  color?: number[] | TypedArray,
  width?: number,
  depth?: number,
  zBias?: number,
  trim?: number[] | TypedArray,
  size?: number,

  positions?: ShaderSource,
  segments?: ShaderSource,
  uvs?: ShaderSource,
  sts?: ShaderSource,
  colors?: ShaderSource,
  widths?: ShaderSource,
  depths?: ShaderSource,
  zBiases?: ShaderSource,
  trims?: ShaderSource,
  sizes?: ShaderSource,

  instances?: ShaderSource,
  mappedInstances?: boolean,

  count?: Lazy<number>,
} & PickingSource & RawLinesFlags;

const ZERO = [0, 0, 0, 1];
const POSITION: UniformAttribute = { format: 'vec4<f32>', name: 'getPosition' };

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

export const RawLines: LiveComponent<RawLinesProps> = memo((props: RawLinesProps) => {
  const {
    mode = 'opaque',
    alphaToCoverage,
    depthTest,
    depthWrite,
    blend,

    instances,
    mappedInstances,

    count = null,
    depth = 0,
    join,
  } = props;

  // Customize line shader
  const j = (join! in LINE_JOIN_SIZE) ? join! : 'bevel';

  const style = LINE_JOIN_STYLE[j];
  const segments = LINE_JOIN_SIZE[j];
  const tris = (1+segments) * 2;

  // Set up draw
  const vertexCount = 2 + tris;
  const instanceCount = useDataLength(count, props.positions, -1);

  // Instanced draw (repeated or random access)
  const [instanceSize, totalCount] = useInstanceCount(instances, instanceCount, mappedInstances);
  const mappedIndex = instances
    ? useBoundShader(getInstancedIndex, [instanceSize])
    : useNoBoundShader();

  const p = useShaderRef(props.position, props.positions);
  const u = useShaderRef(props.uv, props.uvs);
  const s = useShaderRef(props.st, props.sts);
  const g = useShaderRef(null, props.segments);
  const c = useShaderRef(props.color, props.colors);
  const w = useShaderRef(props.width, props.widths);
  const d = useShaderRef(props.depth, props.depths);
  const z = useShaderRef(props.zBias, props.zBiases);
  const t = useShaderRef(props.trim, props.trims);
  const e = useShaderRef(props.size, props.sizes);
  
  const i = useShaderRef(null, props.indices);
  const l = useShaderRef(null, props.instances);
  const k = useShaderRef(instanceSize);

  const auto = useOne(() => props.segment != null ? getBoundShader(getLineSegment, [props.segment]) : null, props.segment);

  const ps = p ? useBoundSource(POSITION, p) : useNoBoundSource();
  const ss = props.sts == null ? ps : s;

  const {positions, scissor, bounds: getBounds} = useApplyTransform(ps);

  let bounds: Lazy<DataBounds> | null = null;
  if (getBounds && (props.positions as any)?.bounds) {
    bounds = useCallback(() => getBounds((props.positions! as any).bounds), [props.positions, getBounds]);
  }
  else {
    useNoCallback();
  }

  const material = useMaterialContext().solid;

  const getVertex = useBoundShader(getLineVertex, [
    l, mappedIndex, instanceCount,
    positions, scissor,
    u, ss,
    g ?? auto, c, w, d, z,
    t, e,
  ]);
  const getPicking = usePickingShader(props);

  const links = useMemo(() => ({
    getVertex,
    getPicking,
    ...material,
  }), [getVertex, getPicking, material]);

  const [pipeline, defs] = usePipelineOptions({
    mode,
    topology: 'triangle-strip',
    stripIndexFormat: 'uint16',
    side: 'both',
    scissor,
    alphaToCoverage,
    depthTest,
    depthWrite,
    blend,
  });

  const hasInstances = !!props.instances;
  const defines = useMemo(() => ({
    ...defs,
    HAS_INSTANCES: hasInstances,
    LINE_JOIN_STYLE: style,
    LINE_JOIN_SIZE: segments,
  }), [defs, hasInstances, style, segments]);
  
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
