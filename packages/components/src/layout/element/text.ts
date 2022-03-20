import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { TextureSource, Emitter } from '@use-gpu/core/types';
import { SpanData, PerSpan, PerGlyph } from '@use-gpu/text/types';
import { Point4, InlineSpan } from './types';

import { use, yeet, useContext, useFiber, useMemo } from '@use-gpu/live';
import { makeTuples, emitIntoNumberArray } from '@use-gpu/core';
import { parseDimension, normalizeMargin } from '../lib/util';

import { GPUTextContext } from '../../providers/gpu-text-provider';
import { Glyphs } from '../shape/glyphs';

export type TextProps = {
  /*
  margin?: Margin | number,
  padding?: Margin | number,
  radius?: Margin | number,

  border?: Margin | number,
  stroke?: Point4,
  fill?: Point4,
  */
  color?: Point4,
  size?: number,
  line?: number,
  snap?: boolean,

  content?: string,
};

const BLACK = [0, 0, 0, 1];
const NO_MARGIN = [0, 0, 0, 0];
const NO_STROKE = [0.0, 0.0, 0.0, 0.0];

export const Text: LiveComponent<TextProps> = (props) => {
  const {
    color = BLACK,
    size = 16,
    snap = false,
    lineHeight,
    content = '',
  } = props;

  const gpuText = useContext(GPUTextContext);

  const height = useMemo(() => {
    const {ascent, descent, lineHeight: fontHeight} = gpuText.measureFont(size);
    return {ascent, descent, lineHeight: lineHeight ?? fontHeight};
  }, [size, lineHeight]);

  const {spans, glyphs, breaks} = useMemo(() => {
    const {breaks, metrics: m, glyphs: g} = gpuText.measureSpans(content, size);

    const spans = makeTuples(m, 3);
    const glyphs = makeTuples(g, 2);

    return {spans, glyphs, breaks};
  }, [content, size]);

  const {id} = useFiber();
  return yeet({
    spans,
    height,
    render: (lines: InlineLine[]) => (
      use(Glyphs, id)({
        id,
        color,
        size,
        spans,
        glyphs,
        breaks,
        height,
        lines,
        snap,
      })
    ),
  });
};
