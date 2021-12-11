import { LiveComponent } from '@use-gpu/live/types';
import {
  TypedArray, ViewUniforms, DeepPartial,
  UniformPipe, UniformAttribute, UniformAttributeValue, UniformType,
  VertexData, StorageSource, RenderPassMode,
} from '@use-gpu/core/types';
import { ShaderModule } from '@use-gpu/shader/types';

import { RawLines } from '../geometry/raw-lines';

import { use, memo, patch, useContext, useMemo, useOne, useState, useResource } from '@use-gpu/live';
import { linkBundle, bindBundle, bindingToModule, bindingsToLinks, resolveBindings, castTo } from '@use-gpu/shader/glsl';
import { makeShaderBinding, makeShaderBindings, makeDataArray, makeStorageBuffer } from '@use-gpu/core';

import { RenderContext } from '@use-gpu/components';

export type LinesProps = {
  position?: number[] | TypedArray,
  color?: number[],
  size?: number,

  positions?: StorageSource,
  colors?: StorageSource,
  sizes?: StorageSource,

  join?: 'miter' | 'round' | 'bevel',

  mode?: RenderPassMode | string,
  id?: number,
};

const SEGMENT_BINDING = { name: 'getSegment', format: 'int', value: 1, args: ['int'] } as UniformAttributeValue;

export const Lines: LiveComponent<LinesProps> = (fiber) => (props) => {
  const {device} = useContext(RenderContext);

  const {
    position,
    positions,
    color,
    colors,
    size,
    sizes,
    join,
    mode = RenderPassMode.Opaque,
    id = 0,
  } = props;

  return use(RawLines)({
    position,
    positions,
    color,
    colors,
    size,
    sizes,
    join,

    mode,
    id,
  });
};
