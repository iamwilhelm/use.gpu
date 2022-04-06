import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { StorageSource, UniformAttributeValue } from '@use-gpu/core/types';
import { ShaderModule } from '@use-gpu/shader/wgsl/types';
import { LineProps, ColorProps, ROPProps, ArrowProps, VectorLike, Swizzle } from '../types';

import { use, provide, useContext, useOne, useMemo } from '@use-gpu/live';
import { useBoundShaderWithRefs } from '../../hooks/useBoundShaderWithRefs';
import { mapChunksToSegments, mapChunksToAnchors } from '@use-gpu/core';
import { chainTo } from '@use-gpu/shader/wgsl';

import { TransformContext } from '../../providers/transform-provider';
import {
  parseAxis,
  parseDetail,
  parsePosition4,
  parseRange,

  parseArrowProps,
  parseColorProps,
  parseLineProps,
  parseROPProps,
} from '../util/parse';
import { useOptional, useRequired } from '../prop';
import { vec4 } from 'gl-matrix';

import { Data } from '../../data/data';
import { LineLayer } from '../../layers/line-layer';
import { ArrowLayer } from '../../layers/arrow-layer';

import { getAxisPosition } from '@use-gpu/wgsl/plot/axis.wgsl';

const AXIS_BINDINGS = [
  { name: 'getAxisOrigin', format: 'vec4<f32>', value: vec4.fromValues(-1, 0, 0, 0) },
  { name: 'getAxisStep', format: 'vec4<f32>', value: vec4.fromValues(2, 0, 0, 0) },
];

export type AxisProps = LineProps & ColorProps & ROPProps & ArrowProps & {
  range?: VectorLike,
  axis?: Axis,
  origin?: VectorLike,
  detail?: number,
};

export const Axis: LiveComponent<AxisProps> = (props) => {
  const {
    range,
    axis,
    origin,
    detail,
  } = props;

  const g = useOptional(range, parseRange);

  const a = useRequired(axis, parseAxis);
  const p = useRequired(origin, parsePosition4);
  const d = useRequired(detail, parseDetail);

  const {range: parentRange, transform} = useContext(TransformContext);
  const r = g ?? parentRange[a];

  const og = vec4.clone(p);
  const step = vec4.create();
  const min = r[0];
  const max = r[1];
  og[a] = min;
  step[a] = (max - min) / d;
  og[3] = 1;

  const bound = useBoundShaderWithRefs(getAxisPosition, AXIS_BINDINGS, [og, step]);
  const getPosition = useMemo(
    () => transform ? chainTo(bound, transform) : bound,
    [bound, transform],
  );

  const [
    {width, depth, join, loop},
    color,
    rop,
    {size, start, end},
  ] = useOne(() => {
    const l = parseLineProps(props);
    const c = parseColorProps(props);
    const r = parseROPProps(props);
    const w = parseArrowProps(props);
    return [l, c, r, w];
  }, props);

  const n = d + 1;

  const fields = useMemo(() => {
    const chunks = [n];
    const loops = [loop];
    const ends = [[start, end]];

    const segments = mapChunksToSegments(chunks, loops);
    const [anchors, trims] = mapChunksToAnchors(chunks, loops, ends);
    console.log({segments,anchors,trims})

    return [
      ['i32', segments],
      ['vec4<i32>', anchors],
      ['vec2<i32>', trims],
    ];
  }, [n, loop, start, end]);

  return (
    use(Data, {
      fields,
      render: ([segments, anchors, trims]: StorageSource[]) => [
        use(LineLayer, {
          getPosition,
          segments,
          anchors,
          trims,
          count: n,

          color,
          width,
          depth,
          size,
          join,
        }),
        use(ArrowLayer, {
          getPosition,
          segments,
          anchors,
          trims,
          count: n,

          color,
          width,
          depth,
          size,
          join,
        }),
      ]
    })
  );
};

