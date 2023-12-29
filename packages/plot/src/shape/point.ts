import type { LiveComponent } from '@use-gpu/live';
import type { ShaderSource } from '@use-gpu/shader';
import type { TraitProps } from '@use-gpu/traits/live';

import { makeUseTrait, combine, shouldEqual, sameShallow } from '@use-gpu/traits/live';
import { schemaToArchetype, schemaToAttributes } from '@use-gpu/core';
import { yeet, memo, use, useOne, useMemo } from '@use-gpu/live';
import { vec4 } from 'gl-matrix';

import { useInspectHoverable, useTransformContext, POINT_SCHEMA } from '@use-gpu/workbench';

//import { PointLayer } from '@use-gpu/workbench';
//import { DataContext } from '../providers/data-provider';

import {
  PointsTrait,

  MarkerTrait,
  PositionTrait,
  PointTrait,
  ROPTrait,
  ZIndexTrait,
} from '../traits';

const Traits = combine(
  PointsTrait,

  MarkerTrait,
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
      zIndex,
      zBias,
      zBiases,

      id,
      ids,
      lookup,
      lookups,

      ...flags
  } = parsed;

  if (zIndex && !zBias) parsed.zBias = zIndex;

  const hovered = useInspectHoverable();
  if (hovered) flags.mode = "debug";

  const context = useTransformContext();
  const {transform, nonlinear, matrix: refs} = context;

  const attributes = schemaToAttributes(POINT_SCHEMA, parsed);
  const archetype = schemaToArchetype(POINT_SCHEMA, attributes, flags, refs);

  const count = positions ? (attributes.positions?.length / 4) || 0 : 1;
  if (Number.isNaN(count)) debugger;
  if (!count || !(position || positions)) return;

  const shapes = {
    point: {
      count,
      archetype,
      attributes,
      flags,
      refs,
      transform: nonlinear ?? context,
      zIndex,
    },
  };

  return yeet(shapes);
}, shouldEqual({
  position: sameShallow(sameShallow()),
  color: sameShallow(),
}), 'Point');
