import type { LiveComponent } from '@use-gpu/live';
import type { ShaderSource } from '@use-gpu/shader';
import type { ColorTrait, LineTrait, ROPTrait, SurfaceTrait } from '../types';

import { use } from '@use-gpu/live';
import { SurfaceLayer } from '@use-gpu/workbench';

import { makeUseTrait, combine, trait, shouldEqual, sameShallow, useProp } from '@use-gpu/traits/live';

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

export const Surface: LiveComponent<SurfaceProps> = (props) => {
  const {side, shadow, colors} = props;

  const positions = useContext(DataContext) ?? undefined;

  const {loopX, loopY, shaded} = useSurfaceTrait(props);
  const color = useColorTrait(props);
  const rop = useROPTrait(props);

  return (
    use(SurfaceLayer, {
      positions,
      color,
      colors,
      loopX,
      loopY,
      shadow,
      shaded,
      side,
      ...rop,
    })
  );
};



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

  const {transform, nonlinear, matrix: refs} = useTransformContext();
  const scissor = useScissorContext();

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
      scissor,
      zIndex,
    },
  };
  return yeet(shapes);
}, shouldEqual({
  position: sameShallow(sameShallow()),
  color: sameShallow(),
}), 'Line');
