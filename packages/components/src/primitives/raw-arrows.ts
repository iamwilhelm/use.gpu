import { LiveComponent } from '@use-gpu/live/types';
import {
  TypedArray, ViewUniforms, DeepPartial,
  UniformPipe, UniformAttribute, UniformAttributeValue, UniformType,
  VertexData, StorageSource, LambdaSource, RenderPassMode,
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
import { useRawStorage } from '../hooks/useRawStorage';
import { useApplyTransform } from '../hooks/useApplyTransform';

import { getArrowVertex } from '@use-gpu/wgsl/instance/vertex/arrow.wgsl';
import { getPassThruFragment } from '@use-gpu/wgsl/mask/passthru.wgsl';

export type RawArrowsProps = {
  anchor?: number[] | TypedArray,
  position?: number[] | TypedArray,
  color?: number[] | TypedArray,
  size?: number,
  width?: number,
  depth?: number,

  anchors?:   StorageSource | LambdaSource | ShaderModule,
  positions?: StorageSource | LambdaSource | ShaderModule,
  colors?:    StorageSource | LambdaSource | ShaderModule,
  sizes?:     StorageSource | LambdaSource | ShaderModule,
  widths?:    StorageSource | LambdaSource | ShaderModule,
  depths?:    StorageSource | LambdaSource | ShaderModule,

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

  const a = props.anchors ?? props.anchor;
  const p = props.positions ?? props.position;
  const c = props.colors ?? props.color;
  const z = props.sizes ?? props.size;
  const w = props.widths ?? props.width;
  const d = props.depths ?? props.depth;
  
  const g = useRawStorage(mesh.vertices[0], 'vec4<f32>');
  const xf = useApplyTransform(p);

  const [getVertex, getFragment] = useMemo(() => {
    const vertexBindings = makeShaderBindings<ShaderModule>(VERTEX_BINDINGS, [g, a, xf, c, z, w, d]);

    const getVertex = bindBundle(getArrowVertex, bindingsToLinks(vertexBindings), {}, key);
    const getFragment = getPassThruFragment;

    return [getVertex, getFragment];
  }, [g, a, xf, c, z, w, d]);

  return instanceCount ? (
     use(Virtual, {
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
  ) : null;
}, 'RawArrows');


