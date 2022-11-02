import type { LC, PropsWithChildren, LiveFiber, LiveElement, ArrowFunction, UniformPipe } from '@use-gpu/live';
import type { RenderToPass } from '../pass';

import { use, quote, yeet, memo, multiGather, useContext, useMemo } from '@use-gpu/live';
import { proxy } from '@use-gpu/core';

import { useRenderContext } from '../../providers/render-provider';
import { useDeviceContext } from '../../providers/device-provider';
import { useViewContext } from '../../providers/view-provider';

import { useInspectable } from '../../hooks/useInspectable'

import { getRenderPassDescriptor } from '../pass';

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
    overlay = false,
    merge = false,
    calls,
  } = props;

  const inspect = useInspectable();

  const device = useDeviceContext();
  const renderContext = useRenderContext();
  const {bind} = useViewContext();

  const opaques      = toArray(calls['opaque']      as RenderToPass[]);
  const transparents = toArray(calls['transparent'] as RenderToPass[]);
  const debugs       = toArray(calls['debug']       as RenderToPass[]);

  const visibles: RenderToPass[] = [];
  visibles.push(...opaques);
  visibles.push(...transparents);
  visibles.push(...debugs);

  const renderPassDescriptor = useMemo(() =>
    getRenderPassDescriptor(renderContext, overlay, merge),
    [renderContext, overlay, merge]);

  return quote(yeet(() => {
    let vs = 0;
    let ts = 0;

    const countGeometry = (v: number, t: number) => { vs += v; ts += t; };

    const commandEncoder = device.createCommandEncoder();
    if (!overlay && !merge) renderContext.swap();

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    bind(passEncoder);

    for (const f of visibles) f(passEncoder, countGeometry);
    passEncoder.end();

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
