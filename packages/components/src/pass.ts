import { LiveComponent, LiveFiber, LiveElement } from '@use-gpu/live/types';
import {
  use, yeet, memo, gatherReduce, useMemo,
} from '@use-gpu/live';

export type PassProps = {
  device: GPUDevice,
  colorAttachments: GPURenderPassColorAttachmentDescriptor[],
  depthStencilAttachment: GPURenderPassDepthStencilAttachmentDescriptor,
  children: LiveElement<any>,
  render: () => LiveElement<any>,
};

export type RenderToPass = (passEncoder: GPURenderPassEncoder) => void;

export const Pass: LiveComponent<PassProps> = memo((fiber) => (props) => {
  const {device, colorAttachments, depthStencilAttachment, children, render} = props;

  const Done = useMemo(() => (fiber: LiveFiber<any>) => (rs: RenderToPass[]) =>
    yeet(() => {
      const renderPassDescriptor: GPURenderPassDescriptor = {
        colorAttachments,
        depthStencilAttachment,
      };

      const commandEncoder = device.createCommandEncoder();
      const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
      for (let r of rs) r(passEncoder);
      passEncoder.endPass(),

      // @ts-ignore
      device.queue.submit([commandEncoder.finish()]);
    }),
    [device, colorAttachments, depthStencilAttachment]);

  // @ts-ignore
  if (!Done.displayName) Done.displayName = '[Pass]';

  return gatherReduce(children ?? (render ? render() : null), Done);
}, 'Pass');
