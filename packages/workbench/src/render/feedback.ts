import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { UniformAttribute } from '@use-gpu/core';
import type { ShaderSource, ShaderModule } from '@use-gpu/shader';

import { use, useMemo } from '@use-gpu/live';
import { bindBundle } from '@use-gpu/shader/wgsl';
import { useRenderContext } from '../providers/render-provider';
import { useBoundSource } from '../hooks/useBoundSource';
import { RawFullScreen } from '../primitives';

export type FeedbackProps = {
  shader?: ShaderModule,
};

const FEEDBACK_BINDING = {name: 'getFeedback', format: 'vec4<f32>', args: ['vec2<f32>']} as UniformAttribute;

export const Feedback: LiveComponent<FeedbackProps> = ({shader}: FeedbackProps) => {
  const context = useRenderContext();
  const history = context.source?.history;
  if (!history) throw new Error("Can't render feedback. Render context has no history.");

  const source = useBoundSource(FEEDBACK_BINDING, history[0]);

  return useMemo(() => (
    use(RawFullScreen, {
      texture: shader ? bindBundle(shader, {getFeedback: source}) : source,
    })
  ), [shader, source]);
}
