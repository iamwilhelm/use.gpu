import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { ColorSpace, DataTexture, TypedArray } from '@use-gpu/core';

import { use, yeet, gather, memo, useMemo, useYolo } from '@use-gpu/live';
import { Await } from '../queue/await';
import { Fetch } from './fetch';

import { parseHDR } from '../codec/hdr';
import { parseRGBM16 } from '../codec/rgbm16';

const MIME_TYPES = {
  'png': 'image/png',
  'jpg': 'image/jpeg',
  'hdr': 'image/vnd.radiance',
} as Record<string, string>;

type LoadedImage = {
  bitmap?: ImageBitmap,
  data?: DataTexture,
}

export type ImageLoaderProps = {
  /** URL For image */
  url: string,
  /** Type hint (extension or mime type) */
  format?: string,
  /** Color space */
  colorSpace?: ColorSpace,
  /** Premultiply alpha */
  premultiply?: boolean,
  /** Leave empty to yeet image instead. */
  render?: (image: LoadedImage) => LiveElement,
};

export const ImageLoader: LiveComponent<ImageLoaderProps> = (props) => {

  const {
    url,
    format,
    colorSpace,
    premultiply,
    render,
  } = props;

  const ext = url.split(/\./g).pop()!.toLowerCase();

  return use(Fetch, {
    url,
    loading: null,
    render,
    then: async (response: Response) => {
      if (!response) return null;

      const mime = response.headers.get('content-type') ?? MIME_TYPES[format!] ?? 'bin';

      const resolveFormat = (data: DataTexture) => {
        let {format} = data;
        let cs = colorSpace;

        if (colorSpace === 'srgb' && format?.match(/^(rgba|bgra)8unorm$/)) {
          format += '-srgb';
          cs = 'linear';
        }
        
        return {data: {...data, format}, colorSpace: cs};
      };

      let resource;
      if (format === 'hdr' || mime === 'image/vnd.radiance') {
        const arrayBuffer = await response.arrayBuffer();
        try {
          return resolveFormat(parseHDR(arrayBuffer));
        } catch (e) { console.error(e); }        
      }
      else if (format === 'rgbm16') {
        const arrayBuffer = await response.arrayBuffer();

        // @ts-ignore
        const decoder = new ImageDecoder({
          data: arrayBuffer,
          type: mime,
          premultiplyAlpha: premultiply ? 'premultiply' : 'none',
          colorSpaceConversion: 'none',            
        });

        const {image} = await decoder.decode({ frameIndex: 0 });
        const {codedWidth: w, codedHeight: h} = image;

        const buffer = new Uint8Array(image.allocationSize());
        image.copyTo(buffer);
        
        let decoded: GPUTextureFormat = 'rgba8unorm';
        if (image.format.slice(0, 3) === 'BGR') decoded = 'bgra8unorm';

        let out: TypedArray = buffer;
        if (format === 'rgbm16') {
          const flip = !!decoded.match(/^bgr/);
          out = parseRGBM16(buffer, w, h, flip);
          decoded = 'rgba16float';
        }

        return resolveFormat({
          data: out,
          size: [w, h],
          format: decoded,
        });
      }
      else {
        const blob = await response.blob();
        return {
          bitmap: await createImageBitmap(blob, {
            premultiplyAlpha: premultiply ? 'premultiply' : 'none',
            colorSpaceConversion: 'none',
          }),
        };
      }
    },
  });
};
