import type { LC, PropsWithChildren, LiveFiber, LiveElement, ArrowFunction, UniformPipe } from '@use-gpu/live';
import type { Renderable } from '../pass';

import { use, quote, yeet, memo, multiGather, useContext, useMemo } from '@use-gpu/live';

import { usePickingContext } from '../../providers/picking-provider';
import { useDeviceContext } from '../../providers/device-provider';
import { useViewContext } from '../../providers/view-provider';

import { useInspectable } from '../../hooks/useInspectable'

import { getRenderPassDescriptor, getDrawOrder } from './util';

export type PickingPassProps = {
  swap?: boolean,
  calls: {
    picking?: Renderable[],
  },
};

const NO_OPS: any[] = [];
const toArray = <T>(x?: T[]): T[] => Array.isArray(x) ? x : NO_OPS; 

/** Picking render pass.

Draws all pickable objects as object ID / vertex ID pairs.
*/
export const PickingPass: LC<PickingPassProps> = memo((props: PropsWithChildren<PickingPassProps>) => {
  const {
    overlay = false,
    merge = false,
    calls,
  } = props;

  const inspect = useInspectable();

  const device = useDeviceContext();
  const pickingContext = usePickingContext();
  const {cull, bind} = useViewContext();

  const {renderContext} = pickingContext;

  const pickings  = toArray(calls['picking'] as RenderToPass[]);

  const renderPassDescriptor = useMemo(() =>
    getRenderPassDescriptor(renderContext, overlay, merge),
    [renderContext, overlay, merge]);

  const drawToPass = (
    calls: Renderable[],
    passEncoder: GPURenderPassEncoder,
    countGeometry: (v: number, t: number) => void,
    sign: number = 1,
  ) => {
    const order = getDrawOrder(cull, calls, sign);
    for (const i of order) calls[i].draw(passEncoder, countGeometry);
  };

  return quote(yeet(() => {
    let vs = 0;
    let ts = 0;

    const countGeometry = (v: number, t: number) => { vs += v; ts += t; };

    const commandEncoder = device.createCommandEncoder();
    if (!overlay && !merge) renderContext.swap();

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    bind(passEncoder);

    drawToPass(pickings, passEncoder, countGeometry);

    passEncoder.end();

    const command = commandEncoder.finish();
    device.queue.submit([command]);

    inspect({
      render: {
        vertices: vs,
        triangles: ts,
      },
    });

    return null;
  }));

}, 'PickingPass');
