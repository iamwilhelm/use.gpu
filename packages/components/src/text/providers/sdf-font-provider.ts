import { LiveComponent } from '@use-gpu/live/types';
import { Atlas, Tuples, Rectangle } from '@use-gpu/core/types';
import { FontMetrics } from '@use-gpu/text/types';

import { gather, provide, resume, useAsync, useContext, useMemo, useOne, useState, makeContext, incrementVersion } from '@use-gpu/live';
import { glyphToRGBA, glyphToSDF, padRectangle } from '@use-gpu/text';
import { makeAtlas, makeAtlasSource, resizeTextureSource, uploadAtlasMapping } from '@use-gpu/core';

import { makeLayoutCursor } from '../../layout/lib/cursor';
import { DeviceContext } from '../../providers/device-provider';
import { FontContext } from './font-provider';

export const SDFFontContext = makeContext(undefined, 'SDFFontContext');
export const useSDFFontContext = () => useContext(SDFFontContext);

export const SDF_FONT_ATLAS = 'SDF_FONT_ATLAS' as any as TextureSource;
export const SDF_FONT_DEBUG = 'SDF_FONT_DEBUG' as any as TextureSource;

export type SDFFontContextProps = {
  getRadius: () => number,
  getScale: (size: number) => number,
  getGlyph: (id: number, size: number) => number,
};

export type SDFFontSourceContextProps = {
  atlas: Atlas,
  source: TextureSource,
};

export type SDFFontProvider = {
  children?: LiveElement<any>,
  then?: (atlas: Atlas, source: TextureSource, gathered: any) => LiveElement<any>
};

const roundUp2 = (v: number) => {
  v--;
  v |= v >> 1;
  v |= v >> 2;
  v |= v >> 4;
  v |= v >> 8;
  v |= v >> 16;
  v++;
  return v;
};

const getNearestScale = (size: number) => roundUp2(Math.max(32, size));

const hashGlyph = (id: number, size: number) => (id << 16) + size;

type GlyphCache = {
  glyph: GlyphMetrics,
  mapping: Map<number, AtlasMapping>,
}

export const SDFFontProvider: LiveComponent<SDFFontProvider> = ({children, then}) => {

  const device = useContext(DeviceContext);
  const gpuText = useContext(FontContext);

  // Allocate font atlas + backing texture
  const width = 256;
  const height = 256;
  const pad = 10;
  const radius = 10;

  const format = "rgba8unorm" as GPUTextureFormat;

  const glyphs = useOne(() => new Map<number, GlyphCache>());
  const atlas = useOne(() => makeAtlas(width, height));
  const sourceRef = useOne(() => ({ current: makeAtlasSource(device, atlas, format) }));

  // Provide context to map glyphs on-demand
  const context = useMemo(() => {
    if (!gpuText) return null;

    const getRadius = () => radius;
    const getScale = (size: number) => size / getNearestScale(size);

    const getGlyph = (id: number, size: number): Entry => {
      const scale = getNearestScale(size);
      const key = hashGlyph(id, scale);

      const cache = glyphs.get(key);
      if (cache) return cache;

      // Measure glyph and get image
      let {current: source} = sourceRef;
      let glyph = gpuText.measureGlyph(id, scale);
      let mapping: AtlasMapping | null = null;

      const {image, width: w, height: h, outlineBounds: ob} = glyph;
      if (image && w && h) {

        // Convert to SDF
        const {data, width, height} = glyphToSDF(image, w, h, pad, radius);
        glyph.outlineBounds = padRectangle(ob, pad);
        glyph.image = data;

        try {
          mapping = atlas.place(key, width, height);
        }
        catch (e) {
          mapping = [0, 0, 0, 0];
          console.warn('atlas place failed', key, width, height);
          /*
          debugger;
          throw new Error('atlas place failed', key, width, height);
          */
        }

        // If atlas resized, resize the texture backing it
        const [sw, sh] = source.size;
        if (atlas.width !== sw && atlas.height !== sh) {
          console.log('resize atlas')
          source = sourceRef.current = resizeTextureSource(device, source, atlas.width, atlas.height);
        }

        uploadAtlasMapping(
          device,
          source.texture,
          format,
          data,
          mapping,
        );
      }

      const entry = {glyph, mapping};
      glyphs.set(key, entry);
      source.version = incrementVersion(source.version);

      return entry;
    };

    return {
      atlas,
      getRadius,
      getScale,
      getGlyph,
    };
  }, [gpuText, atlas]);

  return gpuText ? (
    gather(
      provide(SDFFontContext, context, children),
      resume((gathered: any) => then ? then(atlas, sourceRef.current, gathered) : null),
    )
  ) : null;
};


