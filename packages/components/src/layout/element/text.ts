import { LiveComponent } from '@use-gpu/live/types';
import { TextureSource, Emitter } from '@use-gpu/core/types';
import { ShaderModule } from '@use-gpu/shader/types';
import { Rectangle, Point4, InlineLine } from '../types';

import { keyed, yeet, useContext, useFiber, useOne, useMemo } from '@use-gpu/live';
import { makeTuples, emitIntoNumberArray } from '@use-gpu/core';
import { evaluateDimension, normalizeMargin } from '../lib/util';

import { useFontFamily, useFontText, useFontHeight } from '../../text/providers/font-provider';
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

  family?: string,
  style?: string,
  weight?: string | number,
  
  lineHeight?: number,
  size?: number,
  detail?: number,
  snap?: boolean,

  text?: string,
  children?: string,
};

const BLACK: Point4 = [0, 0, 0, 1];
const NO_MARGIN: Point4 = [0, 0, 0, 0];
const NO_STROKE: Point4 = [0.0, 0.0, 0.0, 0.0];

export const Text: LiveComponent<TextProps> = (props) => {
  const {
    family,
    style,
    weight,
    color = BLACK,
    lineHeight,
    detail,
    size = 16,
    snap = false,
    text = '',
    children,
  } = props;

  const strings = children ?? text;

  const font = useFontFamily(family, weight, style);
  const {spans, glyphs, breaks} = useFontText(font, strings, size);
  const height = useFontHeight(font, size, lineHeight);

  const {id} = useFiber();
  return yeet({
    spans,
    height,
    render: (lines: InlineLine[], clip?: ShaderModule, transform?: ShaderModule) => (
      keyed(Glyphs, id, {
        id,
        font,
        color,
        size,
        detail,
        spans,
        glyphs,
        breaks,
        height,
        lines,
        snap,

        clip,
        transform,
      })
    ),
  });
};
