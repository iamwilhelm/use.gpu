import type { LC, PropsWithChildren } from '@use-gpu/live';
import type { UniformAttribute } from '@use-gpu/core';
import type { UIAggregate } from '@use-gpu/layout';
import type { TraitProps } from '@use-gpu/traits';
import type { SlideInfo } from '../types';

import { fragment, unquote, gather, yeet, use, wrap, provide, useFiber, useMemo, useOne, useRef } from '@use-gpu/live';
import { Layout } from '@use-gpu/layout';

import { resolveSlides } from '../lib/slides';
import { PresentReconciler } from '../reconcilers';
import { SlideTrait, TransitionTrait, useSlideTrait, makeUseTransitionTrait } from '../traits';

import { CaptureLayout } from './capture-layout';

const {quote} = PresentReconciler;

export type SlideProps = TraitProps<typeof SlideTrait> & TraitProps<typeof TransitionTrait>;

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
