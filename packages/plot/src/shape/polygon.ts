import type { LiveComponent } from '@use-gpu/live';
import type { ColorLike, ColorLikes, VectorLike } from '@use-gpu/core';
import type { TraitProps } from '@use-gpu/traits';

import { combine, shouldEqual, sameShallow } from '@use-gpu/traits/live';
import { memo, use, useOne, useMemo } from '@use-gpu/live';

import { InnerFace, FaceProps } from './face';
import { InnerLine, LineProps } from './line';

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
  Pick<FaceProps,
    'position' | 'positions' |
    'depth' | 'depths' |
    'zBias' | 'zBiases' |
    'id' | 'ids' |
    'lookup' | 'lookups'
  > &
  Pick<LineProps,
    'width' | 'widths'
  > & {
    fill?: ColorLike | ColorLikes,
    fills?: ColorLikes,
    stroke?: ColorLike | ColorLikes,
    strokes?: ColorLikes,
    zBiasStroke?: number,
  };

export const Polygon: LiveComponent<PolygonProps> = memo((props) => {
  const {width, widths, fill, fills, stroke, strokes, zBiasStroke = 0} = props;
  const zBias = (props.zBias || 0) + zBiasStroke;
  return [
    fill ?? fills ? use(InnerFace, {...props, color: fill, colors: fills, concave: true}) : null,
    stroke ?? strokes ? use(InnerLine, {...props, color: stroke, colors: strokes, loop: true, width, widths, zBias}) : null,
  ];
}, 'Polygon');
