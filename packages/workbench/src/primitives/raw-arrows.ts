import type { LiveComponent } from '@use-gpu/live';
import type {
  TypedArray, ViewUniforms, DeepPartial,
  UniformPipe, UniformAttribute, UniformAttributeValue, UniformType,
  VertexData, RenderPassMode,
} from '@use-gpu/core';
import type { ShaderSource } from '@use-gpu/shader';

import { Virtual } from './virtual';

import { patch } from '@use-gpu/state';
import { use, yeet, memo, useCallback, useOne } from '@use-gpu/live';
import { bindBundle, bindingsToLinks, bundleToAttributes, getBundleKey } from '@use-gpu/shader/wgsl';
import { makeShaderBindings, resolve } from '@use-gpu/core';

import { makeArrowGeometry } from './geometry/arrow';
import { RawData } from '../data/raw-data';
import { useRawSource } from '../hooks/useRawSource';
import { useApplyTransform } from '../hooks/useApplyTransform';
import { useShaderRef } from '../hooks/useShaderRef';
import { useBoundShader } from '../hooks/useBoundShader';
import { useDataLength } from '../hooks/useDataBinding';
import { usePickingShader } from '../providers/picking-provider';

import { getArrowVertex } from '@use-gpu/wgsl/instance/vertex/arrow.wgsl';
import { getPassThruColor } from '@use-gpu/wgsl/mask/passthru.wgsl';

export type RawArrowsProps = {
  anchor?: number[] | TypedArray,
  position?: number[] | TypedArray,
  color?: number[] | TypedArray,
  size?: number,
  width?: number,
  depth?: number,

  anchors?:   ShaderSource,
  positions?: ShaderSource,
  colors?:    ShaderSource,
  sizes?:     ShaderSource,
  widths?:    ShaderSource,
  depths?:    ShaderSource,

  lookups?: ShaderSource,
  ids?:     ShaderSource,
  lookup?:  number,
  id?:      number,

  detail?: number,

  count?: number,
  pipeline?: DeepPartial<GPURenderPipelineDescriptor>,
  mode?: RenderPassMode,
};

const ZERO = [0, 0, 0, 1];

const VERTEX_BINDINGS = bundleToAttributes(getArrowVertex);

const PIPELINE = {
  primitive: {
    topology: 'triangle-list',
  },
} as DeepPartial<GPURenderPipelineDescriptor>;

export const RawArrows: LiveComponent<RawArrowsProps> = memo((props: RawArrowsProps) => {
  const {
    pipeline: propPipeline,
    detail = 12,
    count = 1,
    mode = 'opaque',
    id = 0,
  } = props;
  
  const det = Math.max(4, detail);
  const geometry = useOne(() => makeArrowGeometry(det), det);

  // Set up draw
  const vertexCount = geometry.count;
  const instanceCount = useDataLength(count, props.anchors);
  
  const pipeline = useOne(() => patch(PIPELINE, propPipeline), propPipeline);

  const a = useShaderRef(props.anchor, props.anchors);
  const p = useShaderRef(props.position, props.positions);
  const c = useShaderRef(props.color, props.colors);
  const e = useShaderRef(props.size, props.sizes);
  const w = useShaderRef(props.width, props.widths);
  const d = useShaderRef(props.depth, props.depths);

  const l = useShaderRef(null, props.lookups);
  
  const g = useRawSource(geometry.attributes.positions, 'vec4<f32>');

  const [xf, scissor] = useApplyTransform(p);

  const getVertex = useBoundShader(getArrowVertex, VERTEX_BINDINGS, [g, a, xf, scissor, c, e, w, d, l]);
  const getPicking = usePickingShader(props);
  const getFragment = getPassThruColor;

  const links = useOne(() => ({getVertex, getFragment, getPicking}),
    getBundleKey(getVertex) + getBundleKey(getFragment) + +(getPicking && getBundleKey(getPicking)));

  const defines = useOne(() => ({
    HAS_ALPHA_TO_COVERAGE: false,
    HAS_SCISSOR: !!scissor,
  }), scissor);

  return (
     use(Virtual, {
      vertexCount,
      instanceCount,

      links,
      defines,

      renderer: 'solid',
      pipeline,
      mode,
    })
  );
}, 'RawArrows');


