import type { LC, PropsWithChildren, LiveFiber, LiveElement, ArrowFunction } from '@use-gpu/live';
import type { RenderToPass } from '../pass';

import { use, quote, yeet, memo, multiGather, useContext, useMemo } from '@use-gpu/live';

import { useRenderContext } from '../../providers/render-provider';
import { useDeviceContext } from '../../providers/device-provider';
import { useViewContext } from '../../providers/view-provider';

import { useInspectable } from '../../hooks/useInspectable'

export type ShadowPassProps = {
  calls: {
    opaque?: RenderToPass[],
    transparent?: RenderToPass[],
    debug?: RenderToPass[],
  },
};

const NO_OPS: any[] = [];
const toArray = <T>(x?: T[]): T[] => Array.isArray(x) ? x : NO_OPS; 

/** Shadow render pass.

Draws all shadow calls.
*/
export const ShadowPass: LC<ShadowPassProps> = memo((props: PropsWithChildren<ShadowPassProps>) => {
  const {
    calls,
  } = props;

  const inspect = useInspectable();

  const device = useDeviceContext();
  const renderContext = useRenderContext();
  const {bind} = useViewContext();

  const shadows = toArray(calls['shadow'] as RenderToPass[]);

  const renderToContext = (
    commandEncoder: GPUCommandEncoder,
    context: UseGPURenderContext,
    calls: RenderToPass[],
    countGeometry: RenderCounter,
  ) => {
    const {colorAttachments, depthStencilAttachment} = context;
    const renderPassDescriptor: GPURenderPassDescriptor = {
      colorAttachments,
      depthStencilAttachment: depthStencilAttachment ?? undefined,
    };

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    bind(passEncoder);

    for (const f of calls) f(passEncoder, countGeometry);
    passEncoder.end();
  };

  return quote(yeet(() => {
    let vs = 0;
    let ts = 0;

    const countGeometry = (v: number, t: number) => { vs += v; ts += t; };

    const commandEncoder = device.createCommandEncoder();
    renderContext.swap();
    renderToContext(commandEncoder, renderContext, visibles, countGeometry);

    const command = commandEncoder.finish();
    device.queue.submit([command]);

    inspect({
      render: {
        vertexCount: vs,
        triangleCount: ts,
      },
    });

    return null;
  }));

}, 'ShadowPass');
