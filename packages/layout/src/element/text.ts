import type { LiveComponent, DeferredCall } from '@use-gpu/live';
import type { XYZW, Rectangle } from '@use-gpu/core';
import type { ShaderModule } from '@use-gpu/shader';
import type { ColorLike } from '@use-gpu/traits';
import type { Base, InlineLine } from '../types';

import { useProp, shouldEqual, sameShallow } from '@use-gpu/traits/live';
import { parseColor, parseNumber } from '@use-gpu/parse';
import { memo, use, yeet, useOne } from '@use-gpu/live';

import { useFontFamily, useFontText, useFontHeight, LayerReconciler } from '@use-gpu/workbench';
import { Glyphs } from '../shape/glyphs';
import { memoInline } from '../lib/util';

const {quote} = LayerReconciler;

export type TextProps = {
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

const toSpan = (props: TextProps) => (child: LiveElement) =>
  child != null
    ? typeof child !== 'object'
      ? use(Span, {
          ...props,
          children: null,
          text: typeof child !== 'string'
            ? `${child}`
            : child,
        })
      : child
    : null;

export const Text: LiveComponent<TextProps> = memo((props) => {

  // Handle JSX array children
  const content = props.children ?? props.text;
  if (Array.isArray(content)) {
    // Escape loose strings to <Span>
    const fragment = content.map(toSpan(props));
    if (content.length > 1 || typeof fragment[0] === 'object') return fragment;
  }
  else if (content?.f) {
    console.log(content);
    // Render nested <Element>
    return content;
  }
  else if (content != null) {
    // Inline single string
    return InnerSpan(props);
  }

  return null;
}, shouldEqual({
  color: sameShallow(),
}), 'Text');

const InnerSpan: LiveComponent<Omit<TextProps, 'children'>> = (props) => {

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

  const content = children ?? text;

  const font = useFontFamily(family, weight, style);
  const {spans, glyphs, breaks} = useFontText(font, content, size);
  const height = useFontHeight(font, size, lineHeight);

  const color = useProp(props.color, parseColor, BLACK);
  const opacity = useProp(props.opacity, parseNumber, 1);

  return yeet({
    spans,
    height,
    inline,
    render: memoInline((
      lines: InlineLine[],
      origin: Rectangle,
      z: number,
      clip: ShaderModule | null,
      mask: ShaderModule | null,
      transform: ShaderModule | null,
    ) => (
      use(Glyphs, {
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
        zIndex: z,
      })
    )),
  });
};

const Span = memo(InnerSpan, shouldEqual({
  color: sameShallow(),
}), 'Span');
