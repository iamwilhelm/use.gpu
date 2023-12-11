import type { LiveComponent } from '@use-gpu/live';
import type { ShaderSource } from '@use-gpu/shader';

import { makeUseTrait, combine, shouldEqual, sameArray, sameAny } from '@use-gpu/traits/live';
import { schemaToArchetype, schemaToAttributes, accumulateChunks, generateChunkSegments } from '@use-gpu/core';
import { yeet, memo, use, useOne, useMemo } from '@use-gpu/live';
import { vec4 } from 'gl-matrix';

import { getLineSegments, useTransformContext, LINE_SCHEMA } from '@use-gpu/workbench';

//import { PointLayer } from '@use-gpu/workbench';
//import { DataContext } from '../providers/data-provider';

import {
  LinesTrait,

  LineTrait,
  ROPTrait,
  ZIndexTrait,
} from '../traits';

const Traits = combine(
  LinesTrait,

  LineTrait,
  ROPTrait,
  ZIndexTrait,
);
const useTraits = makeUseTrait(Traits);

export type LineProps = TraitProps<typeof Traits>;

export const Line: LiveComponent<LineProps> = memo((props) => {
  const parsed = useTraits(props);
  const {
      position,
      positions,
      segment,
      segments,
      color,
      colors,
      width,
      widths,
      depth,
      depths,
      zBias,
      zBiases,
      zIndex,

      ...flags
  } = parsed;

  console.log('line', {parsed});
  return;

  const transform = useTransformContext();

  const archetype = schemaToArchetype(LINE_SCHEMA, parsed, flags);
  const attributes = schemaToAttributes(LINE_SCHEMA, parsed);

  const count = positions ? (attributes.positions?.length / 4) || 0 : 1;

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
  color: sameAny,
}), 'Line');
