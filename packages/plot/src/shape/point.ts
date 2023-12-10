import type { LiveComponent } from '@use-gpu/live';
import type { ShaderSource } from '@use-gpu/shader';

import { TraitProps, makeUseTrait, deep, combine } from '@use-gpu/traits/live';
import { getPluralArchetype } from '@use-gpu/core';
import { yeet, memo, use, useOne, useMemo } from '@use-gpu/live';
import { vec4 } from 'gl-matrix';

//import { PointLayer } from '@use-gpu/workbench';
//import { DataContext } from '../providers/data-provider';

import {
  ColorTrait,
  ColorsTrait,
  PositionTrait,
  PositionsTrait,
  PointTrait,
  PointsTrait,
  ROPTrait,
  ZBiasTrait,
  ZBiasesTrait,
} from '../traits';

const traits = combine(
  ColorTrait,
  ColorsTrait,
  PositionTrait,
  PositionsTrait,
  PointTrait,
  PointsTrait,
  ROPTrait,
  ZBiasTrait,
  ZBiasesTrait,
);
const useTraits = makeUseTrait(traits);

export type PointProps = TraitProps<typeof traits>;

const POINT_SCHEMA = {
  position:  {format: 'vec4<f32>', plural: 'positions'},
  color:     {format: 'vec4<f32>', plural: 'colors'},
  size:      {format: 'f32', plural: 'sizes'},
  depth:     {format: 'f32', plural: 'depths'},
  zBias:     {format: 'f32', plural: 'zBiases'},
};

export const Point: LiveComponent<PointProps> = memo((props) => {
  const {
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
    shape,

    ...flags
  } = useTraits(props);

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

Point({
  size: 5,
  color: '#ffffff',
});