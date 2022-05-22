import { LiveComponent } from '@use-gpu/live/types';
import { ArrowTrait, AxisTrait, LineTrait, ColorTrait, ROPTrait, VectorLike, Swizzle } from '../types';

import { memo, use, gather, provide, useContext, useOne, useMemo } from '@use-gpu/live';
import { useBoundShader } from '../../hooks/useBoundShader';
import { useRawSource } from '../../hooks/useRawSource';
import { useShaderRef } from '../../hooks/useShaderRef';

import { RangeContext } from '../../providers/range-provider';
import {
  parseDetail,
  parsePosition4,
} from '../util/parse';
import {
  useAxisTrait,
  useArrowTrait,
  useColorTrait,
  useLineTrait,
  useROPTrait,
  useProp,
} from '../traits';
import { vec4 } from 'gl-matrix';

import { Data } from '../../data/data';
import { LineLayer } from '../../layers/line-layer';
import { ArrowLayer } from '../../layers/arrow-layer';
import { useArrowSegments } from '../../layers/arrow-segments';

import { bundleToAttributes } from '@use-gpu/shader/wgsl';
import { getAxisPosition } from '@use-gpu/wgsl/plot/axis.wgsl';

const AXIS_BINDINGS = bundleToAttributes(getAxisPosition);

export type AxisProps =
  Partial<AxisTrait> &
  Partial<LineTrait> &
  Partial<ColorTrait> &
  Partial<ROPTrait> &
  Partial<ArrowTrait> & {
  origin?: VectorLike,
  detail?: number,
};

export const Axis: LiveComponent<AxisProps> = (props) => {
  const {
    origin,
    detail,
  } = props;

  const {axis, range} = useAxisTrait(props);
  const {size, start, end} = useArrowTrait(props);
  const {width, depth, join, loop} = useLineTrait(props);

  const color = useColorTrait(props);
  const rop = useROPTrait(props);

  const p = useProp(origin, parsePosition4);
  const d = useProp(detail, parseDetail);

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
  const positions = useBoundShader(getAxisPosition, AXIS_BINDINGS, [s, o]);

  // Render as 1 arrow chunk
  const n = d + 1;
  const [chunks, loops] = useMemo(() => [[n], [loop]], [n, loop]);
  const {segments, anchors, trims} = useArrowSegments(chunks, loops, start, end);

  return (
    use(ArrowLayer, {
      positions,
      segments,
      anchors,
      trims,
      count: n,

      color,
      width,
      depth,
      size,
      join,
    })
  );
};

