import { LiveComponent, LiveFiber, LiveElement } from '@use-gpu/live/types';
import { UseRenderingContextGPU, RenderPassMode } from '@use-gpu/core/types';
import { use, yeet, memo, resume, multiGather, useContext, useMemo } from '@use-gpu/live';
import { RenderContext } from '../providers/render-provider';
import { PickingContext } from './picking';

export type PassProps = {
  transparent?: boolean,
  opaque?: boolean,
  picking?: boolean,
  debug?: boolean,
  render?: () => LiveElement<any>,
  children?: LiveElement<any>,
};

export type RenderToPass = (passEncoder: GPURenderPassEncoder) => void;

const toArray = <T>(x: T | T[]): T[] => Array.isArray(x) ? x : x != null ? [x] : []; 

export const Pass: LiveComponent<PassProps> = memo((props: PassProps) => {
  const {transparent, opaque, debug, picking, children, render} = props;

  return multiGather(children ?? (render ? render() : null), makeResume(transparent, opaque, debug, picking));
}, 'Pass');

const makeResume = (
  transparent: boolean = true,
  opaque: boolean = true,
  debug: boolean = true,
  picking: boolean = true,
) => resume((rs: Record<string, RenderToPass | RenderToPass[]>) => {
  const renderContext = useContext(RenderContext);
  const pickingContext = useContext(PickingContext);

  const {device} = renderContext;

  const opaques = toArray(rs[RenderPassMode.Opaque]);
  const transparents = toArray(rs[RenderPassMode.Transparent]);
  const debugs = toArray(rs[RenderPassMode.Debug]);
  const pickings = toArray(rs[RenderPassMode.Picking]);

  const visibles = [];
  if (opaque) visibles.push(...opaques);
  if (transparent) visibles.push(...transparents);
  if (debug) visibles.push(...debugs);

  const renderToContext = (
    commandEncoder: GPUCommandEncoder,
    context: UseRenderingContextGPU,
    rs: RenderToPass[],
  ) => {
    const {colorAttachments, depthStencilAttachment} = context;
    const renderPassDescriptor: GPURenderPassDescriptor = {
      colorAttachments,
      depthStencilAttachment,
    };

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    for (let r of rs) r(passEncoder);
    passEncoder.end();
  };

  return yeet(() => {
    const commandEncoder = device.createCommandEncoder();

    renderToContext(commandEncoder, renderContext, visibles);
    if (picking && pickingContext) renderToContext(commandEncoder, pickingContext.renderContext, pickings);

    device.queue.submit([commandEncoder.finish()]);      
  });
});
