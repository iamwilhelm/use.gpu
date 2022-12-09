import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { UniformAttribute } from '@use-gpu/core';
import type { ShaderSource, ShaderModule } from '@use-gpu/shader';

import { use, useMemo } from '@use-gpu/live';
import { bindBundle } from '@use-gpu/shader/wgsl';
import { useRenderContext } from '../providers/render-provider';
import { getBoundSource } from '../hooks/useBoundSource';
import { RawFullScreen } from '../primitives';

export type FeedbackProps = {
  shader?: ShaderModule,
};

const TEXTURE_BINDING = {name: 'getTexture', format: 'vec4<f32>', args: ['vec2<f32>']} as UniformAttribute;
const TEXTURE_SIZE_BINDING = { name: 'getTextureSize', format: 'vec2<f32>', args: [], value: [0, 0] } as UniformAttributeValue;

/** Render last frame from the current render target, with an optional shader applied.

Provides:
- `@link getTextureSize(uv: vec2<f32>) -> vec2<f32>`
- `@link getTexture(uv: vec2<f32>) -> vec4<f32>`
*/
export const Feedback: LiveComponent<FeedbackProps> = ({shader}: FeedbackProps) => {
  const {source, width, height} = useRenderContext();
  const history = source?.history;
  if (!history) throw new Error("Can't render feedback. Render context has no history.");

  return useMemo(() => {
    const getTexture     = getBoundSource(TEXTURE_BINDING, history[0]);
    const getTextureSize = getBoundSource(TEXTURE_SIZE_BINDING, () => [width, height]);

    const t = shader ? bindBundle(shader, {
      getTexture,
      getTextureSize,
    }) : getTexture;
    
    return use(RawFullScreen, {
      texture: t,
    });
  }, [shader, history, width, height]);
}
