import type { LC, LiveElement, PropsWithChildren } from '@use-gpu/live';
import type { SlideTrait } from './types';

import { unquote, fence, fragment, yeet, use, useFiber } from '@use-gpu/live';
import { useLayoutContext } from '@use-gpu/workbench';
import { Transform } from '@use-gpu/layout';

import { usePresentTransition } from './present';
import { useSlideTrait, makeUseTransitionTrait } from './traits';

export type StepProps = Partial<SlideTrait> & Partial<TransitionTrait>;

const useTransitionTrait = makeUseTransitionTrait({ effect: { type: 'wipe', duration: 0.15 } });

export const Step: LC<StepProps> = (props: PropsWithChildren<StepProps>) => {
  const {children} = props;
  const {order, steps, stay} = useSlideTrait(props);
  const {effect, enter, exit} = useTransitionTrait(props);

  const {id} = useFiber();
  const layout = useLayoutContext();
  const {useUpdateTransition, ...transform} = usePresentTransition(id, layout, effect, enter, exit);

  return fence(
    unquote(yeet({
      id,
      order,
      steps,
      stay,
      sticky: true,
    })),
    () => {
      useUpdateTransition();
      return use(Transform, {...transform, children});
    },
  );
};
