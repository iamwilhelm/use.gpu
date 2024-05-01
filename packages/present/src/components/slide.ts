import type { LC, PropsWithChildren } from '@use-gpu/live';
import type { DeepPartial, UniformAttribute } from '@use-gpu/core';
import type { SlideTrait, TransitionTrait, SlideInfo } from './types';

import { fragment, unquote, gather, yeet, use, wrap, provide, useFiber, useMemo, useOne, useRef } from '@use-gpu/live';
import { Layout } from '@use-gpu/layout';

import { resolveSlides } from '../lib/slides';
import { PresentReconciler } from '../reconcilers';
import { useSlideTrait, makeUseTransitionTrait } from '../traits';

import { CaptureLayout } from './capture-layout';

const {quote} = PresentReconciler;

export type SlideProps = Partial<SlideTrait> & DeepPartial<TransitionTrait> & {
  _foo?: null,
};

const useTransitionTrait = makeUseTransitionTrait({ effect: { type: 'fade', duration: 0.5 } });

export const Slide: LC<SlideProps> = (props: PropsWithChildren<SlideProps>) => {
  const {children} = props;
  const {order, stay} = useSlideTrait(props);
  const {effect, enter, exit} = useTransitionTrait(props as any);

  const {id} = useFiber();

  return (
    unquote(
      gather(
        quote(
          use(CaptureLayout, {
            children,
            then: (ops: UIAggregate[]) => {
              return useMemo(
                () => yeet({
                  id,
                  ops,
                  enter: {...effect, ...enter},
                  exit: {...effect, ...exit},
                }),
                [id, ops, effect, enter, exit]
              );
            }
          })
        ),
        (slides: SlideInfo[]) => {
          const {resolved, length} = resolveSlides(slides);
          const s = length + 1;
          return yeet({
            id,
            order,
            steps: s,
            stay,
            thread: true,
            slides: resolved,
            sticky: false,
          });
        },
      )
    )
  );
};
