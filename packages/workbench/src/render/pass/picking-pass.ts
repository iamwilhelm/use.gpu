import type { LC, PropsWithChildren, LiveFiber, LiveElement, ArrowFunction } from '@use-gpu/live';
import type { RenderToPass } from '../pass2';

import { use, quote, yeet, memo, multiGather, useContext, useMemo } from '@use-gpu/live';
import { PickingContext } from '../../providers/picking-provider';
import { DeviceContext } from '../../providers/device-provider';
import { useInspectable } from '../../hooks/useInspectable'

export type PickingPassProps = {
  swap?: boolean,
  calls: {
    picking?: RenderToPass[],
  },
};

const NO_OPS: any[] = [];
const toArray = <T>(x?: T[]): T[] => Array.isArray(x) ? x : NO_OPS; 

/** Picking render pass.

Draws all pickable objects as object ID / vertex ID pairs.
*/
export const PickingPass: LC<PickingPassProps> = memo((props: PropsWithChildren<PickingPassProps>) => {
  const {
    swap = true,
    calls,
  } = props;

  const inspect = useInspectable();

  const device = useContext(DeviceContext);
  const pickingContext = useContext(PickingContext);

  const pickings = toArray(calls['picking'] as RenderToPass[]);

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

    const shouldUpdatePicking = pickings.length;
    if (shouldUpdatePicking) {
      const commandEncoder = device.createCommandEncoder();

      const {renderContext} = pickingContext;
      if (swap) renderContext.swap();
      renderToContext(commandEncoder, renderContext, pickings, countGeometry);

      const command = commandEncoder.finish();
      device.queue.submit([command]);
    }

    inspect({
      render: {
        vertexCount: vs,
        triangleCount: ts,
      },
    });

    return null;
  }));

}, 'PickingPass');
