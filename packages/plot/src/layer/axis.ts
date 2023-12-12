import type { LiveComponent } from '@use-gpu/live';
import type { VectorLike } from '@use-gpu/traits';
import type { TraitProps } from '@use-gpu/traits/live';

import { makeUseTrait, optional, combine, shouldEqual, sameArray, sameAny, useProp } from '@use-gpu/traits/live';
import { memo, use, gather, provide, useContext, useOne, useMemo } from '@use-gpu/live';
import {
  useBoundShader, useBoundSource, useShaderRef,
  LineLayer, ArrowLayer, useArrowSegmentsSource,
} from '@use-gpu/workbench';
import { parseVec4, parseIntegerPositive } from '@use-gpu/parse';

import { RangeContext } from '../providers/range-provider';
import { vec4 } from 'gl-matrix';

import {
  ArrowTrait,
  AxisTrait,
  LineTrait,
  LoopTrait,
  ColorTrait,
  ROPTrait,
} from '../traits';
import { getAxisPosition } from '@use-gpu/wgsl/plot/axis.wgsl';

const Traits = combine(
  ArrowTrait,
  AxisTrait,
  LineTrait,
  LoopTrait,
  ColorTrait,
  ROPTrait,
);

const useTraits = makeUseTrait(Traits);

export type AxisProps =
  TraitProps<typeof Traits>
& {
  origin?: VectorLike,
  detail?: number,
};

export const Axis: LiveComponent<AxisProps> = (props) => {
  const {
    origin,
    detail,
  } = props;

  const {
    axis, range,
    loop, start, end,
    color,
    ...flags
  } = useTraits(props);

  const p = useProp(origin, parseVec4);
  const d = useProp(detail, parseIntegerPositive);

  const parentRange = useContext(RangeContext);
  const r = range ?? parentRange[axis];

  // Calculate line origin + step
  const og = vec4.clone(p as any);
  const step = vec4.create();
  const min = r[0];
  const max = r[1];
  og[axis] = min;
  step[axis] = (max - min) / d;

  // Make axis vertex shader
  const o = useShaderRef(og);
  const s = useShaderRef(step);
  const positions = useBoundShader(getAxisPosition, [s, o]);

  // Render as 1 arrow chunk
  const n = d + 1;
  const [chunks, loops] = useMemo(() => [[n], loop], [n, loop]);
  const {segments, anchors, trims} = useArrowSegmentsSource(chunks, loops, start, end);

  return ({
    layer: (
      use(start || end ? ArrowLayer : LineLayer, {
        positions,
        segments,
        anchors,
        trims,
        count: n,

        ...flags,
      })
    ),
  });
};

