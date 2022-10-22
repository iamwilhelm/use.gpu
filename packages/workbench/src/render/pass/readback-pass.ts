import type { LC, PropsWithChildren, LiveFiber, LiveElement, ArrowFunction } from '@use-gpu/live';
import type { UseGPURenderContext, RenderPassMode } from '@use-gpu/core';
import type { CommandToBuffer } from '../pass2';

import { use, quote, yeet, memo, multiGather, useContext, useMemo } from '@use-gpu/live';
import { RenderContext } from '../../providers/render-provider';
import { DeviceContext } from '../../providers/device-provider';
import { Await } from '../await';

export type ReadbackPassProps = {
  calls: {
    post?: CommandToBuffer[],
    readback?: ArrowFunction[],
  },
};

const NO_OPS: any[] = [];
const toArray = <T>(x?: T[]): T[] => Array.isArray(x) ? x : NO_OPS; 

/** Readback pass.

Executes all post-compute calls and awaits promises for readback.
*/
export const ReadbackPass: LC<ReadbackPassProps> = memo((props: PropsWithChildren<ReadbackPassProps>) => {
  const {
    calls,
  } = props;

  const device = useContext(DeviceContext);

  const post     = toArray(rs['post']     as CommandToBuffer[]);
  const readback = toArray(rs['readback'] as ArrowFunction[]);

  return quote(yeet(() => {
    let deferred: Promise<LiveElement>[] | null = null;

    const queue: GPUCommandBuffer[] = []
    for (const f of post) {
      const q = f();
      if (q) queue.push(q);
    }
    device.queue.submit(queue);

    for (const f of readback) {
      const d = f();
      if (d) {
        if (!deferred) deferred = [];
        deferred.push(d);
      }
    }

    return deferred ? use(Await, {all: deferred}) : null;
  }));
}, 'ReadbackPass');