// Lay out glyphs from one or more spans into the given layout box.
//
// Return data buffers with glyph rectangles
export const useSDFGlyphData = (
  layout: Rectangle,
  spans: Tuples<3>,
  glyphs: Tuples<2>,
  breaks: number[],
  height: FontMetrics,
  align: Alignment,
  size: number = 48,
  wrap: number = 0,
  snap: boolean = false,
) => {
  const context = useSDFFontContext();

  const buffers = useMemo(() => {
    // Final buffers
    const n = glyphs.length;
    const rectangles = new Float32Array(n * 4);
    const uvs = new Float32Array(n * 4);
    const indices = new Uint32Array(n);

    // Custom emitter
    let i = 0;
    let i4 = 0;
    const emit = (
      l1: number,
      t1: number,
      r1: number,
      b1: number,
  
      l2: number,
      t2: number,
      r2: number,
      b2: number,
    
      index: number
    ) => {
      rectangles[i4  ] = l1;
      rectangles[i4+1] = t1;
      rectangles[i4+2] = r1;
      rectangles[i4+3] = b1;

      uvs[i4  ] = l2;
      uvs[i4+1] = t2;
      uvs[i4+2] = r2;
      uvs[i4+3] = b2;
    
      indices[i] = index;
    
      i4 += 4;
      i++;
    };

    const {baseline, lineHeight} = height;
    const cursor = makeLayoutCursor<number>(wrap, align);
    spans.iterate((advance, trim, hard) => cursor.push(advance, trim, hard, lineHeight));

    const [left, top] = layout;
    const currentLayout = [left, top + baseline];
    let lastIndex = -1;

    const layouts = cursor.gather((start, end, lead, gap, index) => {
      if (index !== lastIndex) {
        currentLayout[1] = top + baseline;
        index = lastIndex;
      }

      emitGlyphSpans(context, currentLayout, index, spans, glyphs, breaks, start, end, size, gap, lead, snap, emit);
      currentLayout[1] += lineHeight;
    });

    return [indices, rectangles, uvs, layouts];
  }, [context, layout, spans, glyphs, breaks, height, align, size, wrap, snap]);
 
  return buffers;
}

export const emitGlyphSpans = (
  context: SDFFontContextProps,
  layout: Rectangle,
  currentIndex: number,
  
  spans: Tuples<3>,
  glyphs: Tuples<2>,
  breaks: number[],

  start: number,
  end: number,

  size: number,
  gap: number,
  lead: number,
  snap: boolean,

  emit: (
    l1: number,
    t1: number,
    r1: number,
    b1: number,
  
    l2: number,
    t2: number,
    r2: number,
    b2: number,
    
    i: number
  ) => void,
) => {
  const { getGlyph, getScale } = context;
  const [left, top] = layout;

  const scale = getScale(size);

  let x = left + lead;
  let y = top;
  let sx = snap ? Math.round(x) : x;

  spans.iterate((_a, trim, hard, index) => {
    glyphs.iterate((id: number, isWhiteSpace: boolean) => {
      const {glyph, mapping} = getGlyph(id, size);
      const {image, layoutBounds, outlineBounds} = glyph;
      const [ll, lt, lr, lb] = layoutBounds;

      if (!isWhiteSpace) {
        if (image) {
          const [gl, gt, gr, gb] = outlineBounds;

          const cx = snap ? Math.round(sx) : sx;
          const cy = snap ? Math.round(y) : y;

          emit(
            (scale * gl) + cx,
            (scale * gt) + cy,
            (scale * gr) + cx,
            (scale * gb) + cy,

            mapping[0],
            mapping[1],
            mapping[2],
            mapping[3],
          
            currentIndex,
          );
        }
      }

      sx += lr * scale;
      x += lr * scale;
    }, breaks[index - 1] || 0, breaks[index]);

    if (hard === 2) {
      currentIndex++;
    }

    if (trim) {
      x += gap;
      sx = snap ? Math.round(x) : x;
    }
  }, start, end);
};
