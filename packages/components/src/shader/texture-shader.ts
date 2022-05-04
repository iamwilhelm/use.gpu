import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { TextureSource, UniformAttributeValue } from '@use-gpu/core/types';
import { ShaderModule } from '@use-gpu/shader/types';

import { yeet, useFiber, useMemo, useContext, useNoContext, incrementVersion } from '@use-gpu/live';
import { makeShaderBinding } from '@use-gpu/core';
import { bindingToModule, chainTo } from '@use-gpu/shader/wgsl';

import { RenderContext } from '../providers/render-provider';

import { toGamma4 } from '@use-gpu/wgsl/use/gamma.wgsl';

export type TextureShaderProps = {
  texture?: TextureSource,
  render?: (source: ShaderModule) => LiveElement<any>,
};

const TEXTURE_BINDING = { name: 'getTexture', format: 'vec4<f32>', args: ['vec2<f32>'], value: [0, 0, 0, 0] } as UniformAttributeValue;

export const TextureShader: LiveComponent<TextureShaderProps> = (props) => {
  const { colorSpace } = useContext(RenderContext);

  const {
    texture,
    render,
  } = props;
  
  const key = useFiber().id;
  
  const getTexture = useMemo(() => {
    const textureBinding = makeShaderBinding<ShaderModule>(TEXTURE_BINDING, texture);
    let getTexture = bindingToModule(textureBinding);

    if (texture) {
      const {colorSpace: colorInput} = texture;
      if (colorInput && colorInput !== colorSpace) {
        getTexture = chainTo(getTexture, toGamma4);
      }
    }

    return getTexture;
  }, [texture]);

  return useMemo(() => getTexture ? (render ? render(getTexture) : yeet(getTexture)) : null, [render, getTexture]);
};
