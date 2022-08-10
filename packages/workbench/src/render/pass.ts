import type { LC, PropsWithChildren, LiveFiber, LiveElement, ArrowFunction } from '@use-gpu/live';
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

export type CommandToBuffer = () => GPUCommandBuffer;

const toArray = <T>(x?: T[]): T[] => Array.isArray(x) ? x : []; 

export const Pass: LC<PassProps> = memo((props: PropsWithChildren<PassProps>) => {
  const {
    picking = true,
    children,
    render,
  } = props;

  const inspect = useInspectable();

  const Resume = (rs: Record<string, (ComputeToPass | RenderToPass | CommandToBuffer | ArrowFunction)[]>) => {
    const device = useContext(DeviceContext);
    const renderContext = useContext(RenderContext);
    const pickingContext = useContext(PickingContext);

    const computes     = toArray(rs['compute']     as ComputeToPass[]);
    const opaques      = toArray(rs['opaque']      as RenderToPass[]);
    const transparents = toArray(rs['transparent'] as RenderToPass[]);
    const debugs       = toArray(rs['debug']       as RenderToPass[]);
    const pickings     = toArray(rs['picking']     as RenderToPass[]);

    const pre      = toArray(rs['pre']      as CommandToBuffer[]);
    const post     = toArray(rs['post']     as CommandToBuffer[]);
    const readback = toArray(rs['readback'] as ArrowFunction[]);

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

      const queue: GPUCommandBuffer[] = []
      for (const f of pre) {
        const q = f();
        if (q) queue.push(q);
      }

      const commandEncoder = device.createCommandEncoder();
      if (computes.length) computeToContext(commandEncoder, computes, countDispatch);
      renderContext.swap();
      renderToContext(commandEncoder, renderContext, visibles, countGeometry);

      const shouldUpdatePicking = picking && pickingContext && pickings.length;
      if (shouldUpdatePicking) {
        const {renderContext} = pickingContext!;
        renderContext.swap();
        renderToContext(commandEncoder, renderContext, pickings, countGeometry);
      }

      queue.push(commandEncoder.finish());

      for (const f of post) {
        const q = f();
        if (q) queue.push(q);
      }

      device.queue.submit(queue);

      const deferred: Promise<LiveElement<any>>[] = [];
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
