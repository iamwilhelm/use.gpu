import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { Point, ColorSpace, TextureSource } from '@use-gpu/core';

import { DeviceContext } from '../providers/device-provider';
import { use, yeet, gather, memo, useOne, useMemo, useContext } from '@use-gpu/live';
import { makeCopyableTexture, makeTextureView, uploadExternalTexture, updateMipTextureChain } from '@use-gpu/core';
import { Fetch } from './fetch';

export type ImageTextureProps = {
  /** URL to image */
  url?: string,
  /** Color space to tag texture as. Does not convert input data. */
  colorSpace?: ColorSpace,
  /** MIPs */
  mip?: number | boolean,
  /** Texture sampler */
  sampler?: GPUSamplerDescriptor,
  /** Leave empty to yeet texture instead. */
  render?: (source: TextureSource) => LiveElement,
};

const countMips = (width: number, height: number): number => {
  const max = Math.max(width, height);
  return Math.floor(Math.log2(max));
}

export const ImageTexture: LiveComponent<ImageTextureProps> = (props) => {
  const device = useContext(DeviceContext);

  const {
    url,
    sampler,
    mip = true,
    colorSpace = 'srgb',
    render,
  } = props;

  const fetch = (
    use(Fetch, {
      url,
      type: 'blob',
      loading: null,
      then: (blob: Blob | null) => {
        if (blob == null) return null;

        return createImageBitmap(blob, {
          premultiplyAlpha: 'default',
          colorSpaceConversion: 'none',
        });
      },
    })
  );

  return gather(fetch, ([bitmap]: ImageBitmap[]) => {
    if (!bitmap) return null;

    const source = useOne(() => {
      const {width, height} = bitmap;
      const size = [width, height] as Point;

      let format = 'rgba8unorm';
      let cs = colorSpace;
      if (colorSpace === 'srgb') {
        format = 'rgba8unorm-srgb';
        cs = 'linear';
      }

      const mips = (
        typeof mip === 'number' ? mip :
        mip ? countMips(width, height) : 1
      );

      const texture = makeCopyableTexture(device, width, height, format, 1, mips);
      uploadExternalTexture(device, texture, bitmap, size);

      const source = {
        texture,
        view: makeTextureView(texture),
        sampler: {
          minFilter: 'linear',
          magFilter: 'linear',
          mipmapFilter: 'linear',
          maxAnisotropy: 4,
          ...sampler,
        } as GPUSamplerDescriptor,
        layout: 'texture_2d<f32>',
        format,
        size,
        colorSpace: cs,
        version: 1,
      };

      //updateMipTextureChain(device, source);

      return source;
    }, [bitmap, sampler]);

    return useMemo(() => source ? (render ? render(source) : yeet(source)) : null, [render, source]);
  });
};
