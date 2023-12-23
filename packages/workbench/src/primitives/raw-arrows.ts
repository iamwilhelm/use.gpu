import type { LiveComponent } from '@use-gpu/live';
import type {
  TypedArray, ViewUniforms, DeepPartial, Lazy,
  UniformPipe, UniformAttribute, UniformAttributeValue, UniformType,
  VertexData, DataBounds,
} from '@use-gpu/core';
import type { ShaderSource } from '@use-gpu/shader';

import { Virtual } from './virtual';

import { use, yeet, memo, useCallback, useOne, useMemo, useNoMemo, useNoCallback } from '@use-gpu/live';
import { bindBundle, bindingsToLinks, getBundleKey } from '@use-gpu/shader/wgsl';
import { resolve } from '@use-gpu/core';

import { PickingSource, usePickingShader } from '../providers/picking-provider';

import { RawData } from '../data/raw-data';
import { useRawSource } from '../hooks/useRawSource';
import { useApplyTransform } from '../hooks/useApplyTransform';
import { useShaderRef } from '../hooks/useShaderRef';
import { useBoundShader, useNoBoundShader } from '../hooks/useBoundShader';
import { useBoundSource, useNoBoundSource } from '../hooks/useBoundSource';
import { useDataLength } from '../hooks/useDataBinding';
import { useInstancedVertex } from '../hooks/useInstancedVertex';
import { usePipelineOptions, PipelineOptions } from '../hooks/usePipelineOptions';

import { makeArrowFlatGeometry } from './geometry/arrow-flat';
import { makeArrowGeometry } from './geometry/arrow';

import { getArrowVertex } from '@use-gpu/wgsl/instance/vertex/arrow.wgsl';
import { getPassThruColor } from '@use-gpu/wgsl/mask/passthru.wgsl';

const POSITION: UniformAttribute = { format: 'vec4<f32>', name: 'getPosition' };

export type RawArrowsFlags = {
  flat?: boolean,
  detail?: number,
} & Pick<Partial<PipelineOptions>, 'mode' | 'alphaToCoverage' | 'depthTest' | 'depthWrite' | 'blend'>;

export type RawArrowsProps = {
  anchor?: number[] | TypedArray,
  position?: number[] | TypedArray,
  uv?: number[] | TypedArray,
  st?: number[] | TypedArray,
  color?: number[] | TypedArray,
  size?: number,
  width?: number,
  depth?: number,
  zBias?: number,

  anchors?:   ShaderSource,
  positions?: ShaderSource,
  uvs?:       ShaderSource,
  sts?:       ShaderSource,
  colors?:    ShaderSource,
  sizes?:     ShaderSource,
  widths?:    ShaderSource,
  depths?:    ShaderSource,
  zBiases?:   ShaderSource,

  instance?: number,
  instances?: ShaderSource,

  count?: number,
} & PickingSource & RawArrowsProps;

const ZERO = [0, 0, 0, 1];

export const RawArrows: LiveComponent<RawArrowsProps> = memo((props: RawArrowsProps) => {
  const {
    alphaToCoverage,
    depthTest,
    depthWrite,
    blend,
    mode = 'opaque',

    instance,
    instances,

    flat = false,
    detail = 12,
    count = null,
    id = 0,
  } = props;
  
  const det = Math.max(4, detail);
  const geometry = useMemo(() => flat ? makeArrowFlatGeometry() : makeArrowGeometry(det), [flat, det]);

  // Set up draw
  const vertexCount = geometry.count;
  const anchorCount = useDataLength(count, props.anchors);
  const positionCount = useDataLength(count, props.positions);

  const a = useShaderRef(props.anchor, props.anchors);
  const p = useShaderRef(props.position, props.positions);
  const u = useShaderRef(props.uv, props.uvs);
  const s = useShaderRef(props.st, props.sts);
  const c = useShaderRef(props.color, props.colors);
  const e = useShaderRef(props.size, props.sizes);
  const w = useShaderRef(props.width, props.widths);
  const d = useShaderRef(props.depth, props.depths);
  const z = useShaderRef(props.zBias, props.zBiases);

  const g = useRawSource(geometry.attributes.positions, 'vec4<f32>');
  const l = useShaderRef(null, props.instances);

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

  const boundVertex = useBoundShader(getArrowVertex, [
    g, a, positions, scissor,
    u, ss,
    c, e, w, d, z,
    positionCount
  ]);
  const [getVertex, totalCount, instanceDefs] = useInstancedVertex(boundVertex, instance, instances, anchorCount);
  const getPicking = usePickingShader(props);
  const getFragment = getPassThruColor;

  const links = useOne(() => ({getVertex, getFragment, getPicking}),
    getBundleKey(getVertex) + getBundleKey(getFragment) + (getPicking ? getBundleKey(getPicking) : 0));

  const [pipeline, defs] = usePipelineOptions({
    mode,
    topology: 'triangle-list',
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
    FLAT_ARROWS: flat,
  }), [defs, instanceDefs, flat]);

  return (
     use(Virtual, {
      vertexCount,
      instanceCount: totalCount,
      bounds,

      links,
      defines,

      renderer: 'solid',
      pipeline,
      mode,
    })
  );
}, 'RawArrows');


