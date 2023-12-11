import type { LiveComponent } from '@use-gpu/live';
import type { ShaderSource } from '@use-gpu/shader';

import { makeUseTrait, combine, shouldEqual, sameArray, sameAny } from '@use-gpu/traits/live';
import { schemaToArchetype, schemaToAttributes } from '@use-gpu/core';
import { yeet, memo, use, useOne, useMemo } from '@use-gpu/live';
import { vec4 } from 'gl-matrix';

import { POINT_SCHEMA } from '@use-gpu/workbench';

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

const Traits = combine(
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
const useTraits = makeUseTrait(Traits);

export type PointProps = TraitProps<typeof Traits>;

export const Point: LiveComponent<PointProps> = memo((props) => {
  const parsed = useTraits(props);
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
      zIndex,
      shape,
      ...flags
  } = parsed;

  console.log({parsed})
  const archetype = schemaToArchetype(POINT_SCHEMA, parsed, flags);
  const attributes = schemaToAttributes(POINT_SCHEMA, parsed);

  const shapes = {
    point: {
      count: 1,
      archetype,
      attributes,
      flags,
      zIndex,
    },
  };

  return yeet(shapes);
}, shouldEqual({
  point: sameArray,
  color: sameAny,
}), 'Point');
