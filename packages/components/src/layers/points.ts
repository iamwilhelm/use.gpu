import { LiveComponent } from '@use-gpu/live/types';
import {
  TypedArray, ViewUniforms, DeepPartial,
  UniformPipe, UniformAttribute, UniformAttributeValue, UniformType,
  VertexData, StorageSource, RenderPassMode,
} from '@use-gpu/core/types';
import { ShaderModule } from '@use-gpu/shader/types';

import { ViewContext } from '../provider/view-provider';
import { PickingContext, useNoPicking } from '../render/picking';
import { RawQuads } from '../geometry/raw-quads';

import { use, memo, patch, useMemo, useOne, useState, useResource } from '@use-gpu/live';
import { linkBundle, bindBundle, bindingToModule, bindingsToLinks, bundleToUniform, resolveBindings, castTo } from '@use-gpu/shader/glsl';
import { makeShaderBinding, makeShaderBindings } from '@use-gpu/core';

import { circle, diamond, square, circleOutlined, diamondOutlined, squareOutlined } from '@use-gpu/glsl/mask/point.glsl';

import { getQuadVertex } from '@use-gpu/glsl/instance/vertex/quad.glsl';
import { getMaskedFragment } from '@use-gpu/glsl/mask/masked.glsl';

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
  size?: number,
  color?: number[],

  positions?: StorageSource,
  sizes?: StorageSource,
  colors?: StorageSource,

  shape?: PointShape,
  
  mode?: RenderPassMode | string,
  id?: number,
};

const SIZE_BINDING = { name: 'getSize', format: 'float', value: 1, args: ['int'] };

export const Points: LiveComponent<PointsProps> = memo((fiber) => (props) => {
  const {
    position,
    positions,
    size,
    sizes,
    color,
    colors,
    shape,
    
    mode = RenderPassMode.Opaque,
    id = 0,
  } = props;

  const key = fiber.id;
  const getSizeFloat = bindingToModule(makeShaderBinding(SIZE_BINDING, sizes ?? size), fiber.id);
  const getSize = castTo(getSizeFloat, 'vec2', 'xx');  

  const getMask = MASK_SHADER[shape ?? PointShape.Circle]; 

  return use(RawQuads)({
    position,
    positions,
    color,
    colors,

    getSize,

    mode,
    id,
  });
}, 'Points');
