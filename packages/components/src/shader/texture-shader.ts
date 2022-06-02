import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { TextureSource, UniformAttributeValue } from '@use-gpu/core/types';
import { ShaderModule } from '@use-gpu/shader/types';

import { yeet, useMemo } from '@use-gpu/live';
import { useColorTexture } from '../hooks/useColorTexture';

import { RenderContext } from '../providers/render-provider';

import { toGamma4 } from '@use-gpu/wgsl/use/gamma.wgsl';

export type TextureShaderProps = {
  texture?: TextureSource,
  render?: (source: ShaderModule) => LiveElement<any>,
};

const TEXTURE_BINDING = { name: 'getTexture', format: 'vec4<f32>', args: ['vec2<f32>'], value: [0, 0, 0, 0] } as UniformAttributeValue;

export const TextureShader: LiveComponent<TextureShaderProps> = (props) => {
  const {
    texture,
    render,
  } = props;
  
  const getTexture = useColorTexture(texture);

  return useMemo(() => render ? render(getTexture) : yeet(getTexture), [render, getTexture]);
};
