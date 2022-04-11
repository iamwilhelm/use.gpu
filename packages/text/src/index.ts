import { FontMetrics, SpanMetrics, GlyphMetrics, GPUTextAPI } from './types';

export { glyphToRGBA, glyphToSDF, padRectangle } from './sdf';

// @ts-ignore
let UseGPUText: typeof import('../pkg');

export const GPUText = async (): Promise<GPUTextAPI> => {
  if (!UseGPUText) {
    // @ts-ignore
    ({UseGPUText} = await import('../pkg'));
  }

  // @ts-ignore
  const useGPUText = UseGPUText.new();

  const packStrings = (strings: string[] | string): Uint16Array => {
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
  
  const packString = packStrings;
  
  const measureFont = (size: number): FontMetrics => {
    return useGPUText.measure_font(size);
  }

  const measureSpans = (text: Uint16Array, size: number): SpanMetrics => {
    return useGPUText.measure_spans(text, size);
  }
  
  const measureGlyph = (id: number, size: number): GlyphMetrics => {
    return useGPUText.measure_glyph(id, size);
  }
  
  return {measureFont, measureSpans, measureGlyph, packString, packStrings};
}

