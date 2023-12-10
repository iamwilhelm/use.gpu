import type { LiveComponent } from '@use-gpu/live';
import type { ShaderSource } from '@use-gpu/shader';
import type { VectorLike } from '@use-gpu/traits';
import type { XY } from '@use-gpu/core';
import type { ColorTrait, ColorsTrait, PointTrait, PointsTrait, ROPTrait } from '../types';

import { getPluralArchetype } from '@use-gpu/core';
import { memo, use, useOne, useMemo } from '@use-gpu/live';
import { deep } from '@use-gpu/traits';

//import { PointLayer } from '@use-gpu/workbench';
//import { DataContext } from '../providers/data-provider';

import {
  useColorTrait,
  useColorsTrait,
  usePointTrait,
  usePointsTrait,
  useROPTrait,
} from '../traits';
import { vec4 } from 'gl-matrix';

export type PointProps =
  Partial<ColorTrait> &
  Partial<ColorsTrait> &
  Partial<PointTrait> &
  Partial<PointsTrait> &
  Partial<ROPTrait> & {

  stroke?: number,
};

const POINT_SCHEMA = {
  position:  {format: 'vec4<f32>', plural: 'positions'},
  color:     {format: 'vec4<f32>', plural: 'colors'},
  size:      {format: 'f32', plural: 'sizes'},
  depth:     {format: 'f32', plural: 'depths'},
  zBias:     {format: 'f32', plural: 'zBiases'},
};

export const Point: LiveComponent<PointProps> = memo((props) => {
  const {stroke} = props;

  const {size, depth, shape} = usePointTrait(props);
  const {point: position, points: positions, sizes, depths} = usePointsTrait(props);
  const color = useColorTrait(props);
  const colors = useColorsTrait(props);
  const rop = useROPTrait(props);

  const attributes = {
    position,
    positions,
    color,
    colors,
    size,
    sizes,
    depth,
    depths,
    zBias,
    zBiases,
  };
  const flags = {stroke, ...rop};
  const archetype = getPluralArchetype(POINT_SCHEMA, props, flags);

  const shapes = {
    point: {
      archetype,
      attributes,
      flags,
    },
  };

  return yeet(shapes);
}, deep('point', 'color'), 'Point');
