import type { LiveComponent } from '@use-gpu/live';
import type { TraitProps } from '@use-gpu/traits/live';

import { makeUseTrait, shouldEqual, sameShallow } from '@use-gpu/traits/live';
import { schemaToArchetype, schemaToEmitters, adjustSchema } from '@use-gpu/core';
import { yeet, memo, keyed, useOne, useMemo } from '@use-gpu/live';
import { vec4 } from 'gl-matrix';

import { getLineSegments, useInspectHoverable, useTransformContext, useScissorContext, LineLayer, LINE_SCHEMA, LayerReconciler } from '@use-gpu/workbench';

import { LineTraits } from '../traits';

const {quote} = LayerReconciler;

const useTraits = makeUseTrait(LineTraits);

export type LineProps = TraitProps<typeof Traits>;

export const RawLine: LiveComponent<LineProps> = (props) => {
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

      schema: _,
      formats,
      tensor,

      segments,
      slices,
      unwelds,

      sources,
      ...flags
  } = parsed;

  if (zIndex && zBias == null) parsed.zBias = zIndex;

  const hovered = useInspectHoverable();
  if (hovered) flags.mode = "debug";

  const scissor = useScissorContext();
  const context = useTransformContext();
  const {transform, nonlinear, matrix: refs} = context;

  const schema = useOne(() => adjustSchema(LINE_SCHEMA, formats), formats);
  const attributes = schemaToEmitters(schema, parsed);
  const archetype = schemaToArchetype(schema, attributes, flags, refs, sources);

  if (Number.isNaN(count)) debugger;
  if (!count || !(position || positions)) return;

  const shapes = {
    line: {
      count,
      archetype,
      attributes,
      flags,
      refs,
      schema: formats ? schema : undefined,
      scissor,
      sources,
      transform: nonlinear ?? context,
      zIndex,
    },
  };
  return quote(yeet(shapes));
};

export const Line = memo(RawLine, shouldEqual({
  position: sameShallow(sameShallow()),
  color: sameShallow(),
}), 'Line');
