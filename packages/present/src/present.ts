import type { LC, LiveElement, PropsWithChildren } from '@use-gpu/live';
import type { SlideInfo } from './types';

import { capture, captureValues, makeCapture, useCapture } from '@use-gpu/live';
import { resolveSlides } from './lib/slides';

export type PresentProps = {
  step?: number,
  length?: number,
};

const SlideCapture = makeCapture<SlideInfo>('SlideCapture');

export const captureSlides = (
  children: LiveElement,
  sticky: boolean,
  then: (slides: ResolvedSlide[], length: number) => void,
) => (
  capture(SlideCapture, children, (slideMap: LiveMap<SlideInfo>) => {
    const slides = captureValues(slideMap);
    const {resolved, length} = resolveSlides(slides, sticky);
    then(resolved, length);
  })
);

export const useSlideCapture = (slide: SlideInfo) => useCapture(SlideCapture, slide);

export const Present: LC<PresentProps> = (props: PropsWithChildren<PresentProps>) => {
  const {
    step = 0,
    length,
    children,
  } = props;
  return captureSlides(children, false, (slides: ResolvedSlide[]) => {
    console.log({slides});
    return null;
  });
};

