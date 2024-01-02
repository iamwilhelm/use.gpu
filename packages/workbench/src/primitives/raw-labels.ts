import type { LiveComponent } from '@use-gpu/live';
import type { Lazy, TextureSource, LambdaSource, DataBounds } from '@use-gpu/core';
import type { ShaderSource, ShaderModule } from '@use-gpu/shader';

import { useDraw } from '../hooks/useDraw';

import { use, memo, useCallback, useMemo, useOne, useNoCallback } from '@use-gpu/live';
import { bindBundle, bindingsToLinks, getBundleKey } from '@use-gpu/shader/wgsl';
import { resolve, BLEND_ALPHA } from '@use-gpu/core';

import { PickingSource, usePickingShader } from '../providers/picking-provider';
import { usePipelineOptions, PipelineOptions } from '../hooks/usePipelineOptions';
import { TransformContextProps } from '../providers/transform-provider';

import { useApplyTransform } from '../hooks/useApplyTransform';
import { useShaderRef } from '../hooks/useShaderRef';
import { useShader } from '../hooks/useShader';
import { useDataLength } from '../hooks/useDataBinding';

import { getLabelVertex } from '@use-gpu/wgsl/instance/vertex/label.wgsl';
import { getSDFRectangleFragment } from '@use-gpu/wgsl/instance/fragment/sdf-rectangle.wgsl';

const DEFINES = {DEBUG_SDF: false};

export type RawLabelsProps = {
  index?: number,
  indices?: ShaderSource,

  rectangle?: VectorLike,
  uv?: VectorLike,
  st?: VectorLike,
  layout?: VectorLike,
  sdf?: VectorLike,

  position?: VectorLike,
  placement?: VectorLike,
  offset?: number,
  size?: number,
  depth?: number,
  color?: VectorLike,
  expand?: number,

  rectangles?: ShaderSource,
  uvs?: ShaderSource,
  sts?: ShaderSource,
  layouts?: ShaderSource,
  sdfs?: ShaderSource,

  positions?: ShaderSource,
  placements?: ShaderSource,
  offsets?: ShaderSource,
  sizes?: ShaderSource,
  depths?: ShaderSource,
  colors?: ShaderSource,
  expands?: ShaderSource,

  transform?: TransformContextProps | ShaderModule,
  texture?: TextureSource | LambdaSource | ShaderModule,
  flip?: [number, number],

  count?: Lazy<number>,
} & PickingSource & Pick<Partial<PipelineOptions>, 'mode' | 'alphaToCoverage' | 'depthTest' | 'depthWrite' | 'blend'>;

export const RawLabels: LiveComponent<RawLabelsProps> = memo((props: RawLabelsProps) => {
  const {
    mode = 'opaque',
    alphaToCoverage = true,
    depthTest,
    depthWrite,
    blend,
    id = 0,
    count = null,
    transform,
  } = props;

  const vertexCount = 4;
  const instanceCount = useDataLength(count, props.indices);

  const i = useShaderRef(props.index, props.indices);
  const r = useShaderRef(props.rectangle, props.rectangles);
  const u = useShaderRef(props.uv, props.uvs);
  const s = useShaderRef(props.st, props.sts);
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

  const {positions, bounds: getBounds} = useApplyTransform(p, transform);

  let bounds: Lazy<DataBounds> | null = null;
  if (getBounds && (props.positions as any)?.bounds) {
    bounds = useCallback(() => {
      return getBounds((props.positions! as any).bounds);
    }, [props.positions, getBounds]);
  }
  else {
    useNoCallback();
  }

  const t = props.texture;

  const getVertex = useShader(getLabelVertex, [i, r, u, s, l, a, positions, c, o, z, d, f, e, q]);
  const getPicking = usePickingShader(props);
  const getFragment = useShader(getSDFRectangleFragment, [t], DEFINES);
  const links = useOne(() => ({getVertex, getFragment, getPicking}),
    getBundleKey(getVertex) + getBundleKey(getFragment) + (getPicking ? getBundleKey(getPicking) : 0));

  const [pipeline, defs] = usePipelineOptions({
    mode,
    topology: 'triangle-strip',
    stripIndexFormat: 'uint16',
    side: 'both',
    alphaToCoverage,
    depthTest: false,
    depthWrite: false,
    blend,
  });

  const defines: Record<string, any> = useMemo(() => ({
    ...defs,
    HAS_EDGE_BLEED: true,
    HAS_MASK: false,
    DEBUG_SDF: false,
  }), [defs]);

  return useDraw({
    vertexCount,
    instanceCount,
    bounds,

    links,
    defines,

    renderer: 'ui',
    pipeline,
    mode,
  });
}, 'RawLabels');
