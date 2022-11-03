import type { LC, PropsWithChildren, LiveFiber, LiveElement, ArrowFunction, UniformPipe } from '@use-gpu/live';
import type { Renderable } from '../pass';

import { use, quote, yeet, memo, multiGather, useContext, useMemo } from '@use-gpu/live';

import { useRenderContext } from '../../providers/render-provider';
import { useDeviceContext } from '../../providers/device-provider';
import { useViewContext } from '../../providers/view-provider';

import { useInspectable } from '../../hooks/useInspectable'

import { getRenderPassDescriptor, getDrawOrder } from './util';

export type ColorPassProps = {
  calls: {
    opaque?: Renderable[],
    transparent?: Renderable[],
    debug?: Renderable[],
  },
};

const NO_OPS: any[] = [];
const toArray = <T>(x?: T[]): T[] => Array.isArray(x) ? x : NO_OPS; 

/** Color render pass.

Draws all opaque calls, then all transparent calls, then all debug wireframes.
*/
export const ColorPass: LC<ColorPassProps> = memo((props: PropsWithChildren<ColorPassProps>) => {
  const {
    overlay = false,
    merge = false,
    calls,
  } = props;

  const inspect = useInspectable();

  const device = useDeviceContext();
  const renderContext = useRenderContext();
  const {cull, bind} = useViewContext();

  const opaques      = toArray(calls['opaque']      as Renderable[]);
  const transparents = toArray(calls['transparent'] as Renderable[]);
  const debugs       = toArray(calls['debug']       as Renderable[]);

  const renderPassDescriptor = useMemo(() =>
    getRenderPassDescriptor(renderContext, overlay, merge),
    [renderContext, overlay, merge]);

  const drawToPass = (
    calls: Renderable[],
    passEncoder: GPURenderPassEncoder,
    countGeometry: (v: number, t: number) => void,
    sign: number = 1,
  ) => {
    let order = getDrawOrder(cull, calls, sign);
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

    drawToPass(opaques, passEncoder, countGeometry);
    drawToPass(transparents, passEncoder, countGeometry, -1);
    drawToPass(debugs, passEncoder, countGeometry);

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

}, 'ColorPass');
