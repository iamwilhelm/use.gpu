import type { LiveComponent } from '@use-gpu/live';
import type {
  TypedArray, ViewUniforms, DeepPartial, Lazy,
  UniformPipe, UniformAttribute, UniformAttributeValue, UniformType,
  VertexData, TextureSource, LambdaSource, DataBounds,
} from '@use-gpu/core';
import type { ShaderSource, ShaderModule } from '@use-gpu/shader';

import { Virtual } from './virtual';

import { use, memo, useCallback, useOne, useMemo, useNoCallback } from '@use-gpu/live';
import { bindBundle, bindingsToLinks, getBundleKey } from '@use-gpu/shader/wgsl';
import { makeShaderBindings, resolve } from '@use-gpu/core';
import { useApplyTransform } from '../hooks/useApplyTransform';
import { useShaderRef } from '../hooks/useShaderRef';
import { useBoundShader } from '../hooks/useBoundShader';
import { useDataLength } from '../hooks/useDataBinding';
import { usePickingShader } from '../providers/picking-provider';
import { usePipelineOptions, PipelineOptions } from '../hooks/usePipelineOptions';

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

  lookups?: ShaderSource,
  texture?: TextureSource | LambdaSource | ShaderModule,

  id?: number,
  count?: Lazy<number>,
} & Pick<Partial<PipelineOptions>, 'mode' | 'depthTest' | 'depthWrite' | 'alphaToCoverage' | 'blend'>;

export const RawQuads: LiveComponent<RawQuadsProps> = memo((props: RawQuadsProps) => {
  const {
    alphaToCoverage,
    depthTest,
    depthWrite,
    blend,
    mode = 'opaque',
    id = 0,
    count = 1,
  } = props;

  const vertexCount = 4;
  const instanceCount = useDataLength(count, props.positions);

  const p = useShaderRef(props.position, props.positions);
  const r = useShaderRef(props.rectangle, props.rectangles);
  const c = useShaderRef(props.color, props.colors);
  const d = useShaderRef(props.depth, props.depths);
  const z = useShaderRef(props.zBias, props.zBiases);
  const u = useShaderRef(props.uv, props.uvs);

  const l = useShaderRef(null, props.lookups);

  const m = (mode !== 'debug') ? (props.masks ?? props.mask) : null;
  const t = props.texture;
  
  const [xf, scissor, getBounds] = useApplyTransform(p);

  let bounds: Lazy<DataBounds> | null = null;
  if (getBounds && (props.positions as any)?.bounds) {
    bounds = useCallback(() => getBounds((props.positions! as any).bounds), [props.positions, getBounds]);
  }
  else {
    useNoCallback();
  }

  const getVertex = useBoundShader(getQuadVertex, [xf, scissor, r, c, d, z, u, l]);
  const getPicking = usePickingShader(props);
  const getFragment = useBoundShader(getMaskedColor, [m, t]);

  const links = useOne(() => ({getVertex, getFragment, getPicking}),
    getBundleKey(getVertex) + getBundleKey(getFragment) + +(getPicking && getBundleKey(getPicking)));

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
