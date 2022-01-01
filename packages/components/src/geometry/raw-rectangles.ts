import { LiveComponent } from '@use-gpu/live/types';
import {
  TypedArray, ViewUniforms, DeepPartial,
  UniformPipe, UniformAttribute, UniformAttributeValue, UniformType,
  VertexData, StorageSource, RenderPassMode,
} from '@use-gpu/core/types';
import { ShaderModule } from '@use-gpu/shader/types';

import { ViewContext } from '../providers/view-provider';
import { PickingContext, useNoPicking } from '../render/picking';
import { LayoutContext } from '../providers/layout-provider';
import { Virtual } from './virtual';

import { use, memo, patch, useMemo, useOne, useState, useResource } from '@use-gpu/live';
import { bindBundle, bindingsToLinks } from '@use-gpu/shader/glsl';
import { makeShaderBindings } from '@use-gpu/core';

import { getRectangleVertex } from '@use-gpu/glsl/instance/vertex/rectangle.glsl';
import { getMaskedFragment } from '@use-gpu/glsl/mask/masked.glsl';

export type RawRectanglesProps = {
  rectangle?: number[] | TypedArray,
  color?: number[] | TypedArray,
  mask?: number,
  texture?: any,

  rectangles?: StorageSource,
  colors?: StorageSource,
  masks?: number,
  textures?: StorageSource,

  getRectangle?: ShaderModule,
  getColor?: ShaderModule,
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
  { name: 'getRectangle', format: 'vec4', value: ZERO },
  { name: 'getColor', format: 'vec4', value: GRAY },
] as UniformAttributeValue[];

const FRAGMENT_BINDINGS = [
  { name: 'getMask', format: 'float', args: ['vec2'], value: 1 },
  { name: 'getTexture', format: 'vec4', args: ['vec2'], value: [1.0, 1.0, 1.0, 1.0] },
] as UniformAttributeValue[];

const DEFINES = {
  STRIP_SEGMENTS: 2,
};

const PIPELINE = {
  primitive: {
    topology: 'triangle-strip',
    stripIndexFormat: 'uint16',
  },
};

export const RawRectangles: LiveComponent<RawRectanglesProps> = (fiber) => (props) => {
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
    props.rectangles ?? props.rectangle ?? props.getRectangle,
    props.colors ?? props.color ?? props.getColor,
  ]);

  const fragmentBindings = makeShaderBindings<ShaderModule>(FRAGMENT_BINDINGS, [
    (mode !== RenderPassMode.Debug) ? (props.masks ?? props.mask ?? props.getMask) : null,
    props.getTexture,
  ]);

  const key = fiber.id;
  const getVertex = bindBundle(getRectangleVertex, bindingsToLinks(vertexBindings), null, key);
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
};
