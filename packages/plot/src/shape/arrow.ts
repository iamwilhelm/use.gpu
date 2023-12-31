import type { LiveComponent } from '@use-gpu/live';
import type { VectorLike } from '@use-gpu/traits';

import { makeUseTrait, shouldEqual, sameShallow } from '@use-gpu/traits/live';
import { schemaToArchetype, schemaToEmitters } from '@use-gpu/core';
import { yeet, memo, use, useOne, useMemo } from '@use-gpu/live';
import { vec4 } from 'gl-matrix';

import { getArrowSegments, useInspectHoverable, useTransformContext, ARROW_SCHEMA, LayerReconciler } from '@use-gpu/workbench';

import { ArrowTraits } from '../traits';

const {quote} = LayerReconciler;

const useTraits = makeUseTrait(ArrowTraits);

export type ArrowProps = TraitProps<typeof ArrowTraits>;

export const Arrow: LiveComponent<ArrowProps> = memo((props) => {

  const parsed = useTraits(props);
  const {
      position,
      positions,
      color,
      colors,
      width,
      widths,
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

      count,
      sparse,
      chunks,
      loop,
      loops,
      start,
      starts,
      end,
      ends,

      schema: _,
      formats,
      tensor,

      segments,
      slices,
      anchors,
      trims,
      unwelds,
      ...flags
  } = parsed;

  if (zIndex && zBias == null) parsed.zBias = zIndex;

  const hovered = useInspectHoverable();
  if (hovered) flags.mode = "debug";

  const context = useTransformContext();
  const {transform, nonlinear, matrix: refs} = context;

  const attributes = schemaToEmitters(ARROW_SCHEMA, parsed);
  const archetype = schemaToArchetype(ARROW_SCHEMA, attributes, flags, refs);

  if (Number.isNaN(count)) debugger;
  if (!count || !(position || positions)) return;

  const shapes = {
    arrow: {
      count,
      archetype,
      attributes,
      flags,
      refs,
      transform: nonlinear ?? context,
      zIndex,
    },
  };

  return quote(yeet(shapes));
}, shouldEqual({
  position: sameShallow(sameShallow()),
  color: sameShallow(),
}), 'Arrow');

