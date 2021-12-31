import { LiveComponent } from '@use-gpu/live/types';
import {
  TypedArray, ViewUniforms, DeepPartial,
  UniformPipe, UniformAttribute, UniformAttributeValue, UniformType,
  VertexData, StorageSource, RenderPassMode,
} from '@use-gpu/core/types';
import { ShaderModule } from '@use-gpu/shader/types';

import { RawQuads } from '../geometry/raw-quads';

import { use, memo, patch, useMemo, useOne, useState, useResource } from '@use-gpu/live';
import { linkBundle, bindBundle, bindingToModule, bindingsToLinks, resolveBindings, castTo } from '@use-gpu/shader/glsl';
import { makeShaderBinding, makeShaderBindings } from '@use-gpu/core';

import { circle, diamond, square, circleOutlined, diamondOutlined, squareOutlined } from '@use-gpu/glsl/mask/point.glsl';

export enum PointShape {
  Circle = 'circle',
  Diamond = 'diamond',
  Square = 'square',
  CircleOutlined = 'circleOutlined',
  DiamondOutlined = 'diamondOutlined',
  SquareOutlined = 'squareOutlined',
};

const MASK_SHADER = {
  [PointShape.Circle]: circle,
  [PointShape.Diamond]: diamond,
  [PointShape.Square]: square,
  [PointShape.CircleOutlined]: circleOutlined,
  [PointShape.DiamondOutlined]: diamondOutlined,
  [PointShape.SquareOutlined]: squareOutlined,
};

export type PointsProps = {
  position?: number[] | TypedArray,
  color?: number[],
  size?: number,
  perspective?: number,

  positions?: StorageSource,
  sizes?: StorageSource,
  colors?: StorageSource,
  perspectives?: StorageSource,

  shape?: PointShape,
  
  mode?: RenderPassMode | string,
  id?: number,
};

const SIZE_BINDING = { name: 'getSize', format: 'float', value: 1, args: ['int'] } as UniformAttributeValue;

export const Points: LiveComponent<PointsProps> = memo((fiber) => (props) => {
  const {
    position,
    positions,
    color,
    colors,
    size,
    sizes,
    perspective,
    perspectives,
    shape = PointShape.Circle,
    
    mode = RenderPassMode.Opaque,
    id = 0,
  } = props;

  const key = fiber.id;
  const getSizeFloat = bindingToModule(makeShaderBinding(SIZE_BINDING, sizes ?? size));
  const getSize = castTo(getSizeFloat, 'vec2', 'xx');  

  const getMask = MASK_SHADER[shape] ?? MASK_SHADER[PointShape.Circle];

  return use(RawQuads)({
    position,
    positions,
    color,
    colors,
    perspective,
    perspectives,

    getSize,
    getMask,

    mode,
    id,
  });
}, 'Points');
