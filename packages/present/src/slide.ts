import type { LC, PropsWithChildren } from '@use-gpu/live';
import type { UniformAttribute } from '@use-gpu/core';
import type { SlideTrait, TransitionTrait, SlideInfo } from './types';

import { fragment, unquote, quote, gather, fence, yeet, use, wrap, provide, useFiber, useOne, useRef } from '@use-gpu/live';
import { useBoundSource, useLayoutContext, useShaderRef } from '@use-gpu/workbench';
import { Layout, Transform } from '@use-gpu/layout';

import { resolveSlides } from './lib/slides';
import { usePresentTransition } from './present';
import { useSlideTrait, makeUseTransitionTrait } from './traits';

import { getSlideMask } from '@use-gpu/wgsl/mask/slide.wgsl';

const GET_CLIP = {format: 'vec4<f32>', name: 'getClip'} as UniformAttribute;

export type SlideProps = Partial<SlideTrait> & Partial<TransitionTrait> & {
  _foo?: null,
};

const useTransitionTrait = makeUseTransitionTrait({ effect: { type: 'fade', duration: 0.5 } });

export const Slide: LC<SlideProps> = (props: PropsWithChildren<SlideProps>) => {
  const {children} = props;
  const {order, steps, stay} = useSlideTrait(props);
  const {effect, enter, exit} = useTransitionTrait(props);

  const {id} = useFiber();
  const layout = useLayoutContext();
  const {useUpdateTransition, ...transform} = usePresentTransition(id, layout, effect, enter, exit);

  const l = useShaderRef(layout);
  const clip = useBoundSource(GET_CLIP, l);

  return (
    unquote(
      gather(
        quote(
          fence(
            wrap(Layout, use(Transform, {...transform, clip, children})),
            (ops: any) => {
              const visible = useUpdateTransition();
              return visible ? yeet(ops) : null;
            }
          )
        ),
        (slides: SlideInfo[]) => {
          const {resolved, length} = resolveSlides(slides);
          return yeet({
            id,
            order,
            steps: steps ?? (length + 1),
            stay,
            slides: resolved,
            sticky: false,
          });
        },
      )
    )
  );
};
