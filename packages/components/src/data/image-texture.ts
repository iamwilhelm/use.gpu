import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { TypedArray, DataTexture, TextureSource, UniformType, Emitter } from '@use-gpu/core/types';
import { DeviceContext } from '../providers/device-provider';
import { usePerFrame, useNoPerFrame } from '../providers/frame-provider';
import { useAnimationFrame, useNoAnimationFrame } from '../providers/loop-provider';
import { yeet, memo, useMemo, useNoMemo, useContext, useNoContext, incrementVersion } from '@use-gpu/live';
import { makeSampler, makeRawTexture, makeTextureView, uploadDataTexture } from '@use-gpu/core';

export type ImageTextureProps = {
  url?: string,
  colorSpace?: string,
  sampler?: GPUSamplerDescriptor,
  render?: (source: TextureSource) => LiveElement<any>,
};

export const ImageTexture: LiveComponent<ImageTextureProps> = (props) => {
  const device = useContext(DeviceContext);

  const {
    url,
    sampler,
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
          alpha: 'default',
          colorSpaceConversion: 'none',
        });
      },
    })
  );

  return gather(fetch, ([bitmap]: BitmapImage) => {
    
    const source = useOne(() => {
      const size = [bitmap.width, bitmap.height];
      const format = 'rgba8unorm';

      const texture = makeCopyableTexture(device, bitmap.width, bitmap.height, format);
      uploadExternalTexture(device, texture, bitmap, size);

      return {
        texture,
        view: makeTextureView(texture),
        sampler: {
          minFilter: 'nearest',
          magFilter: 'nearest',
          ...sampler,
        } as GPUSamplerDescriptor,
        layout: 'texture_2d<f32>',
        format,
        size,
        colorSpace,
        version: 0,
      };
    }, [bitmap, sampler]);

  });

  return useMemo(() => source ? (render ? render(source) : yeet(source)) : null, [render, source]);
};
