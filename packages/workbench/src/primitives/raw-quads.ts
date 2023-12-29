import type { LiveComponent } from '@use-gpu/live';
import type {
  VectorLike, ViewUniforms, DeepPartial, Lazy,
  UniformPipe, UniformAttribute, UniformType,
  VertexData, LambdaSource, DataBounds,
} from '@use-gpu/core';
import type { ShaderSource, ShaderModule } from '@use-gpu/shader';

import { useDraw } from '../hooks/useDraw';

import { use, memo, useCallback, useOne, useMemo, useNoCallback } from '@use-gpu/live';
import { bindBundle, bindingsToLinks, chainTo } from '@use-gpu/shader/wgsl';
import { resolve } from '@use-gpu/core';

import { useMaterialContext } from '../providers/material-provider';
import { PickingSource, usePickingShader } from '../providers/picking-provider';

import { useApplyTransform } from '../hooks/useApplyTransform';
import { useShaderRef } from '../hooks/useShaderRef';
import { useShader, useNoShader } from '../hooks/useShader';
import { useSource, useNoSource } from '../hooks/useSource';
import { useDataLength } from '../hooks/useDataBinding';
import { useInstancedVertex } from '../hooks/useInstancedVertex';
import { usePipelineOptions, PipelineOptions } from '../hooks/usePipelineOptions';

import { getQuadVertex } from '@use-gpu/wgsl/instance/vertex/quad.wgsl';
import { getMaskedColor } from '@use-gpu/wgsl/mask/masked.wgsl';

const POSITIONS: UniformAttribute = { format: 'vec4<f32>', name: 'getPosition' };

export type RawQuadsProps = {
  position?: VectorLike,
  rectangle?: VectorLike,
  color?: VectorLike,
  depth?: number,
  zBias?: number,
  mask?: number,
  uv?: VectorLike,
  st?: VectorLike,

  positions?: ShaderSource,
  rectangles?: ShaderSource,
  colors?: ShaderSource,
  depths?: ShaderSource,
  zBiases?: ShaderSource,
  masks?: ShaderSource,
  uvs?: ShaderSource,
  sts?: ShaderSource,

  instance?: number,
  instances?: ShaderSource,

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

    instance,
    instances,

    id = 0,
    count = null,
  } = props;

  const vertexCount = 4;
  const instanceCount = useDataLength(count, props.positions);

  const p = useSource(POSITIONS, useShaderRef(props.position, props.positions));
  const r = useShaderRef(props.rectangle, props.rectangles);
  const c = useShaderRef(props.color, props.colors);
  const d = useShaderRef(props.depth, props.depths);
  const z = useShaderRef(props.zBias, props.zBiases);
  const u = useShaderRef(props.uv, props.uvs);
  const s = useShaderRef(props.st, props.sts ?? p);

  const m = (mode !== 'debug') ? (props.masks ?? props.mask) : null;

  const {positions, scissor, bounds: getBounds} = useApplyTransform(p);

  let bounds: Lazy<DataBounds> | null = null;
  if (getBounds && (props.positions as any)?.bounds) {
    bounds = useCallback(() => getBounds((props.positions! as any).bounds), [props.positions, getBounds]);
  }
  else {
    useNoCallback();
  }

  const material = useMaterialContext().solid;

  const boundVertex = useShader(getQuadVertex, [
    positions, scissor,
    r,
    c, d, z, u, s,
    instanceCount,
  ]);
  const [getVertex, totalCount, instanceDefs] = useInstancedVertex(boundVertex, instance, instances, instanceCount);
  const getPicking = usePickingShader(props);
  const applyMask = m ? useShader(getMaskedColor, [m]) : useNoShader();

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
    ...instanceDefs,
    HAS_EDGE_BLEED: true,
  }), [defs, instanceDefs]);

  return useDraw({
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
