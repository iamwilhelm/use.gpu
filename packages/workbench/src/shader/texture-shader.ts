import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { TextureSource, Lazy } from '@use-gpu/core';
import type { ShaderSource, ShaderModule } from '@use-gpu/shader';

import { yeet, useMemo, useHooks } from '@use-gpu/live';
import { bundleToAttributes } from '@use-gpu/shader/wgsl';
import { useShaderRefs } from '../hooks/useShaderRef';
import { getDerivedSource } from '../hooks/useDerivedSource';
import { getShader } from '../hooks/useShader';
import { useRenderProp } from '../hooks/useRenderProp';

export type TextureShaderProps = {
  texture: TextureSource,
  shader: ShaderModule,

  source?: ShaderSource,
  sources?: ShaderSource[],
  args?: Lazy<any>[],

  render?: (source: ShaderModule) => LiveElement,
  children?: (source: ShaderModule) => LiveElement,
};

const NO_SOURCES: ShaderSource[] = [];

/** Texture shader for custom UV sampling of a 2D input texture.

Provides:
- `@optional @link fn getTextureSize() -> vec2<f32>`
- `@optional @link fn getTexture(uv: vec2<f32>) -> vec4<f32>`

Unnamed arguments are linked in the order of: args, sources, source.
*/
export const TextureShader: LiveComponent<TextureShaderProps> = (props) => {
  const {
    texture,
    shader,
    source,
    sources = NO_SOURCES,
    args = NO_SOURCES,
    render,
  } = props;

  const argRefs = useShaderRefs(...args);

  const getTexture = useMemo(() => {
    const s = (source ? [source] : NO_SOURCES).map(s => ((s as any)?.buffer)
      ? getDerivedSource(s as any, {readWrite: false}) : s);

    const bindings = bundleToAttributes(shader);
    const links = {
      getTexture: texture,
      getTextureSize: () => texture.size,
    } as Record<string, any>;

    const allArgs = [...argRefs, ...sources, ...s];

    const values = bindings.map(b => {
      let k = b.name;
      return links[k] ? links[k] : allArgs.shift();
    });

    return getDerivedSource(
      { shader: getShader(shader, values) } as any,
      { size: () => (source as any)?.size ?? null, length: () => (source as any)?.length ?? null }
    );
  }, [shader, texture, args.length, source, sources]);

  return useRenderProp(props, getTexture);
};
