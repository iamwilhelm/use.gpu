
import type { LC, PropsWithChildren, LiveFiber, LiveElement, Task } from '@use-gpu/live';

import { use, yeet, memo, provide, multiGather, useContext, useMemo } from '@use-gpu/live';
import { DeviceContext } from '../providers/device-provider';
import { ComputeContext, useComputeContext, useNoComputeContext } from '../providers/compute-provider';
import { usePerFrame, useNoPerFrame } from '../providers/frame-provider';
import { useInspectable } from '../hooks/useInspectable'
import { Await } from './await';

export type ComputeProps = {
  live?: boolean,
  render?: () => LiveElement<any>,
};

type ComputeCounter = (d: number) => void;
export type ComputeToPass = (passEncoder: GPUComputePassEncoder, countDispatch: ComputeCounter) => void;

export type CommandToEncoder = () => GPUCommandEncoder;

const toArray = <T>(x: T | T[]): T[] => Array.isArray(x) ? x : x != null ? [x] : []; 

type PassDescriptor = {
  pre: CommandToEncoder[],
  compute: ComputeToPass[],
  post: CommandToEncoder[],
  readback: Task[],
};

/** Combination of `<Draw>` + `<Pass>` that only does compute shaders */
export const Compute: LC<ComputeProps> = memo((props: PropsWithChildren<ComputeProps>) => {
  const {
    live = false,
    picking = true,
    children,
    render,
  } = props;

  const inspect = useInspectable();

  if (live) usePerFrame();
  else useNoPerFrame();

  const Resume = (rs: Record<string, (ComputeToPass | CommandToEncoder | Task)[]>) => {
    const device = useContext(DeviceContext);

    usePerFrame();

    const computes = toArray(rs['compute']);
    const pre      = toArray(rs['pre']);
    const post     = toArray(rs['post']);
    const readback = toArray(rs['readback']);

    const computeToContext = (
      commandEncoder: GPUCommandEncoder,
      rs: ComputeToPass[],
      countDispatch: ComputeCounter,
    ) => {
      const passEncoder = commandEncoder.beginComputePass();
      for (const r of rs) r(passEncoder, countDispatch);
      passEncoder.end();
    };

    let ds = 0;

    const countDispatch = (d: number) => { ds += d; };

    const queue: GPUCommandEncoder[] = []
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

    const deferred: Promise<LiveElement<any>> = [];
    for (const f of readback) {
      const d = f();
      if (d) deferred.push(d);
    }

    inspect({
      render: {
        dispatchCount: ds,
      },
    });

    return deferred.length ? use(Await, {all: deferred}) : null;
  };

  const content = render ? render() : children;
  if (!content) return null;

  return multiGather(content, Resume);
}, 'Compute');
