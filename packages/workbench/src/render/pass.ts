import type { LC, PropsWithChildren, LiveFiber, LiveElement, Task } from '@use-gpu/live';
import type { UseRenderingContextGPU, RenderPassMode } from '@use-gpu/core';

import { use, yeet, memo, multiGather, useContext, useMemo } from '@use-gpu/live';
import { RenderContext } from '../providers/render-provider';
import { DeviceContext } from '../providers/device-provider';
import { PickingContext } from './picking';
import { useInspectable } from '../hooks/useInspectable'
import { Await } from './await';

export type PassProps = {
  picking?: boolean,
  render?: () => LiveElement<any>,
};

type RenderCounter = (v: number, t: number) => void;
export type RenderToPass = (passEncoder: GPURenderPassEncoder, countGeometry: RenderCounter) => void;

type ComputeCounter = (d: number) => void;
export type ComputeToPass = (passEncoder: GPUComputePassEncoder, countDispatch: ComputeCounter) => void;

export type CommandToEncoder = () => GPUCommandEncoder;

const toArray = <T>(x: T | T[]): T[] => Array.isArray(x) ? x : x != null ? [x] : []; 

type PassDescriptor = {
  pre: CommandToEncoder[],
  compute: ComputeToPass[],
  opaque: RenderToPass[],
  transparent: RenderToPass[],
  debug: RenderToPass[],
  picking: RenderToPass[],
  post: CommandToEncoder[],
  readback: Task[],
};

export const Pass: LC<PassProps> = memo((props: PropsWithChildren<PassProps>) => {
  const {
    picking = true,
    children,
    render,
  } = props;

  const inspect = useInspectable();

  const Resume = (rs: Record<string, (ComputeToPass | RenderToPass | CommandToEncoder)[]>) => {
    const device = useContext(DeviceContext);
    const renderContext = useContext(RenderContext);
    const pickingContext = useContext(PickingContext);

    const computes     = toArray(rs['compute']);
    const opaques      = toArray(rs['opaque']);
    const transparents = toArray(rs['transparent']);
    const debugs       = toArray(rs['debug']);
    const pickings     = toArray(rs['picking']);

    const pre  = toArray(rs['pre']);
    const post = toArray(rs['post']);
    const readback = toArray(rs['readback']);

    const visibles: RenderToPass[] = [];
    visibles.push(...opaques);
    visibles.push(...transparents);
    visibles.push(...debugs);

    const renderToContext = (
      commandEncoder: GPUCommandEncoder,
      context: UseRenderingContextGPU,
      rs: RenderToPass[],
      countGeometry: RenderCounter,
    ) => {
      const {colorAttachments, depthStencilAttachment} = context;
      const renderPassDescriptor: GPURenderPassDescriptor = {
        colorAttachments,
        depthStencilAttachment: depthStencilAttachment ?? undefined,
      };

      const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
      for (const r of rs) r(passEncoder, countGeometry);
      passEncoder.end();
    };

    const computeToContext = (
      commandEncoder: GPUCommandEncoder,
      rs: ComputeToPass[],
      countDispatch: ComputeCounter,
    ) => {
      const passEncoder = commandEncoder.beginComputePass();
      for (const r of rs) r(passEncoder, countDispatch);
      passEncoder.end();
    };

    return yeet(() => {
      let vs = 0;
      let ts = 0;
      let ds = 0;

      const countGeometry = (v: number, t: number) => { vs += v; ts += t; };
      const countDispatch = (d: number) => { ds += d; };

      const queue: GPUCommandEncoder[] = []
      for (const f of pre) {
        const q = f();
        if (q) queue.push(q);
      }

      const commandEncoder = device.createCommandEncoder();
      if (computes.length) computeToContext(commandEncoder, computes, countDispatch);
      renderContext.swapView();
      renderToContext(commandEncoder, renderContext, visibles, countGeometry);

      const shouldUpdatePicking = picking && pickingContext && pickings.length;
      if (shouldUpdatePicking) {
        const {renderContext} = pickingContext!;
        renderContext.swapView();
        renderToContext(commandEncoder, renderContext, pickings, countGeometry);
      }

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
          vertexCount: vs,
          triangleCount: ts,
          dispatchCount: ds,
        },
      });

      return deferred.length ? use(Await, {all: deferred}) : null;
    });
  };

  return multiGather(children ?? (render ? render() : null), Resume);
}, 'Pass');
