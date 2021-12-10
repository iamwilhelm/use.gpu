import { LiveComponent } from '@use-gpu/live/types';
import {
  TypedArray, ViewUniforms, DeepPartial,
  UniformPipe, UniformAttribute, UniformAttributeValue, UniformType,
  VertexData, StorageSource, RenderPassMode,
} from '@use-gpu/core/types';
import { ShaderModule } from '@use-gpu/shader/types';

import { ViewContext, PickingContext, useNoPicking, Virtual } from '@use-gpu/components';
import { use, memo, patch, useMemo, useOne, useState, useResource } from '@use-gpu/live';
import { bindBundle, bindingsToLinks } from '@use-gpu/shader/glsl';
import { makeShaderBindings } from '@use-gpu/core';

import { getQuadVertex } from '@use-gpu/glsl/instance/vertex/quad.glsl';
import { getMaskedFragment } from '@use-gpu/glsl/mask/masked.glsl';

export type QuadsProps = {
  position?: number[] | TypedArray,
  size?: number,
  color?: number[],

  positions?: StorageSource,
  sizes?: StorageSource,
  colors?: StorageSource,

  getMask?: ShaderModule,
  getTexture?: ShaderModule,
  
  pipeline: DeepPartial<GPURenderPipelineDescriptor>,
  mode?: RenderPassMode | string,
  id?: number,
};

const ZERO = [0, 0, 0, 1];
const GRAY = [0.5, 0.5, 0.5, 1];

const VERTEX_BINDINGS = [
  { name: 'getPosition', format: 'vec4', value: ZERO },
  { name: 'getColor', format: 'vec4', value: GRAY },
  { name: 'getSize', format: 'vec2', value: [1, 1] },
] as UniformAttributeValue[];

const FRAGMENT_BINDINGS = [
  { name: 'getMask', format: 'float', args: ['vec2'], value: 0.5 },
  { name: 'getTexture', format: 'vec4', args: ['vec2'], value: [1.0, 1.0, 1.0, 1.0] },
] as UniformAttributeValue[];

const DEFINES = {
  HAS_EDGE_BLEED: true,
  STRIP_SEGMENTS: 2,
};

const LINKS = {
  'getVertex': getQuadVertex,
};

const PIPELINE = {
  primitive: {
    topology: 'triangle-strip',
    stripIndexFormat: 'uint16',
  },
};

export const Quads: LiveComponent<QuadsProps> = memo((fiber) => (props) => {
  const {
    pipeline: propPipeline,
    mode = RenderPassMode.Opaque,
    id = 0,
  } = props;

  const vertexCount = 4;
  const instanceCount = props.positions?.length || 1;

  const pipeline = useOne(() => patch(PIPELINE, propPipeline), propPipeline);

  const vertexBindings = makeShaderBindings(VERTEX_BINDINGS, [
    props.positions ?? props.position,
    props.colors ?? props.color,
    props.sizes ?? props.size,
  ]);

  const fragmentBindings = makeShaderBindings(FRAGMENT_BINDINGS, [
    props.getMask,
    props.getTexture,
  ]);

  const key = fiber.id;
  const getVertex = bindBundle(getQuadVertex, bindingsToLinks(vertexBindings, key), null, key);
  const getFragment = bindBundle(getMaskedFragment, bindingsToLinks(fragmentBindings, key), null, key);

  return use(Virtual)({
    vertexCount,
    instanceCount,

    getVertex,
    getFragment,

    defines: DEFINES,
    deps: null,

    pipeline,
    mode,
    id,
  });
}, 'Quads');
