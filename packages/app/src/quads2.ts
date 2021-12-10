import { LiveComponent } from '@use-gpu/live/types';
import {
  TypedArray, ViewUniforms, DeepPartial,
  UniformPipe, UniformAttribute, UniformAttributeValue, UniformType,
  VertexData, StorageSource, RenderPassMode,
} from '@use-gpu/core/types';
import { ParsedBundle, ParsedModule } from '@use-gpu/shader/types';

import { ViewContext, PickingContext, useNoPicking, Virtual2 } from '@use-gpu/components';
import { use, memo, patch, useMemo, useOne, useState, useResource } from '@use-gpu/live';
import { bindBundle, linkBundle, resolveBindings, bindingsToLinks } from '@use-gpu/shader/glsl';
import { makeShaderBindings } from '@use-gpu/core';

import { getQuadVertex } from '@use-gpu/glsl/instance/vertex/quad.glsl';

export type QuadsProps = {
  position?: number[] | TypedArray,
  size?: number,
  color?: number[],

  positions?: StorageSource,
  sizes?: StorageSource,
  colors?: StorageSource,

  getMask?: ParsedBundle | ParsedModule,
  getTexture?: ParsedBundle | ParsedModule,
  
  pipeline: DeepPartial<GPURenderPipelineDescriptor>,
  mode?: RenderPassMode | string,
  id?: number,
};

const ZERO = [0, 0, 0, 1];
const GRAY = [0.5, 0.5, 0.5, 1];

const ATTRIBUTES = [
  { name: 'getPosition', format: 'vec4', value: ZERO },
  { name: 'getColor', format: 'vec4', value: GRAY },
  { name: 'getSize', format: 'vec2', value: [1, 1] },
] as UniformAttributeValue[];

const LAMBDAS = [
  { name: 'getMask', format: 'float', args: ['vec2'], value: 0.5 },
  { name: 'getTexture', format: 'vec4', args: ['vec2'], value: [1.0, 1.0, 1.0, 1.0] },
] as UniformAttributeValue[];

const BINDINGS = [
  ...ATTRIBUTES,
  ...LAMBDAS,
];

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

  const vertexBindings = makeShaderBindings(
    ATTRIBUTES,
    [
      props.positions ?? props.position,
      props.colors ?? props.color,
      props.sizes ?? props.size,
    ],
  );

  const fragmentBindings = makeShaderBindings(
    LAMBDAS,
    [
      props.getMask,
      props.getTexture,
    ],
  );

  const getVertex = bindBundle(getQuadVertex, bindingsToLinks(vertexBindings), {}, 'quad');
  const {getMask, getTexture} = bindingsToLinks(fragmentBindings);

  const {
    pipeline: propPipeline,
    mode = RenderPassMode.Opaque,
    id = 0,
  } = props;

  const vertexCount = 4;
  const instanceCount = props.positions?.length || 1;

  const pipeline = useOne(() => patch(PIPELINE, propPipeline), propPipeline);

  return use(Virtual2)({
    vertexCount,
    instanceCount,

    getVertex,

    defines: DEFINES,
    deps: null,

    pipeline,
    mode,
    id,
  });
}, 'Quads');
