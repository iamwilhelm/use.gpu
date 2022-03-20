export type FontMetrics = {
  ascent: number,
  descent: number,
  lineHeight: number,
};

export type SpanMetrics = {
  breaks: number[],
  metrics: number[],
  glyphs: number[],
};

export type GlyphMetrics = {
  id: number[],
  layoutBounds: number[],
  outlineBounds: number[] | null,
  image: Uint8Array,
  bounds: number[],
  width: number,
  height: number,
};

export type GPUTextAPI = {
  measureFont: (size: number) => FontMetrics,
  measureSpans: (text: string, size: number) => SpanMetrics,
  measureGlyph: (id: number, size: number) => GlyphMetrics,
};

