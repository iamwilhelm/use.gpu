import { LiveComponent } from '@use-gpu/live/types';
import { GPUTextContext } from '@use-gpu/text/types';

import { provide, useAsync, useContext, useMemo, useOne, useState, makeContext, incrementVersion } from '@use-gpu/live';
import { GPUText, glyphToRGBA, glyphToSDF, padRectangle } from '@use-gpu/text';
import { AtlasMapping, makeAtlas, makeAtlasSource, resizeTextureSource, uploadAtlasMapping } from '@use-gpu/core';
import { DeviceContext } from '../providers/device-provider';

export const FontContext = makeContext(null, 'FontContext');

export type FontContextProps = {
  gpuText: GPUTextContext,
  getRadius: () => number,
  getGlyph: (i: number, s: number) => GlyphMetrics,
  getScale: (s: number) => number,
};

export type FontProviderProps = {
  children: LiveElement<any>,
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

export const FontProvider: LiveComponent<FontProviderProps> = ({children}) => {

  const device = useContext(DeviceContext);
  const gpuText = useAsync(GPUText);

  const width = 200;
  const height = 200;
  const pad = 10;
  const radius = 10;

  const format = "rgba8unorm" as GPUTextureFormat;

  const glyphs = useOne(() => new Map<number, GlyphCache>());
  const atlas = useOne(() => makeAtlas(width, height));
  const [source, setSource] = useState<TextureSource>(() => makeAtlasSource(device, atlas, format));

  const context = useMemo(() => {
    if (!gpuText) return null;

    let s = source;

    const getRadius = () => radius;
    const getScale = (size: number) => size / getNearestScale(size);
    const getGlyph = (id: number, size: number): Entry => {
      const scale = getNearestScale(size);
      const key = hashGlyph(id, scale);
      const cache = glyphs.get(key);
      if (cache) return cache;

      let glyph = gpuText.measureGlyph(id, scale);
      let mapping: AtlasMapping | null = null;

      const {image, width: w, height: h, outlineBounds: ob} = glyph;
      if (image && w && h) {
        const {data, width, height} = glyphToSDF(image, w, h, pad, radius);
        glyph.outlineBounds = padRectangle(ob, pad);
        glyph.image = data;

        try {
          mapping = atlas.place(key, width, height);
        }
        catch (e) {
          debugger;
        }
        if (!mapping) {
          debugger;
          atlas.expand();
          mapping = atlas.place(key, width, height);
          if (!mapping) {
            throw new Error('atlas place failed');
          }

          s = resizeTextureSource(device, s, atlas.width, atlas.height);
          setSource(s);
        }

        uploadAtlasMapping(
          device,
          s.texture,
          format,
          data,
          mapping,
        );
      }

      const entry = {glyph, mapping};
      glyphs.set(key, entry);
      s.version = incrementVersion(s.version);

      return entry;
    };

    return {
      gpuText,
      atlas,
      source,
      getRadius,
      getScale,
      getGlyph,
    };
  }, [gpuText, atlas, source]);

  return gpuText ? provide(FontContext, context, children) : null;
};