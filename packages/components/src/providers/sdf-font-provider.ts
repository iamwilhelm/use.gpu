import { LiveComponent } from '@use-gpu/live/types';
import { Atlas } from '@use-gpu/core/types';

import { gather, provide, provideMemo, resume, useAsync, useContext, useMemo, useOne, useState, makeContext, incrementVersion } from '@use-gpu/live';
import { glyphToRGBA, glyphToSDF, padRectangle } from '@use-gpu/text';
import { makeAtlas, makeAtlasSource, resizeTextureSource, uploadAtlasMapping } from '@use-gpu/core';

import { DeviceContext } from './device-provider';
import { GPUTextContext } from './gpu-text-provider';

export const SDFFontContext = makeContext(undefined, 'SDFFontContext');
export const useSDFFont = () => useContext(SDFFontContext);

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
  const gpuText = useContext(GPUTextContext);

  const width = 800;
  const height = 800;
  const pad = 10;
  const radius = 10;

  const format = "rgba8unorm" as GPUTextureFormat;

  const glyphs = useOne(() => new Map<number, GlyphCache>());
  const atlas = useOne(() => makeAtlas(width, height));
  const sourceRef = useOne(() => ({ current: makeAtlasSource(device, atlas, format) }));

  const context = useMemo(() => {
    if (!gpuText) return null;

    const getRadius = () => radius;
    const getScale = (size: number) => size / getNearestScale(size);
    const getGlyph = (id: number, size: number): Entry => {
      const scale = getNearestScale(size);
      const key = hashGlyph(id, scale);

      const cache = glyphs.get(key);
      if (cache) return cache;

      let {current: source} = sourceRef;
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
          mapping = [0, 0, 0, 0];
          console.warn('atlas place failed', key, width, height);
          /*
          debugger;
          throw new Error('atlas place failed', key, width, height);
          */
        }

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
      provideMemo(SDFFontContext, context, children),
      resume((gathered: any) => then ? then(atlas, sourceRef.current, gathered) : null),
    )
  ) : null;
};
