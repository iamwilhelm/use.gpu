import type { LC, PropsWithChildren, LiveFiber, LiveElement, ArrowFunction } from '@use-gpu/live';
import type { RenderToPass } from '../pass';

import { use, quote, yeet, memo, multiGather, useContext, useMemo } from '@use-gpu/live';
import { RenderContext } from '../../providers/render-provider';
import { DeviceContext } from '../../providers/device-provider';
import { useInspectable } from '../../hooks/useInspectable'

export type ColorPassProps = {
  calls: {
    opaque?: RenderToPass[],
    transparent?: RenderToPass[],
    debug?: RenderToPass[],
  },
};

const NO_OPS: any[] = [];
const toArray = <T>(x?: T[]): T[] => Array.isArray(x) ? x : NO_OPS; 

/** Color render pass.

Draws all opaque calls, then all transparent calls, then all debug wireframes.
*/
export const ColorPass: LC<ColorPassProps> = memo((props: PropsWithChildren<ColorPassProps>) => {
  const {
    calls,
  } = props;

  const inspect = useInspectable();

  const device = useContext(DeviceContext);
  const renderContext = useContext(RenderContext);

  const opaques      = toArray(calls['opaque']      as RenderToPass[]);
  const transparents = toArray(calls['transparent'] as RenderToPass[]);
  const debugs       = toArray(calls['debug']       as RenderToPass[]);

  const visibles: RenderToPass[] = [];
  visibles.push(...opaques);
  visibles.push(...transparents);
  visibles.push(...debugs);

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

}, 'ColorPass');
