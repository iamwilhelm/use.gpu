import type { LiveComponent } from '@use-gpu/live';
import type { ShaderSource } from '@use-gpu/shader';

import { memo, use, useOne } from '@use-gpu/live';
import { makeUseTrait, combine, trait, optional, shouldEqual, sameShallow, useProp } from '@use-gpu/traits/live';
import { adjustSchema } from '@use-gpu/core';
import { makeParseEnum, parseNumber, parseScalarArray, parseVec4Array } from '@use-gpu/parse';
import { useInspectHoverable, Data, DualContourLayer, DUAL_CONTOUR_SCHEMA } from '@use-gpu/workbench';

import { useRangeContext, useNoRangeContext } from '../providers/range-provider';
import { ImplicitSurfaceTraits } from '../traits';

const useTraits = makeUseTrait(ImplicitSurfaceTraits);

export type ImplicitSurfaceProps = TraitProps<typeof ImplicitSurfaceTraits>;

export const ImplicitSurface: LiveComponent<ImplicitSurfaceProps> = memo((props: ImplicitSurfaceProps) => {
  const parsed = useTraits(props);

  const {
    values,
    normals,

    range,
    size,

    schema: _,
    formats,
    tensor = props.values?.size,

    zBias,
    zIndex,
    ...flags
  } = parsed;

  if (zIndex && zBias == null) parsed.zBias = zIndex;

  const hovered = useInspectHoverable();
  if (hovered) flags.mode = "debug";

  const schema = useOne(() => adjustSchema(DUAL_CONTOUR_SCHEMA, formats), formats);

  const r = range ? (useNoRangeContext(), range) : useRangeContext();

  return use(Data, {
    schema,
    data: parsed,
    tensor: size ?? tensor,
    render: (sources: Record<string, ShaderSource>) => use(DualContourLayer, {
      range: r,
      zBias: parsed.zBias,
      ...flags,
      ...sources,
    }),
  });
}, shouldEqual({
  color: sameShallow(),
}), 'ImplicitSurface');
