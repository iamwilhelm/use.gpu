import { LiveComponent } from '@use-gpu/live/types';
import { RustTextAPI } from '@use-gpu/text/types';

import { provide, useAsync, makeContext, useContext, useMemo, useOne } from '@use-gpu/live';
import { Font } from '../types';
import { makeTuples } from '@use-gpu/core';
import { RustText } from '@use-gpu/text';

export type FontContextProps = {
  gpuText: RustTextAPI,
};

export const FontContext = makeContext<FontContextProps>(undefined, 'FontContext');
export const useFontContext = () => useContext(FontContext);

export type FontProviderProps = {
  fonts: Font[],
  children: LiveElement<any>,
};

export const FontProvider: LiveComponent<FontProviderProps> = ({fonts, children}) => {
  const rustText = useAsync(RustText);

  useMemo(() => {
    if (rustText) rustText.setFonts(fonts);
  }, [rustText, fonts]);

  return rustText && children ? provide(FontContext, rustText, children) : null;
};

// Measure and parse packed text chunks
export const useFontFamily = (
  family?: string,
  weight?: string | number,
  style?: string,
) => {
  const { resolveFontStack } = useFontContext();

  return useMemo(() => {
    const families = family != null ? family.split(/\s*,\s*/g).filter(s => s !== '') : [undefined];
    return resolveFontStack(families.map(family => ({family, weight, style})));
  }, [family, weight, style, resolveFontStack]);
}

// Measure and parse packed text chunks
export const useFontText = (
  stack: number[],
  strings: string[] | string,
  size: number,
) => {
  const { measureSpans, packStrings } = useFontContext();

  const packed = useMemo(() => packStrings(strings), strings);

  return useMemo(() => {
    const {breaks, metrics: m, glyphs: g} = measureSpans(stack, packed, size);
    const spans = makeTuples(m, 3);
    const glyphs = makeTuples(g, 3);
    return {spans, glyphs, breaks};
  }, [packed, size, measureSpans]);
}

// Get font metrics
export const useFontHeight = (
  stack: number[],
  size: number,
  lineHeight?: number,
) => {
  const { measureFont } = useFontContext();
  const [id] = stack;
  return useMemo(() => {
    const {ascent, descent, lineHeight: fontHeight} = measureFont(id, size);

    const lh = lineHeight ?? fontHeight;
    const baseline = ascent + (lh - fontHeight) / 2;

    return {ascent, descent, baseline, lineHeight: lh};
  }, [id, size, lineHeight, measureFont]);
}
