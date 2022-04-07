import { LiveComponent } from '@use-gpu/live/types';
import {
  TypedArray, ViewUniforms, DeepPartial,
  UniformPipe, UniformAttribute, UniformAttributeValue, UniformType,
  VertexData, StorageSource, RenderPassMode,
} from '@use-gpu/core/types';
import { ShaderModule } from '@use-gpu/shader/types';

import { ViewContext } from '../providers/view-provider';
import { PickingContext, useNoPicking } from '../render/picking';
import { Virtual } from './virtual';

import { patch } from '@use-gpu/state';
import { use, yeet, memo, useFiber, useMemo, useOne, useState, useResource } from '@use-gpu/live';
import { bindBundle, bindingsToLinks } from '@use-gpu/shader/wgsl';
import { makeShaderBindings } from '@use-gpu/core';

import { makeArrow } from './mesh/arrow';
import { RawData } from '../data/raw-data';

import { getArrowVertex } from '@use-gpu/wgsl/instance/vertex/arrow.wgsl';
import { getPassThruFragment } from '@use-gpu/wgsl/mask/passthru.wgsl';

export type RawArrowsProps = {
  anchor?: number[] | TypedArray,
  position?: number[] | TypedArray,
  color?: number[] | TypedArray,
  size?: number,
  width?: number,
  depth?: number,

  anchors?: StorageSource,
  positions?: StorageSource,
  colors?: StorageSource,
  sizes?: StorageSource,
  widths?: StorageSource,
  depths?: StorageSource,

  getAnchor?: ShaderModule,
  getPosition?: ShaderModule,
  getColor?: ShaderModule,
  getSize?: ShaderModule,
  getWidth?: ShaderModule,
  getDepth?: ShaderModule,

  detail?: number,

  count?: number,
  pipeline?: DeepPartial<GPURenderPipelineDescriptor>,
  mode?: RenderPassMode,
  id?: number,
};

const ZERO = [0, 0, 0, 1];

const VERTEX_BINDINGS = [
  { name: 'getVertex', format: 'vec4<f32>', value: ZERO },
  { name: 'getAnchor', format: 'vec4<i32>', value: [0, 1] },

  { name: 'getPosition', format: 'vec4<f32>', value: ZERO },
  { name: 'getColor', format: 'vec4<f32>', value: [0.5, 0.5, 0.5, 1] },
  { name: 'getSize', format: 'f32', value: 3 },
  { name: 'getWidth', format: 'f32', value: 1 },
  { name: 'getDepth', format: 'f32', value: 0 },
] as UniformAttributeValue[];

const PIPELINE = {
  primitive: {
    topology: 'triangle-list',
  },
} as DeepPartial<GPURenderPipelineDescriptor>;

const DEFINES: Record<string, any> = {};
const NO_DEPS: any[] = [];

export const RawArrows: LiveComponent<RawArrowsProps> = memo((props: RawArrowsProps) => {
  const {
    pipeline: propPipeline,
    detail = 12,
    count = 1,
    mode = RenderPassMode.Opaque,
    id = 0,
  } = props;
  
  const det = Math.max(4, detail);
  const mesh = useOne(() => makeArrow(det), det);

  // Set up draw
  const vertexCount = mesh.count;
  const instanceCount = ((props.anchors?.length ?? count) ?? 1);

  const pipeline = useOne(() => patch(PIPELINE, propPipeline), propPipeline);
  const key = useFiber().id;

  const a = props.anchors ?? props.anchor ?? props.getAnchor;
  const p = props.positions ?? props.position ?? props.getPosition;
  const c = props.colors ?? props.color ?? props.getColor;
  const z = props.sizes ?? props.size ?? props.getSize;
  const w = props.widths ?? props.width ?? props.getWidth;
  const d = props.depths ?? props.depth ?? props.getDepth;

  const useShader = (g: StorageSource) => {
    return useMemo(() => {
      const vertexBindings = makeShaderBindings<ShaderModule>(VERTEX_BINDINGS, [g, a, p, c, z, w, d]);

      const getVertex = bindBundle(getArrowVertex, bindingsToLinks(vertexBindings), {}, key);
      const getFragment = getPassThruFragment;

      return [getVertex, getFragment];
    }, [a, p, c, z, w, d]);
  };

  return instanceCount ? use(RawData, {
    data: mesh.vertices[0],
    format: 'vec4<f32>',
    render: (getMesh: StorageSource) => {
      const [getVertex, getFragment] = useShader(getMesh);
      return use(Virtual, {
        vertexCount,
        instanceCount,

        getVertex,
        getFragment,

        defines: DEFINES,
        deps: NO_DEPS,

        pipeline,
        mode,
        id,
      })
    },
  }) : 0;
}, 'RawArrows');


