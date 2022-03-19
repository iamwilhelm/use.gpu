import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { TextureSource } from '@use-gpu/core/types';
import { ShaderModule } from '@use-gpu/shader/wgsl/types';

import { yeet, useFiber, useMemo, useContext, useNoContext, incrementVersion } from '@use-gpu/live';
import { makeShaderBindings } from '@use-gpu/core';
import { bindingToModule } from '@use-gpu/shader/wgsl';

export type TextureShaderProps = {
  texture?: TextureSource,
  render?: (source: ShaderBundle) => LiveElement<any>,
};

const TEXTURE_BINDINGS = [
  { name: 'getTexture', format: 'vec4<f32>', args: ['vec2<f32>'], value: [0, 0, 0, 0] }
];

export const TextureShader: LiveComponent<TextureShaderProps> = (props) => {
  const {
    texture,
    render,
  } = props;
  
  const key = useFiber().id;
  
  const getTexture = useMemo(() => {
    const [textureBinding] = makeShaderBindings<ShaderModule>(TEXTURE_BINDINGS, [texture]);
    const getTexture = bindingToModule(textureBinding);
    return getTexture;
  }, [texture]);

  return useMemo(() => getTexture ? (render ? render(getTexture) : yeet(getTexture)) : null, [render, getTexture]);
};
