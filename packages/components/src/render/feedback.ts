import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { ShaderSource, ShaderModule } from '@use-gpu/shader/types';

import { use, useMemo } from '@use-gpu/live';
import { bindBundle } from '@use-gpu/shader/wgsl';
import { useFeedbackContext } from '../providers/feedback-provider';
import { useBoundSource } from '../hooks/useBoundSource';
import { RawFullScreen } from '../primitives';

type FeedbackProps = {
  shader?: ShaderModule,
};

const FEEDBACK_BINDING = {name: 'getFeedback', format: 'vec4<f32>', args: ['vec2<f32>']};

export const Feedback: LiveComponent<FeedbackProps> = ({shader}: FeedbackProps) => {
  const texture = useFeedbackContext();
  const source = useBoundSource(FEEDBACK_BINDING, texture);

  return useMemo(() => (
    use(RawFullScreen, {
      texture: shader ? bindBundle(shader, {getFeedback: source}) : source,
    })
  ), [shader, texture]);
}
