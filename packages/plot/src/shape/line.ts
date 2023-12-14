import type { LiveComponent } from '@use-gpu/live';
import type { ShaderSource } from '@use-gpu/shader';
import type { TraitProps } from '@use-gpu/traits/live';

import { makeUseTrait, combine, shouldEqual, sameShallow } from '@use-gpu/traits/live';
import { schemaToArchetype, schemaToEmitters } from '@use-gpu/core';
import { yeet, memo, use, useOne, useMemo } from '@use-gpu/live';
import { vec4 } from 'gl-matrix';

import { getLineSegments, useInspectHoverable, useTransformContext, LINE_SCHEMA } from '@use-gpu/workbench';

//import { PointLayer } from '@use-gpu/workbench';
//import { DataContext } from '../providers/data-provider';

import {
  LinesTrait,

  LineTrait,
  ROPTrait,
  StrokeTrait,
  ZIndexTrait,
} from '../traits';

const Traits = combine(
  LinesTrait,

  LineTrait,
  ROPTrait,
  StrokeTrait,
  ZIndexTrait,
);
const useTraits = makeUseTrait(Traits);

export type LineProps = TraitProps<typeof Traits>;

export const Line: LiveComponent<LineProps> = memo((props) => {
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
      chunks,
      loop,
      loops,

      segments,
      unwelds,
      ...flags
  } = parsed;

  console.log('line', {parsed, flags});

  const hovered = useInspectHoverable();
  if (hovered) flags.mode = "debug";

  const transform = useTransformContext();

  const archetype = schemaToArchetype(LINE_SCHEMA, parsed, flags);
  const attributes = schemaToEmitters(LINE_SCHEMA, parsed);

  console.log({count, attributes});
  if (!count || Number.isNaN(count)) debugger;

  const shapes = {
    line: {
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
}), 'Line');
