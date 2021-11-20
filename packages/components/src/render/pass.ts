import { LiveComponent, LiveFiber, LiveElement } from '@use-gpu/live/types';
import { UseRenderingContextGPU, RenderPassMode } from '@use-gpu/core/types';
import { use, yeet, memo, gatherReduce, useContext, useMemo } from '@use-gpu/live';
import { RenderContext } from '../providers/render-provider';
import { PickingContext } from './picking';

export type PassProps = {
  device: GPUDevice,
  colorAttachments: GPURenderPassColorAttachment[],
  depthStencilAttachment: GPURenderPassDepthStencilAttachment,
  children: LiveElement<any>,
  render: () => LiveElement<any>,
};

export type RenderToPass = (passEncoder: GPURenderPassEncoder) => void;

const makeStaticDone = (c: any): any => {
  c.isStaticComponent = true;
  c.displayName = '[Pass]';
  return c;
}

export const Pass: LiveComponent<PassProps> = memo((fiber) => (props) => {
  const {children, render} = props;

  const Done = useMemo(() => makeStaticDone((fiber: LiveFiber<any>) => (rs: RenderToPass[]) => {
    const renderContext = useContext(RenderContext);
    const pickingContext = useContext(PickingContext);

    const {device} = renderContext;

    const renderToContext = (
      commandEncoder: GPUCommandEncoder,
      context: UseRenderingContextGPU,
      mode: RenderPassMode,
    ) => {
      const {colorAttachments, depthStencilAttachment} = renderContext;
      const renderPassDescriptor: GPURenderPassDescriptor = {
        colorAttachments,
        depthStencilAttachment,
      };

      const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
      for (let r of rs) r(passEncoder, mode);
      passEncoder.endPass();
    };

    return yeet(() => {
      const commandEncoder = device.createCommandEncoder();

      renderToContext(commandEncoder, renderContext, RenderPassMode.Render);
      if (pickingContext) renderToContext(commandEncoder, pickingContext, RenderPassMode.Picking);

      // @ts-ignore
      device.queue.submit([commandEncoder.finish()]);      
    });
  }), []);

  return gatherReduce(children ?? (render ? render() : null), Done);
}, 'Pass');
