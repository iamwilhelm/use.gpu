import { LiveComponent } from '@use-gpu/live/types';
import { GPUTextAPI } from '@use-gpu/text/types';

import { provide, useAsync, makeContext, useContext, useMemo, useOne } from '@use-gpu/live';
import { makeTuples } from '@use-gpu/core';
import { GPUText } from '@use-gpu/text';

export type FontContextProps = {
  gpuText: GPUTextAPI,
};

export const FontContext = makeContext<FontContextProps>(undefined, 'FontContext');
export const useFontContext = () => useContext(FontContext);

export type FontContext = {
  children: LiveElement<any>,
};

export const FontProvider: LiveComponent<FontProviderProps> = ({children}) => {
  const gpuText = useAsync(GPUText);
  return gpuText && children ? provide(FontContext, gpuText, children) : null;
};

// Measure and parse packed text chunks
export const useFontText = (
  strings: string[] | string,
  size: number,
) => {
  const { measureSpans, packStrings } = useFontContext();

  const packed = useMemo(() => packStrings(strings), strings);

  return useMemo(() => {
    const {breaks, metrics: m, glyphs: g} = measureSpans(packed, size);
    const spans = makeTuples(m, 3);
    const glyphs = makeTuples(g, 2);
    return {spans, glyphs, breaks};
  }, [packed, size, measureSpans]);
}

// Get font metrics
export const useFontHeight = (
  size: number,
  lineHeight?: number,
) => {
  const { measureFont } = useFontContext();
  return useMemo(() => {
    const {ascent, descent, lineHeight: fontHeight} = measureFont(size);

    const lh = lineHeight ?? fontHeight;
    const baseline = ascent + (lh - fontHeight) / 2;

    return {ascent, descent, baseline, lineHeight: lh};
  }, [size, lineHeight, measureFont]);
}
