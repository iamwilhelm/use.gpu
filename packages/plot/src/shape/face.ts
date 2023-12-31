import type { LiveComponent } from '@use-gpu/live';
import type { VectorLike } from '@use-gpu/traits';

import { makeUseTrait, shouldEqual, sameShallow } from '@use-gpu/traits/live';
import { schemaToArchetype, schemaToEmitters } from '@use-gpu/core';
import { yeet, memo, use, useOne, useMemo } from '@use-gpu/live';
import { vec4 } from 'gl-matrix';

import { getFaceSegments, useInspectHoverable, useTransformContext, FACE_SCHEMA, LayerReconciler } from '@use-gpu/workbench';

import { FaceTraits } from '../traits';

const {quote} = LayerReconciler;

const useTraits = makeUseTrait(FaceTraits);

export type FaceProps = TraitProps<typeof FaceTraits>;

export const RawFace: LiveComponent<FaceProps> = (props) => {

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
      indexed,
      chunks,
      groups,
      concave,

      schema: _,
      formats,
      tensor,

      segments,
      indices,
      slices,

      ...flags
  } = parsed;

  if (zIndex && zBias == null) parsed.zBias = zIndex;

  const hovered = useInspectHoverable();
  if (hovered) flags.mode = "debug";

  const context = useTransformContext();
  const {transform, nonlinear, matrix: refs} = context;

  const attributes = schemaToEmitters(FACE_SCHEMA, parsed);
  const archetype = schemaToArchetype(FACE_SCHEMA, attributes, flags, refs);

  if (Number.isNaN(count)) debugger;
  if (!count || !(position || positions)) return;

  const shapes = {
    face: {
      count,
      indexed,
      archetype,
      attributes,
      flags,
      refs,
      transform: nonlinear ?? context,
      zIndex,
    },
  };

  return quote(yeet(shapes));
};

export const Face = memo(RawFace, shouldEqual({
  position: sameShallow(sameShallow()),
  color: sameShallow(),
}), 'Face');

