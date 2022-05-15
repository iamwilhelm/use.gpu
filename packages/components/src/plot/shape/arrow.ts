import { LiveComponent } from '@use-gpu/live/types';
import { ShaderSource } from '@use-gpu/shader/types';
import { ArrowTrait, ColorTrait, LineTrait, ROPTrait, VectorLike } from '../types';

import { use, provide, useCallback, useContext, useOne, useMemo } from '@use-gpu/live';
import { bundleToAttributes } from '@use-gpu/shader/wgsl';

import { useBoundShader } from '../../hooks/useBoundShader';
import { useBoundSource } from '../../hooks/useBoundSource';
import { useShaderRef } from '../../hooks/useShaderRef';
import { DataContext } from '../../providers/data-provider';
import {
  parseFloat,
  parseDetail,
  parsePosition4,
} from '../util/parse';
import {
  useArrowTrait,
  useColorTrait,
  useLineTrait,
  useROPTrait,
  useProp,
} from '../traits';
import { vec4 } from 'gl-matrix';

import { getLineSegment } from '@use-gpu/wgsl/geometry/segment.wgsl';
import { getLineAnchor } from '@use-gpu/wgsl/geometry/anchor.wgsl';
import { getLineTrim } from '@use-gpu/wgsl/geometry/trim.wgsl';

import { ArrowLayer } from '../../layers/arrow-layer';

const LINE_ATTRIBUTES = bundleToAttributes(getLineSegment);
const ARROW_ATTRIBUTES = bundleToAttributes(getLineAnchor);
const [, START_ATTRIBUTE, END_ATTRIBUTE] = ARROW_ATTRIBUTES;

export type ArrowProps =
  Partial<ArrowTrait> &
  Partial<ColorTrait> &
  Partial<LineTrait> &
  Partial<ROPTrait> & {

  colors?: ShaderSource,
  widths?: ShaderSource,
  depths?: ShaderSource,
};

export const Arrow: LiveComponent<ArrowProps> = (props) => {
  const {colors, widths, depths} = props;

  const positions = useContext(DataContext) ?? undefined;

  const {size, start, end} = useArrowTrait(props);
  const {width, depth, join} = useLineTrait(props);
  const color = useColorTrait(props);
  const rop = useROPTrait(props);

  const detailExpr = useOne(() => () => (positions?.size?.[0] || 1) - 1, positions);

  const boundStart = useBoundSource(START_ATTRIBUTE, useShaderRef(start));
  const boundEnd = useBoundSource(END_ATTRIBUTE, useShaderRef(end));
  const deps = [detailExpr, boundStart, boundEnd];

  const segments = useOne(() => useBoundShader(getLineSegment, LINE_ATTRIBUTES, [detailExpr]), detailExpr);
  const anchors = useMemo(() => useBoundShader(getLineAnchor, ARROW_ATTRIBUTES, [detailExpr, boundStart, boundEnd]), deps);
  const trims = useMemo(() => useBoundShader(getLineTrim, ARROW_ATTRIBUTES, [detailExpr, boundStart, boundEnd]), deps);

  return (
    use(ArrowLayer, {
      positions,
      segments,
      anchors,
      trims,

      color,
      width,
      depth,
      join,

      colors,
      widths,
      depths,
    })
  );
};

