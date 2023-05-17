import type { LC, LiveElement } from '@use-gpu/live';
import type { Vox, VoxShape } from './types';

import { gather, use, yeet, useMemo } from '@use-gpu/live';
import { makeTexture, uploadDataTexture } from '@use-gpu/core';
import { useDeviceContext, useRawSource, Fetch } from '@use-gpu/workbench';

import { parseVox, getMipShape } from './lib/vox';

export type VoxDataProps = {
  url?: string,
  data?: ArrayBuffer,
  render?: (vox: Vox) => LiveElement,
};

const resolveURL = (base: string, url: string) => new URL(url, base).href;

export const VoxData: LC<VoxDataProps> = (props) => {
  const {
    data,
    url,
    render
  } = props;

  // Relative URL base for .vox
  const base = props.base ?? new URL(props.url ?? ".", location.href).href;

  // Resume after loading .vox
  const Resume = ([data]: (ArrayBuffer | null)[]) => {
    if (!data) return;

    const mips = 3;
    const device = useDeviceContext();
    const parsed = parseVox(data);

    const {shapes: s, palette: p} = parsed;
    const shapes = useMemo(() => {
      const format: GPUTextureFormat = 'r8uint';
      const layout = 'texture_3d<u32>';
      const variant = 'textureLoad';
      const colorSpace = 'native';
      const usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST;

      return s.map((shape: VoxShape) => {
        const sources: TextureSource[] = [];
        
        let mipShape = shape;
        for (let i = 0; i < mips; ++i) {
          const {size, data} = mipShape;
          const [w, h, d] = size;

          const texture = makeTexture(device, w, h, d, format, usage, 1, 1, '3d');
          const upload = {data, size, format};
          uploadDataTexture(device, texture, upload);

          const source = {
            texture,
            view: texture.createView(),
            sampler: null,
            size,
            layout,
            format,
            variant,
            colorSpace,
            version: 1,
          } as TextureSource;
          sources.push(source);

          mipShape = getMipShape(mipShape);
        }

        return sources;
      });
    }, [device, s]);

    const palette = useMemo(() => {
      const format = 'rgba8unorm-srgb';
      const layout = 'texture_1d<f32>';
      const variant = 'textureLoad';
      const colorSpace = 'linear';
      const usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST;

      const data = p;
      const texture = makeTexture(device, 256, 1, 1, format, usage, 1, 1, '1d');
      const upload = {data, size: [256, 1], format};
      uploadDataTexture(device, texture, upload);

      const source = {
        texture,
        view: texture.createView(),
        sampler: null,
        size: [256, 1],
        layout,
        format,
        variant,
        colorSpace,
        version: 1,
      } as TextureSource;

      return source;
    }, [device, p]);

    const pbr = useRawSource(parsed.pbr, 'vec4<f32>');

    const vox = useMemo(() => ({
      ...parsed,
      bound: {
        shapes,
        palette,
        pbr,
      },
    }), [parsed, shapes, palette, pbr]);

    return render ? render(vox) : yeet(vox);
  };

  // Load .vox or use inline data
  if (props.data) return use(Resume, [props.data]);
  else return gather(use(Fetch, {
    url,
    type: 'arrayBuffer',
  }), Resume);
};
