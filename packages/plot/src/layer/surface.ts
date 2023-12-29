import type { LiveComponent } from '@use-gpu/live';
import type { ShaderSource } from '@use-gpu/shader';

import { memo, use, useOne } from '@use-gpu/live';
import { makeUseTrait, combine, trait, shouldEqual, sameShallow, useProp } from '@use-gpu/traits/live';
import { adjustSchema } from '@use-gpu/core';
import { useInspectHoverable, Data, SurfaceLayer, SURFACE_SCHEMA } from '@use-gpu/workbench';

import {
  SurfaceTrait,

  ColorTrait,
  FaceTrait,
  ROPTrait,
  StrokeTrait,
  ZIndexTrait,
} from '../traits';

const Traits = combine(
  SurfaceTrait,

  ColorTrait,
  FaceTrait,
  ROPTrait,
  StrokeTrait,
  ZIndexTrait,
);

const useTraits = makeUseTrait(Traits);

export type SurfaceProps = TraitProps<typeof Traits>;

export const Surface: LiveComponent<SurfaceProps> = memo((props) => {
  const parsed = useTraits(props);
  const {
      position,
      positions,
      color,
      colors,
      zIndex,
      zBias,
      zBiases,

      id,
      ids,
      lookup,
      lookups,

      size,
      tensor,
      formats,
      ...flags
  } = parsed;

  if (zIndex && !zBias) parsed.zBias = zIndex;

  const hovered = useInspectHoverable();
  if (hovered) flags.mode = "debug";

  const schema = useOne(() => adjustSchema(SURFACE_SCHEMA, formats), formats);

  return use(Data, {
    schema,
    data: parsed,
    tensor: size ?? tensor,
    render: (sources: Record<string, ShaderSource>) => use(SurfaceLayer, {
      ...flags,
      ...sources,
      size: size ?? tensor,
      color,
      zBias,
      id,
      lookup,
    }),
  });
}, shouldEqual({
  color: sameShallow(),
}), 'Surface');
