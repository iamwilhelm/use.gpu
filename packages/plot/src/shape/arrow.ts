import type { LiveComponent } from '@use-gpu/live';
import type { ShaderSource } from '@use-gpu/shader';
import type { VectorLike } from '@use-gpu/traits';

import { makeUseTrait, combine, shouldEqual, sameShallow } from '@use-gpu/traits/live';
import { schemaToArchetype, schemaToEmitters } from '@use-gpu/core';
import { yeet, memo, use, useOne, useMemo } from '@use-gpu/live';
import { vec4 } from 'gl-matrix';

import { getArrowSegments, useTransformContext, ARROW_SCHEMA } from '@use-gpu/workbench';

import {
  ArrowsTrait,

  ArrowTrait,
  LineTrait,
  ROPTrait,
  StrokeTrait,
  ZIndexTrait,
} from '../traits';

const Traits = combine(
  ArrowsTrait,

  ArrowTrait,
  LineTrait,
  ROPTrait,
  StrokeTrait,
  ZIndexTrait,
);
const useTraits = makeUseTrait(Traits);

export type ArrowProps = TraitProps<typeof Traits>;

export const Arrow: LiveComponent<ArrowProps> = memo((props) => {

  const parsed = useTraits(props);
  const {
      position,
      positions,
      color,
      colors,
      width,
      widths,
      depth,
      depths,
      zBias,
      zBiases,
      zIndex,

      id,
      ids,
      lookup,
      lookups,

      count,
      sparse,
      chunks,
      loop,
      loops,
      start,
      starts,
      end,
      ends,

      segments,
      anchors,
      trims,
      unwelds,
      ...flags
  } = parsed;

  console.log('arrow', {parsed, flags});

  const transform = useTransformContext();

  const archetype = schemaToArchetype(ARROW_SCHEMA, parsed, flags);
  const attributes = schemaToEmitters(ARROW_SCHEMA, parsed);

  console.log({count, attributes});
  if (!count || Number.isNaN(count)) debugger;

  const shapes = {
    arrow: {
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
  position: sameShallow(sameShallow()),
  color: sameShallow(),
}), 'Arrow');

