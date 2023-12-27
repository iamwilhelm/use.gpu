import type { LiveComponent } from '@use-gpu/live';
import type { VectorLike } from '@use-gpu/traits';
import type { TraitProps } from '@use-gpu/traits/live';

import { makeUseTrait, combine, trait, shouldEqual, sameShallow, useProp } from '@use-gpu/traits/live';
import { yeet, memo, use, keyed, gather, provide, useContext, useOne, useFiber, useMemo } from '@use-gpu/live';
import {
  useShader, useSource, useShaderRef,
  LineLayer, ArrowLayer, useArrowSegmentsSource,
  useTransformContext,
} from '@use-gpu/workbench';
import { parseVec4, parseIntegerPositive } from '@use-gpu/parse';

import { useRangeContext } from '../providers/range-provider';
import { vec4 } from 'gl-matrix';

import {
  ArrowTrait,
  AxisTrait,
  DirectedTrait,
  LineTrait,
  LoopTrait,
  ColorTrait,
  ROPTrait,
} from '../traits';
import { getAxisPosition } from '@use-gpu/wgsl/plot/axis.wgsl';

const Traits = combine(
  ArrowTrait,
  AxisTrait,
  DirectedTrait,
  LineTrait,
  LoopTrait,
  ColorTrait,
  ROPTrait,
  trait({
    origin: parseVec4,
    detail: parseIntegerPositive,
  })
);

const useTraits = makeUseTrait(Traits);

export type AxisProps = TraitProps<typeof Traits>;

export const Axis: LiveComponent<AxisProps> = memo((props) => {
  const parsed = useTraits(props);

  const {
    axis, range,
    loop, start, end,
    origin, detail,
    ...flags
  } = parsed;

  const parentRange = useRangeContext();
  const r = range ?? parentRange[axis];

  // Calculate line origin + step
  const og = vec4.clone(origin);
  const step = vec4.create();
  const min = r[0];
  const max = r[1];
  og[axis] = min;
  step[axis] = (max - min) / detail;

  // Make axis vertex shader
  const o = useShaderRef(og);
  const s = useShaderRef(step);
  const positions = useShader(getAxisPosition, [s, o]);

  // Render as 1 arrow chunk
  const n = detail + 1;
  const [chunks, loops] = useMemo(() => [[n], loop], [n, loop]);
  const {segments, anchors, trims} = useArrowSegmentsSource(chunks, loops, start, end);

  const transform = useTransformContext();

  const {id} = useFiber();
  const element = (
    keyed(start || end ? ArrowLayer : LineLayer, id, {
      positions,
      segments,
      anchors,
      trims,
      count: n,

      ...flags,
    })
  );

  return yeet({
    layer: {
      transform,
      element,
    },
  });
}, shouldEqual({
  origin: sameShallow(),
  range: sameShallow(sameShallow()),
}), 'Axis');
