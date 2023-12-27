import type { LiveComponent } from '@use-gpu/live';
import type { ShaderSource } from '@use-gpu/shader';
import type { TraitProps } from '@use-gpu/traits/live';

import { makeUseTrait, combine, shouldEqual, sameShallow } from '@use-gpu/traits/live';
import { schemaToArchetype, schemaToEmitters } from '@use-gpu/core';
import { yeet, memo, keyed, useOne, useMemo } from '@use-gpu/live';
import { vec4 } from 'gl-matrix';

import { getLineSegments, useInspectHoverable, useTransformContext, LINE_SCHEMA } from '@use-gpu/workbench';

import { LineLayer } from '@use-gpu/workbench';

import {
  LinesTrait,

  DataContextTrait,
  ROPTrait,
  StrokeTrait,
  ZIndexTrait,
} from '../traits';

const Traits = combine(
  LinesTrait,

  DataContextTrait,
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
      zIndex,
      zBias,
      zBiases,

      id,
      ids,
      lookup,
      lookups,

      count,
      chunks,
      loop,
      loops,

      schema,
      tensor,
      segments,
      slices,
      unwelds,

      data,
      ...flags
  } = parsed;

  if (zIndex && !zBias) parsed.zBias = zIndex;

  const hovered = useInspectHoverable();
  if (hovered) flags.mode = "debug";

  const context = useTransformContext();
  const {transform, nonlinear, matrix: refs} = context;

  const attributes = schemaToEmitters(LINE_SCHEMA, parsed);
  const archetype = schemaToArchetype(LINE_SCHEMA, attributes, flags, refs);

  if (Number.isNaN(count)) debugger;
  if (!count) return;

  const shapes = {
    line: {
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
}), 'Line');
