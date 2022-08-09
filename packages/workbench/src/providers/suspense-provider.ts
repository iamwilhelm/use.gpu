import type { LiveComponent, PropsWithChildren, UseRenderingContextGPU } from '@use-gpu/core';
import { provide, makeContext, useContext, useNoContext } from '@use-gpu/live';

type SuspenseContextProps = boolean;

export const SuspenseContext = makeContext<SuspenseContextProps>(false, 'SuspenseContext');

export const useSuspenseContext = () => useContext(SuspenseContext);
export const useNoSuspenseContext = () => useNoContext(SuspenseContext);

export const Suspense: LiveComponent<object> = (props: PropsWithChildren<object>) => {
  return provide(SuspenseContext, true, props.children);
}
