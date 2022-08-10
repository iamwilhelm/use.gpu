import type { LiveComponent, LiveFiber, LiveElement, Task } from '@use-gpu/live';

import { useAsync, useOne } from '@use-gpu/live';

type AwaitProps<T> = {
  promise?: Promise<any>,
  all?: Promise<any>[],
  then?: (value: T | null, error: Error | null) => LiveElement<any>,
};

export const Await: LiveComponent<AwaitProps<unknown>> = <T>(props: AwaitProps<T>) => {
  const {all, promise} = props;

  const run = useOne(() => (
    all
    ? () => Promise.all(all)
    : () => promise ?? Promise.resolve()
  ), all ?? promise);

  const [value, error] = useAsync(run);
  return value;
}

