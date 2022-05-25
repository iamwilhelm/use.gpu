import { LiveComponent } from '@use-gpu/live/types';
import { ColorTrait, LineTrait, ROPTrait } from '../types';
import { VectorLike } from '../../traits/types';

import { use, provide, useCallback, useContext, useOne, useMemo } from '@use-gpu/live';

import { DataContext } from '../../providers/data-provider';
import { RangeContext } from '../../providers/range-provider';
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
  size?: number,
  detail?: number,
  offset?: VectorLike,
};

const NO_OFFSET = vec4.fromValues(0, 1, 0, 0);

export const Tick: LiveComponent<TickProps> = (props) => {
  const {
    size = 5,
    detail = 1,
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

  return (
    use(TickLayer, {
      positions,
      offset: o,
      detail: d,
      count,

      color,
      width,
      depth,
      size: s,
      join,
    })
  );
};

