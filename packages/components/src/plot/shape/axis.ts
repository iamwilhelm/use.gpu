import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { LineProps, ColorProps, ROPProps, ArrowProps, VectorLike, Swizzle } from '../types';

import { use, provide, useContext, useOne, useMemo } from '@use-gpu/live';
import { useBoundShader } from '../../hooks/useBoundShader';
import { useRawStorage } from '../../hooks/useRawStorage';
import { useShaderRef } from '../../hooks/useShaderRef';
import { mapChunksToSegments, mapChunksToAnchors } from '@use-gpu/core';

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

import { getAxisPosition } from '@use-gpu/wgsl/plot/axis.wgsl';

const AXIS_BINDINGS = [
  { name: 'getAxisOrigin', format: 'vec4<f32>', value: vec4.fromValues(-1, 0, 0, 0) },
  { name: 'getAxisStep', format: 'vec4<f32>', value: vec4.fromValues(2, 0, 0, 0) },
];

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
  const og = vec4.clone(p);
  const step = vec4.create();
  const min = r[0];
  const max = r[1];
  og[axis] = min;
  step[axis] = (max - min) / d;
  og[3] = 1;

  // Make axis vertex shader
  const o = useShaderRef(og);
  const s = useShaderRef(step);
  const positions = useBoundShader(getAxisPosition, AXIS_BINDINGS, [o, s]);

  const n = d + 1;

  // Make line/arrow data
  const arrays = useMemo(() => {
    const chunks = [n];
    const loops = [loop];
    const ends = [[start, end]];

    const segments = mapChunksToSegments(chunks, loops);
    const [anchors, trims] = mapChunksToAnchors(chunks, loops, ends);

    return {segments, anchors, trims};
  }, [n, loop, start, end]);

  const segments = useRawStorage(arrays.segments, 'i32');
  const anchors = useRawStorage(arrays.anchors, 'vec4<u32>');
  const trims = useRawStorage(arrays.trims, 'vec4<u32>');

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

