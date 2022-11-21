import type { LC, PropsWithChildren, LiveFiber, LiveElement, ArrowFunction, UniformPipe } from '@use-gpu/live';
import type { LightEnv, Renderable } from '../pass';

import { use, quote, yeet, memo, multiGather, useContext, useMemo } from '@use-gpu/live';

import { useDeviceContext } from '../../providers/device-provider';
import { useViewContext } from '../../providers/view-provider';

import { useInspectable } from '../../hooks/useInspectable'

import { SHADOW_FORMAT, SHADOW_PAGE } from '../renderer/light-data';
import { getRenderPassDescriptor, getDrawOrder } from './util';

export type ShadowPassProps = {
  calls: {
    opaque?: Renderable[],
  },
};

const NO_OPS: any[] = [];
const toArray = <T>(x?: T[]): T[] => Array.isArray(x) ? x : NO_OPS; 

/** Shadow render pass.

Draws all opaque calls to multiple shadow maps.
*/
export const ShadowPass: LC<ShadowPassProps> = memo((props: PropsWithChildren<ShadowPassProps>) => {
  const {
    calls,
  } = props;

  const inspect = useInspectable();

  const device = useDeviceContext();
  const {bind: bindGlobal, cull} = useViewContext();

  const opaques = toArray(calls['opaque'] as Renderable[]);
  const [light] = toArray(calls['light']  as LightEnv[]);
  if (!light) return;

  const {lights, shadows, texture} = light;

  const [
    depthStencilState,
    depthStencilAttachment,
    renderPassDescriptor,
  ] = useMemo(() => {
    const depthStencilState = makeDepthStencilState(SHADOW_FORMAT);
    const attachment = makeDepthStencilAttachment(texture, SHADOW_FORMAT);

    const descriptor = {
      colorAttachments: [],
      depthStencilAttachment: attachment,
    };
    
    return [texture, attachment, descriptor];
  }, [device, texture]);

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
    bindGlobal(passEncoder);
    bindPass(passEncoder);

    drawToPass(opaques, passEncoder, countGeometry);

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

}, 'ShadowPass');
