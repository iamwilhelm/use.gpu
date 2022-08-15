import type { LiveComponent, LiveFiber, LiveElement, Task } from '@use-gpu/live';

import { useAsync, useOne } from '@use-gpu/live';

type AwaitProps<T> = {
  promise?: Promise<LiveElement>,
  all?: Promise<LiveElement>[],
};

/** Await one or many promises that return LiveElements. */
export const Await: LiveComponent<AwaitProps<unknown>> = <T>(props: AwaitProps<T>) => {
  const {all, promise} = props;

  const run = useOne(() => (
    all
    ? () => Promise.all(all)
    : () => promise ?? Promise.resolve()
  ), all ?? promise);

  const [value, error] = useAsync<LiveElement | undefined | void>(run);
  return value;
}

