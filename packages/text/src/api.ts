import { Font, FontProps, FontMetrics, SpanMetrics, GlyphMetrics, RustTextAPI } from './types';
import { getHashValue } from '@use-gpu/state';

// @ts-ignore
let UseRustText: typeof import('../pkg');

const DEFAULT_FONTS = {
  "0": {
    family: 'sans-serif',
    weight: 400,
    style: 'normal',
  },
} as Record<string, FontProps>;

export const RustText = async (): Promise<RustTextAPI> => {
  if (!UseRustText) {
    // @ts-ignore
    ({UseRustText} = await import('../pkg'));
  }

  // @ts-ignore
  const useRustText = UseRustText.new();

  let fontMap = new Map<number, FontProps>();
  for (let k in DEFAULT_FONTS) fontMap.set(+k, DEFAULT_FONTS[k]);

  const setFonts = (fonts: Font[]) => {
    const keys = fonts.map(getHashValue);

    const remove = new Set<number>(fontMap.keys());
    remove.delete(0);

    keys.forEach((k, i) => {
      if (!fontMap.has(k)) {
        const font = fonts[i];
        useRustText.load_font(k, new Uint8Array(font.buffer));
        fontMap.set(k, font.props);
      }
      else remove.delete(k);
    });
    
    for (const k of remove.keys()) {
      fontMap.delete(k);
      useRustText.unload_font(k);
    }
  }

  const resolveFont = (font: Partial<FontProps>): number | null => {

    let best: number | null = null;
    let max = 0;

    const {
      family = '',
      weight = 400,
      style = 'normal',
    } = font;

    for (const k of fontMap.keys()) {
      const font = fontMap.get(k)!;
      const {family: f, style: s, weight: w} = font;

      let score = 0;
      if (f === family) score += 2;
      if (s === style) score += 1;
      score += Math.min(weight / w, w / weight);
      
      if (score > max) {
        max = score;
        best = k;
      }
    }
    
    return best;
  }
  
  const resolveFontStack = (fonts: Partial<FontProps>[]): number[] => {
    const stack = fonts.map(resolveFont).filter(x => x != null) as number[];
    return stack.length ? stack : [0];
  }

  const measureFont = (fontId: number, size: number): FontMetrics => {
    return useRustText.measure_font(fontId, size);
  }

  const measureSpans = (fontStack: number[], text: Uint16Array, size: number): SpanMetrics => {
    const s = useRustText.measure_spans(fontStack, text, size);
    return {
      breaks: new Uint32Array(s.breaks.buffer),
      metrics: new Float32Array(s.metrics.buffer),
      glyphs: new Uint32Array(s.glyphs.buffer),
    };
  }
  
  const measureGlyph = (fontId: number, glyphId: number, size: number): GlyphMetrics => {
    return useRustText.measure_glyph(fontId, glyphId, size);
  }
  
  return {measureFont, measureSpans, measureGlyph, resolveFont, resolveFontStack, setFonts};
}

export const packStrings = (strings: string[] | string): Uint16Array => {
  if (!Array.isArray(strings)) return packString(strings);

  const ss: string[] = strings;
  const c = ss.length;
  const n = ss.reduce((a, b) => a + b.length, 0);

  let pos = 0;
  const array = new Uint16Array(n + c);
  for (const s of ss) {
    const l = s.length;
    for (let i = 0; i < l; ++i) {
      const c = s.charCodeAt(i);
      if (c !== 0) {
        array[pos++] = c;
      }
    }
    array[pos++] = 0;
  }

  return array;
};

export const packString = (s: string): Uint16Array => {
  const n = s.length;

  let pos = 0;
  const array = new Uint16Array(n);
  for (let i = 0; i < n; ++i) {
    const c = s.charCodeAt(i);
    if (c !== 0) {
      array[pos++] = c;
    }
  }

  return array;
};
