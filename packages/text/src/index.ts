import { Font, FontMetrics, SpanMetrics, GlyphMetrics, RustTextAPI } from './types';
import { getHashValue } from '@use-gpu/state';

export { glyphToRGBA, glyphToSDF, padRectangle } from './sdf';

// @ts-ignore
let UseRustText: typeof import('../pkg');

const DEFAULT_FONTS = {
  "0": {
    family: 'sans-serif',
    weight: 400,
    style: 'normal',
  },
};

export const RustText = async (): Promise<RustTextAPI> => {
  if (!UseRustText) {
    // @ts-ignore
    ({UseRustText} = await import('../pkg'));
  }

  // @ts-ignore
  const useRustText = UseRustText.new();

  let fontMap = new Map<number, Font>();
  for (let k in DEFAULT_FONTS) fontMap.set(+k, DEFAULT_FONTS[k]);

  const setFonts = (fonts: Font[]) => {
    const keys = fonts.map(getHashValue);

    const remove = new Set<number>(fontMap.keys());
    remove.delete(0);

    keys.forEach((k, i) => {
      if (!fontMap.has(k)) {
        const font = fonts[i];
        console.log('load font', k, font);
        useRustText.load_font(k, new Uint8Array(font.buffer));
        fontMap.set(k, font);
      }
      else remove.delete(k);
    });
    
    for (const k of remove.keys()) {
      fontMap.delete(k);
      console.log('unload font', k);
      useRustText.unload_font(k);
    }
  }

  const resolveFont = (font: Partial<Font>): number => {
    let matches = [] as Font[];
    let almosts = [] as Font[];

    const {
      family = 'sans-serif',
      weight = 400,
      style = 'normal',
    } = font;
    for (const k of fontMap.keys()) {
      const font = fontMap.get(k)!;

      const match = font.family === family && font.style === style;
      const almost = font.family === family;
      if (match) matches.push(k);
      if (almost) almosts.push(k);
    }

    const candidates = matches.length ? matches : almosts;

    let best: number | null = null;
    let distance = Infinity;
    for (const k of candidates) {
      const f = fontMap.get(k)!;
      let d = Math.min(weight / f.weight, f.weight / weight);
      if (d < distance) {
        distance = d;
        best = k;
      }
    }
    
    return best;
  }
  
  const resolveFontStack = (fonts: Partial<Font>[]): number[] => fonts.map(resolveFont).filter(x => x != null) as number[];

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
  
  return {measureFont, measureSpans, measureGlyph, packString, packStrings, resolveFont, resolveFontStack, setFonts};
}

export const packStrings = (strings: string[] | string): Uint16Array => {
  let ss: string[];
  if (!Array.isArray(strings)) ss = [strings];
  else ss = strings;

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

export const packString = packStrings;
