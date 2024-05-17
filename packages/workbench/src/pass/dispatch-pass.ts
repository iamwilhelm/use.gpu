import type { LC, PropsWithChildren, ArrowFunction } from '@use-gpu/live';

import { yeet, memo } from '@use-gpu/live';
import { useInspectable } from '../hooks/useInspectable'
import { QueueReconciler } from '../reconcilers';

const {quote} = QueueReconciler;

export type DispatchPassProps = {
  calls: {
    dispatch?: ArrowFunction[],
  },
};

const NO_OPS: any[] = [];
const toArray = <T>(x?: T[]): T[] => Array.isArray(x) ? x : NO_OPS;

/** Dispatch pass.

Executes all dispatch calls.
*/
export const DispatchPass: LC<DispatchPassProps> = memo((props: PropsWithChildren<DispatchPassProps>) => {
  const {
    calls,
  } = props;

  const inspect = useInspectable();

  const dispatches = toArray(calls['dispatch'] as ArrowFunction[]);

  const run = () => {
    let ds = 0;

    if (dispatches.length) {
      for (const f of dispatches) f();
    }

    inspect({
      render: {
        dispatchCount: ds,
      },
    });

    return null;
  };

  return quote(yeet(run));

}, 'DispatchPass');
