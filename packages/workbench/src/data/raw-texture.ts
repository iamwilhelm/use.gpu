import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { TypedArray, DataTexture, TextureSource } from '@use-gpu/core';

import { DeviceContext } from '../providers/device-provider';
import { useAnimationFrame, useNoAnimationFrame } from '../providers/loop-provider';
import { yeet, signal, memo, useOne, useMemo, useNoMemo, useContext, useNoContext, useYolo, incrementVersion } from '@use-gpu/live';
import { makeSampler, makeRawTexture, uploadDataTexture, updateMipTextureChain, updateMipArrayTextureChain } from '@use-gpu/core';

export type RawTextureProps = {
  /** Texture data */
  data: DataTexture,
  /** MIPs */
  mip?: number | boolean,
  /** Texture sampler */
  sampler?: GPUSamplerDescriptor,
  /** Resample data every animation frame */
  live?: boolean,

  /** Sample in absolute pixels instead of relative UVs */
  absolute?: boolean,

  /** Leave empty to yeet source(s) instead. */
  render?: (source: TextureSource) => LiveElement,
};

const countMips = (width: number, height: number): number => {
  const max = Math.max(width, height);
  return Math.floor(Math.log2(max));
}

/** Use numeric texture data as a 2D texture. */
export const RawTexture: LiveComponent<RawTextureProps> = (props) => {
  const device = useContext(DeviceContext);

  const {
    data,
    sampler,
    render,
    mip = false,
    absolute = false,
    live = false,
  } = props;

  const memoKey = data ? [data.format, ...data.size].join('/') : null;

  // Make source texture from data
  const source = useMemo(() => {
    const {
      size,
      layout = 'texture_2d<f32>',
      format = 'rgba8unorm',
      colorSpace = 'native',
    } = data;

    const mips = (
      typeof mip === 'number' ? mip :
      mip ? countMips(size[0], size[1]) : 1
    );

    const texture = makeRawTexture(device, data, mips);
    const source = {
      texture,
      sampler: {
        minFilter: 'nearest',
        magFilter: 'nearest',
        ...sampler,
      } as GPUSamplerDescriptor,
      mips,
      size,
      layout,
      format,
      colorSpace,
      absolute,
      version: 0,
    };
    return source;
  }, [device, memoKey, sampler, absolute, mip]);

  // Refresh and upload data
  const refresh = () => {
    if (!source || !data) return;

    uploadDataTexture(device, source.texture, data);
    source.version = incrementVersion(source.version);

    if (source.mips > 1) {
      if (source.layout.match(/array/)) updateMipArrayTextureChain(device, source);
      else updateMipTextureChain(device, source);
    }
  };

  if (!live) {
    useNoAnimationFrame();
    useMemo(refresh, [device, source, data]);
  }
  else {
    useAnimationFrame();
    useNoMemo();
    refresh();
  }

  const trigger = useOne(() => signal(), source.version);
  const view = useYolo(() => render ? render(source) : yeet(source), [render, source]);
  return [trigger, view];
};
