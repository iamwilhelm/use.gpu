import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { TextureSource, UniformAttributeValue } from '@use-gpu/core';
import type { ShaderModule } from '@use-gpu/shader';

import { yeet, useMemo } from '@use-gpu/live';
import { bindBundle } from '@use-gpu/shader/wgsl';
import { useNativeColorTexture } from '../hooks/useNativeColor';
import { getBoundSource } from '../hooks/useBoundSource';

import { useRenderContext } from '../providers/render-provider';

import { toGamma4 } from '@use-gpu/wgsl/use/gamma.wgsl';

export type TextureShaderProps = {
  shader?: ShaderModule,
  texture?: TextureSource,
  render?: (source: ShaderModule) => LiveElement,
};

const TEXTURE_BINDING = { name: 'getTexture', format: 'vec4<f32>', args: ['vec2<f32>'], value: [0, 0, 0, 0] } as UniformAttributeValue;
const TEXTURE_SIZE_BINDING = { name: 'getTextureSize', format: 'vec2<f32>', args: [], value: [0, 0] } as UniformAttributeValue;
const TARGET_SIZE_BINDING = { name: 'getTargetSize', format: 'vec2<f32>', args: [], value: [0, 0] } as UniformAttributeValue;

/** Texture shader for custom UV sampling of a 2D input texture.

Provides a `@link fn getTexture(uv: vec2<f32>) -> vec4<f32>` to sample the given texture.
*/
export const TextureShader: LiveComponent<TextureShaderProps> = (props) => {
  const {
    shader,
    texture,
    render,
  } = props;

  const inputTexture = useNativeColorTexture(texture);
  const renderContext = useRenderContext();

  const getTexture = useMemo(() => {
    const getTexture     = getBoundSource(TEXTURE_BINDING, texture);
    const getTextureSize = getBoundSource(TEXTURE_SIZE_BINDING, () => texture.size);
    const getTargetSize  = getBoundSource(TARGET_SIZE_BINDING, () => [renderContext.width, renderContext.height]);

    return shader ? bindBundle(shader, {
      getTexture,
      getTextureSize,
      getTargetSize,
    }) : getTexture;
  }, [shader, texture, renderContext]);

  return useMemo(() => render ? render(getTexture) : yeet(getTexture), [render, getTexture]);
};
