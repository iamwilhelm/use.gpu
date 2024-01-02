import type { LiveComponent } from '@use-gpu/live';
import type { VectorLike } from '@use-gpu/traits';

import { combine, shouldEqual, sameShallow } from '@use-gpu/traits/live';
import { memo, use, useOne, useMemo } from '@use-gpu/live';

import { RawFace } from './face';
import { RawLine } from './line';

import {
  FaceTrait,
  ROPTrait,
  StrokeTrait,
  ZIndexTrait,
} from '../traits';

const Traits = combine(
  FaceTrait,
  ROPTrait,
  StrokeTrait,
  ZIndexTrait,
);

export type PolygonProps = TraitProps<typeof Traits> & 
  Pick<Face,
    'position' | 'positions' |
    'depth' | 'depths' |
    'zBias' | 'zBiases' |
    'id' | 'ids' |
    'lookup' | 'lookups'
  > &
  Pick<Line,
    'width' | 'widths'
  > & {
    fill?: ColorLike | ColorLikes,
    fills?: ColorLikes,
    stroke?: ColorLike | ColorLikes,
    strokes?: ColorLikes,
    zBiasShift?: number,
  };

export const Polygon: LiveComponent<PolygonProps> = memo((props) => {
  const {fill, fills, stroke, strokes, zBiasShift = 1} = props;
  const zBias = (props.zBias || 0) + zBiasShift;
  return [
    fill ?? fills ? use(RawFace, {...props, color: fill, colors: fills, concave: true}) : null,
    stroke ?? strokes ? use(RawLine, {...props, color: stroke, colors: strokes, loop: true, zBias}) : null,
  ];
}, 'Polygon');
