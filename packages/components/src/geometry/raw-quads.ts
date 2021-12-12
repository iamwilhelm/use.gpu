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

import { use, memo, patch, useMemo, useOne, useState, useResource } from '@use-gpu/live';
import { bindBundle, bindingsToLinks } from '@use-gpu/shader/glsl';
import { makeShaderBindings } from '@use-gpu/core';

import { getQuadVertex } from '@use-gpu/glsl/instance/vertex/quad.glsl';
import { getMaskedFragment } from '@use-gpu/glsl/mask/masked.glsl';

export type RawQuadsProps = {
  position?: number[] | TypedArray,
  size?: number[],
  color?: number[],
  perspective?: number,

  positions?: StorageSource,
  sizes?: StorageSource,
  colors?: StorageSource,
  perspectives?: StorageSource,

  getPosition?: ShaderModule,
  getSize?: ShaderModule,
  getColor?: ShaderModule,
  getPerspective?: ShaderModule,

  getMask?: ShaderModule,
  getTexture?: ShaderModule,

  count?: number,
  
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
  { name: 'getPerspective', format: 'float', value: 0 },
] as UniformAttributeValue[];

const FRAGMENT_BINDINGS = [
  { name: 'getMask', format: 'float', args: ['vec2'], value: 1 },
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

export const RawQuads: LiveComponent<RawQuadsProps> = memo((fiber) => (props) => {
  const {
    pipeline: propPipeline,
    mode = RenderPassMode.Opaque,
    id = 0,
    count = 1,
  } = props;

  const vertexCount = 4;
  const instanceCount = props.positions?.length ?? count;

  const pipeline = useOne(() => patch(PIPELINE, propPipeline), propPipeline);

  const vertexBindings = makeShaderBindings<ShaderModule>(VERTEX_BINDINGS, [
    props.positions ?? props.position ?? props.getPosition,
    props.colors ?? props.color ?? props.getColor,
    props.sizes ?? props.size ?? props.getSize,
    props.perspectives ?? props.perspective ?? props.getPerspective,
  ]);

  const fragmentBindings = makeShaderBindings<ShaderModule>(FRAGMENT_BINDINGS, [
    (mode !== RenderPassMode.Debug) ? props.getMask : null,
    props.getTexture,
  ]);

  const key = fiber.id;
  const getVertex = bindBundle(getQuadVertex, bindingsToLinks(vertexBindings), null, key);
  const getFragment = bindBundle(getMaskedFragment, bindingsToLinks(fragmentBindings), null, key);

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
}, 'RawQuads');
