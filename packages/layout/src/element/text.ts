import type { LiveComponent } from '@use-gpu/live';
import type { XYZW, Rectangle } from '@use-gpu/core';
import type { ShaderModule } from '@use-gpu/shader';
import type { ColorLike } from '@use-gpu/traits';
import type { Base, InlineLine } from '../types';

import { useProp } from '@use-gpu/traits/live';
import { parseColor, parseNumber } from '@use-gpu/parse';
import { memo, keyed, yeet, useFiber } from '@use-gpu/live';

import { useFontFamily, useFontText, useFontHeight } from '@use-gpu/workbench';
import { Glyphs } from '../shape/glyphs';
import { memoInline } from '../lib/util';

export type TextProps = {
  /*
  margin?: Margin | number,
  padding?: Margin | number,
  radius?: Margin | number,

  border?: Margin | number,
  stroke?: XYZW,
  fill?: XYZW,
  */

  opacity?: number,
  color?: ColorLike,
  expand?: number,

  family?: string,
  style?: string,
  weight?: string | number,

  lineHeight?: number,
  size?: number,
  detail?: number,
  snap?: boolean,

  inline?: Base,
  text?: string,
  children?: string,
};

const BLACK: XYZW = [0, 0, 0, 1];
const NO_MARGIN: XYZW = [0, 0, 0, 0];
const NO_STROKE: XYZW = [0.0, 0.0, 0.0, 0.0];

export const Text: LiveComponent<TextProps> = memo((props) => {
  const {
    family,
    style,
    weight,
    lineHeight,
    detail,
    inline,
    expand = 0,
    size = 16,
    snap = false,
    text = '',
    children,
  } = props;

  const strings = children ?? text;

  const font = useFontFamily(family, weight, style);
  const {spans, glyphs, breaks} = useFontText(font, strings, size);
  const height = useFontHeight(font, size, lineHeight);

  const color = useProp(props.color, parseColor, BLACK);
  const opacity = useProp(props.opacity, parseNumber, 1);

  const {id} = useFiber();
  return yeet({
    spans,
    height,
    inline,
    render: memoInline((
      lines: InlineLine[],
      origin: Rectangle,
      clip: ShaderModule | null,
      mask: ShaderModule | null,
      transform: ShaderModule | null,
    ) => (
      keyed(Glyphs, id, {
        id,
        font,
        color: color as any,
        opacity,
        size,
        detail,
        spans,
        glyphs,
        breaks,
        height,
        lines,
        snap,
        expand,

        origin,
        clip,
        mask,
        transform,
      })
    )),
  });
}, 'Text');
