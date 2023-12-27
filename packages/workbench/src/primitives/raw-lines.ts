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
import { getShader, useShader, useNoShader } from '../hooks/useShader';
import { useSource, useNoSource } from '../hooks/useSource';
import { useDataLength } from '../hooks/useDataBinding';
import { useInstancedVertex } from '../hooks/useInstancedVertex';
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

  instance?: number,
  instances?: ShaderSource,

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

    instance,
    instances,

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

  const auto = useOne(() => props.segment != null ? getShader(getLineSegment, [props.segment]) : null, props.segment);

  const ps = p ? useSource(POSITION, p) : useNoSource();
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

  const boundVertex = useShader(getLineVertex, [
    positions, scissor,
    u, ss,
    g ?? auto, c, w, d, z,
    t, e,
    instanceCount,
  ]);
  const [getVertex, totalCount, instanceDefs] = useInstancedVertex(boundVertex, instance, instances, instanceCount);
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

  const defines = useMemo(() => ({
    ...defs,
    ...instanceDefs,
    LINE_JOIN_STYLE: style,
    LINE_JOIN_SIZE: segments,
  }), [defs, instanceDefs, style, segments]);

  return use(Virtual, {
    vertexCount,
    instanceCount: totalCount,
    bounds,

    links,
    defines,

    renderer: 'solid',
    pipeline,
    mode,
  });
}, 'RawLines');
