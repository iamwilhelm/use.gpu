import { LiveComponent } from '@use-gpu/live/types';
import { UniformAttribute } from '@use-gpu/core/types';
import { ColorTrait, LineTrait, ROPTrait } from '../types';
import { VectorLike } from '../../traits/types';

import { use, provide, useCallback, useContext, useOne, useMemo } from '@use-gpu/live';
import { diffBy } from '@use-gpu/shader/wgsl';

import { DataContext } from '../../providers/data-provider';
import { RangeContext } from '../../providers/range-provider';
import { useBoundSource } from '../../hooks/useBoundSource';
import {
  parseFloat,
  parsePosition4,
} from '../../traits/parse';
import {
  parseDetail,
} from '../parse';
import {
  useColorTrait,
  useLineTrait,
  useROPTrait,
} from '../traits';
import { useProp } from '../../traits/useProp';
import { vec4 } from 'gl-matrix';

import { TickLayer } from '../../layers/tick-layer';

export type TickProps =
  Partial<ColorTrait> &
  Partial<LineTrait> &
  Partial<ROPTrait> & {
  base?: number,
  size?: number,
  detail?: number,
  offset?: VectorLike,
};

const NO_OFFSET = vec4.fromValues(0, 1, 0, 0);
const GET_POSITION = {format: 'vec4<f32>', name: 'getPosition'} as UniformAttribute;
const GET_SIZE = {format: 'u32', name: 'getSize', args: []} as UniformAttribute;

export const Tick: LiveComponent<TickProps> = (props) => {
  const {
    size = 5,
    detail = 1,
    base = 10,
    offset = NO_OFFSET
  } = props;

  const positions = useContext(DataContext) ?? undefined;
  const count = useCallback(() => (positions as any)?.length, [positions]);

  const {width, depth, join} = useLineTrait(props);
  const color = useColorTrait(props);
  const rop = useROPTrait(props);

  const s = useProp(size, parseFloat);
  const d = useProp(detail, parseDetail);
  const o = useProp(offset, parsePosition4);

  const getPosition = useBoundSource(GET_POSITION, positions);
  const getSize = useBoundSource(GET_SIZE, count);
  const tangents = diffBy(getPosition, [-1], getSize);

  return (
    use(TickLayer, {
      positions,
      offset: o,
      detail: d,
      base,
      tangents,
      count,

      color,
      width,
      depth,
      size: s,
      join,
    })
  );
};

