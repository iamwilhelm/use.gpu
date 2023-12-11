import type { LiveComponent } from '@use-gpu/live';
import type { ShaderSource } from '@use-gpu/shader';

import { makeUseTrait, combine, shouldEqual, sameArray, sameAny } from '@use-gpu/traits/live';
import { schemaToArchetype, schemaToAttributes } from '@use-gpu/core';
import { yeet, memo, use, useOne, useMemo } from '@use-gpu/live';
import { vec4 } from 'gl-matrix';

import { useTransformContext, POINT_SCHEMA } from '@use-gpu/workbench';

//import { PointLayer } from '@use-gpu/workbench';
//import { DataContext } from '../providers/data-provider';

import {
  PointsTrait,

  PositionTrait,
  PointTrait,
  ROPTrait,
  ZIndexTrait,
} from '../traits';

const Traits = combine(
  PointsTrait,

  PositionTrait,
  PointTrait,
  ROPTrait,
  ZIndexTrait,
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

      ...flags
  } = parsed;
  console.log('point', {parsed});
  
  const transform = useTransformContext();

  const archetype = schemaToArchetype(POINT_SCHEMA, parsed, flags);
  const attributes = schemaToAttributes(POINT_SCHEMA, parsed);

  const count = positions ? (attributes.positions?.length / 4) || 0 : 1;

  const shapes = {
    point: {
      count,
      archetype,
      attributes,
      flags,
      transform,
      zIndex,
    },
  };

  return yeet(shapes);
}, shouldEqual({
  position: sameArray,
  color: sameAny,
}), 'Point');
