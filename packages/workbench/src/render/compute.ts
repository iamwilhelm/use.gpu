
import type { LC, PropsWithChildren, LiveFiber, LiveElement, ArrowFunction } from '@use-gpu/live';

import { use, yeet, quote, memo, provide, multiGather, useContext, useMemo, setLogging } from '@use-gpu/live';
import { useDeviceContext } from '../providers/device-provider';
import { useComputeContext } from '../providers/compute-provider';
import { useInspectable } from '../hooks/useInspectable'
import { Await } from './await';

export type ComputeProps = {
  immediate?: boolean,
  then?: () => LiveElement,
};

type ComputeCounter = (d: number) => void;
type ComputeToPass = (passEncoder: GPUComputePassEncoder, countDispatch: ComputeCounter) => void;

type CommandToBuffer = () => GPUCommandBuffer;

const toArray = <T>(x: T[]): T[] => Array.isArray(x) ? x : [];

/** Simpler version of `<Pass>` that only does compute shaders */
export const Compute: LC<ComputeProps> = memo((props: PropsWithChildren<ComputeProps>) => {
  const {
    immediate,
    children,
    then,
  } = props;

  const inspect = useInspectable();

  const Resume = (rs: Record<string, (ComputeToPass | CommandToBuffer | ArrowFunction)[]>) => {
    const device = useDeviceContext();
    const context = useComputeContext();

    const computes = toArray(rs['compute'] as ComputeToPass[]);
    const pre      = toArray(rs['pre'] as CommandToBuffer[]);
    const post     = toArray(rs['post'] as CommandToBuffer[]);
    const readback = toArray(rs['readback'] as ArrowFunction[]);

    const computeToContext = (
      commandEncoder: GPUCommandEncoder,
      rs: ComputeToPass[],
      countDispatch: ComputeCounter,
    ) => {
      const passEncoder = commandEncoder.beginComputePass();
      let i = 0;
      for (const r of rs) r(passEncoder, countDispatch);
      passEncoder.end();
    };

    const run = () => {
      let ds = 0;

      const countDispatch = (d: number) => { ds += d; };

      const queue: GPUCommandBuffer[] = []
      for (const f of pre) {
        const q = f();
        if (q) queue.push(q);
      }

      const commandEncoder = device.createCommandEncoder();
      if (computes.length) computeToContext(commandEncoder, computes, countDispatch);
      queue.push(commandEncoder.finish());

      for (const f of post) {
        const q = f();
        if (q) queue.push(q);
      }

      device.queue.submit(queue);

      let deferred: Promise<LiveElement>[] | null = null;
      for (const f of readback) {
        const d = f();
        if (d) {
          if (!deferred) deferred = [];
          deferred.push(d);
        }
      }

      inspect({
        render: {
          dispatchCount: ds,
        },
      });

      return deferred ? use(Await, {all: deferred}) : null;
    };

    const view = immediate ? run() : quote(yeet(run));
    if (!then) return view;

    const source = context;
    const children: LiveElement = [view];
    const c = then();
    if (c) children.push(c);
    return children.length > 1 ? children : children[0];
  };

  if (!children) return null;

  return multiGather(children, Resume);
}, 'Compute');
