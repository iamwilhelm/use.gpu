import type { LC, PropsWithChildren } from '@use-gpu/live';
import type { SlideTrait } from './types';

import { useFiber } from '@use-gpu/live';
import { captureSlides, useSlideCapture } from './present';
import { resolveSlides } from './lib/slides';

export type SlideProps = Partial<SlideTrait> & {
  _foo?: null,
};

export const Slide: LC<SlideProps> = (props: PropsWithChildren<SlideProps>) => {
  const {order, steps, stay, children} = props;
  const {id} = useFiber();

  return captureSlides(children, true, (slides: ResolvedSlide[], length: number) => {
    console.log({slides, length});
    useSlideCapture({
      id,
      order,
      steps: steps ?? (length + 1),
      stay,
      slides,
    });
    return null;
  });
};
