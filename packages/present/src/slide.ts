import type { LC, PropsWithChildren } from '@use-gpu/live';
import type { SlideTrait, TransitionTrait, SlideInfo } from './types';

import { fragment, unquote, quote, gather, fence, yeet, use, wrap, provide, useFiber, useOne, useRef } from '@use-gpu/live';
import { useBoundShader, useLayoutContext } from '@use-gpu/workbench';
import { Layout, Transform } from '@use-gpu/layout';

import { resolveSlides } from './lib/slides';
import { usePresentTransition } from './present';
import { useSlideTrait } from './traits';

import { getSlideMask } from '@use-gpu/wgsl/mask/slide.wgsl';

export type SlideProps = Partial<SlideTrait> & Partial<TransitionTrait> & {
  _foo?: null,
};

export const Slide: LC<SlideProps> = (props: PropsWithChildren<SlideProps>) => {
  const {children} = props;
  const {order, steps, stay} = useSlideTrait(props);

  const {id} = useFiber();
  const layout = useLayoutContext();
  const {useUpdateTransition, ...transform} = usePresentTransition(id, props, layout);

  return (
    unquote(
      gather(
        quote(
          fence(
            wrap(Layout, use(Transform, {...transform, children})),
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
