import type { LiveComponent } from '@use-gpu/live';
import type {
  TypedArray, ViewUniforms, DeepPartial, Lazy,
  UniformPipe, UniformAttribute, UniformAttributeValue, UniformType,
  VertexData, LambdaSource, DataBounds,
} from '@use-gpu/core';
import type { ShaderSource, ShaderModule } from '@use-gpu/shader';

import { Virtual } from './virtual';

import { use, memo, useCallback, useOne, useMemo, useNoCallback } from '@use-gpu/live';
import { bindBundle, bindingsToLinks, chainTo } from '@use-gpu/shader/wgsl';
import { resolve } from '@use-gpu/core';

import { useApplyTransform } from '../hooks/useApplyTransform';
import { useShaderRef } from '../hooks/useShaderRef';
import { useBoundShader, useNoBoundShader } from '../hooks/useBoundShader';
import { useBoundSource, useNoBoundSource } from '../hooks/useBoundSource';
import { useDataLength } from '../hooks/useDataBinding';
import { PickingSource, usePickingShader } from '../providers/picking-provider';
import { usePipelineOptions, PipelineOptions } from '../hooks/usePipelineOptions';
import { useMaterialContext } from '../providers/material-provider';

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
  st?: number[] | TypedArray,

  positions?: ShaderSource,
  rectangles?: ShaderSource,
  colors?: ShaderSource,
  depths?: ShaderSource,
  zBiases?: ShaderSource,
  masks?: ShaderSource,
  uvs?: ShaderSource,
  sts?: ShaderSource,

  count?: Lazy<number>,
} & PickingSource & Pick<Partial<PipelineOptions>, 'mode' | 'depthTest' | 'depthWrite' | 'alphaToCoverage' | 'blend'>;

const POSITION: UniformAttribute = { format: 'vec4<f32>', name: 'getPosition' };

export const RawQuads: LiveComponent<RawQuadsProps> = memo((props: RawQuadsProps) => {
  const {
    alphaToCoverage,
    depthTest,
    depthWrite,
    blend,
    mode = 'opaque',
    id = 0,
    count = null,
  } = props;

  const vertexCount = 4;
  const instanceCount = useDataLength(count, props.positions);

  const p = useShaderRef(props.position, props.positions);
  const r = useShaderRef(props.rectangle, props.rectangles);
  const c = useShaderRef(props.color, props.colors);
  const d = useShaderRef(props.depth, props.depths);
  const z = useShaderRef(props.zBias, props.zBiases);
  const u = useShaderRef(props.uv, props.uvs);
  const s = useShaderRef(props.st, props.sts);

  const m = (mode !== 'debug') ? (props.masks ?? props.mask) : null;
  
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

  const getVertex = useBoundShader(getQuadVertex, [positions, scissor, r, c, d, z, u, s, instanceCount]);
  const getPicking = usePickingShader(props);
  const applyMask = m ? useBoundShader(getMaskedColor, [m]) : useNoBoundShader();

  const links = useMemo(() => ({
    getVertex,
    getPicking,
    ...material,
    getFragment: material.getFragment && applyMask ? chainTo(applyMask, material.getFragment) : material.getFragment,
  }), [getVertex, getPicking, applyMask, material]);

  const [pipeline, defs] = usePipelineOptions({
    mode,
    topology: 'triangle-strip',
    stripIndexFormat: 'uint16',
    side: 'both',
    alphaToCoverage,
    depthTest,
    depthWrite,
    blend,
  });

  const defines: Record<string, any> = useMemo(() => ({
    ...defs,
    HAS_EDGE_BLEED: true,
  }), [defs]);

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
}, 'RawQuads');
