import { TextureSource } from '@use-gpu/core/types';
import { ShaderModule } from '@use-gpu/shader/types';

import { bindingToModule, bundleToAttribute, chainTo } from '@use-gpu/shader/wgsl';
import { makeShaderBinding } from '@use-gpu/core';
import { useContext, useMemo, useNoContext, useNoMemo } from '@use-gpu/live';

import { RenderContext } from '../providers/render-provider';

import { getUIFragment } from '@use-gpu/wgsl/instance/fragment/ui.wgsl';
import { toLinear4, toGamma4 } from '@use-gpu/wgsl/use/gamma.wgsl';

const TEXTURE_BINDING = bundleToAttribute(getUIFragment, 'getTexture');

export const useColorTexture = (texture?: TextureSource) => {
  if (!texture) {
    useNoContext(RenderContext);
    useNoMemo();
    return null;
  }

  const { colorSpace } = useContext(RenderContext);
  const getTexture = useMemo(() => {
    const textureBinding = makeShaderBinding<ShaderModule>(TEXTURE_BINDING, texture);
    let getTexture = bindingToModule(textureBinding);

    if (texture) {
      const {colorSpace: colorInput} = texture;
      if (colorInput && colorInput !== colorSpace) {
        if (colorInput === 'srgb' && colorSpace === 'linear') {
          getTexture = chainTo(getTexture, toLinear4);
        }
        else if (colorInput === 'linear' && colorSpace === 'srgb') {
          getTexture = chainTo(getTexture, toGamma4);
        }
      }
    }

    return getTexture;
  }, [texture, colorSpace]);

  return getTexture;
};
