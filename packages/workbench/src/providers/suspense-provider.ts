import type { LiveComponent, LiveElement, PropsWithChildren } from '@use-gpu/live';
import { yeet, fence, provide, makeContext, useContext, useNoContext, SUSPEND } from '@use-gpu/live';

type SuspenseContextProps = boolean;

export const SuspenseContext = makeContext<SuspenseContextProps>(false, 'SuspenseContext');

export const useSuspenseContext = () => useContext(SuspenseContext);
export const useNoSuspenseContext = () => useNoContext(SuspenseContext);

type SuspenseProps = {
  fallback?: LiveElement,
};

export const Suspense: LiveComponent<SuspenseProps> = (props: PropsWithChildren<SuspenseProps>) => {
  const {fallback} = props;
  const view = provide(SuspenseContext, true, props.children);
  if (fallback) {
    return fence(view, (values: any) => {
      if (values === SUSPEND) return fallback;
      return yeet(values);
    }, SUSPEND);
  }
  return view;
}
