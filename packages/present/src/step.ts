import type { LC, LiveElement, PropsWithChildren } from '@use-gpu/live';
import type { SlideTrait } from './types';

import { useFiber } from '@use-gpu/live';
import { useSlideCapture } from './present';
import { resolveSlides } from './lib/slides';

export type StepProps = Partial<SlideTrait> & {
  render?: (state: boolean) => LiveElement,
};

export const Step: LC<StepProps> = (props: PropsWithChildren<StepProps>) => {
  const {order, steps, stay, render} = props;

  const {id} = useFiber();
  useSlideCapture({
    id,
    order,
    steps,
    stay,
  });

  return null;
};
