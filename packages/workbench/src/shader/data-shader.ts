import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { StorageSource, UniformAttributeValue } from '@use-gpu/core';
import type { ShaderModule } from '@use-gpu/shader';

import { yeet, useMemo } from '@use-gpu/live';
import { bindBundle } from '@use-gpu/shader/wgsl';
import { useNativeColorTexture } from '../hooks/useNativeColor';
import { getBoundSource } from '../hooks/useBoundSource';

export type DataShaderProps = {
  shader?: ShaderModule,
  source: StorageSource,
  render?: (source: ShaderModule) => LiveElement,
};

/** Sample shader for sampling of a linear input buffer.

Provides a `@link fn getSample(i: u32) -> T` where `T` is the source format.
*/
export const DataShader: LiveComponent<DataShaderProps> = (props) => {
  const {
    shader,
    source,
    render,
  } = props;

  const getSample = useMemo(() => {
    const binding = { name: 'getData', format: source.format, args: ['u32'] } as UniformAttributeValue;
    const bound = getBoundSource(binding, source);
    return shader ? bindBundle(shader, {
      getSample: bound
    }) : bound;
  }, [shader, source]);

  return useMemo(() => render ? render(getSample) : yeet(getSample), [render, getSample]);
};
