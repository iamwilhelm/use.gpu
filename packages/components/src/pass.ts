import { LiveComponent } from '@use-gpu/live/types';
import {
  use, yeet, gatherReduce, useMemo,
} from '@use-gpu/live';

export type PassProps = {
  device: GPUDevice,
  colorAttachments: GPURenderPassColorAttachmentDescriptor[],
  depthStencilAttachment: GPURenderPassDepthStencilAttachmentDescriptor,
  render: (encoder: GPURenderPassEncoder) => void,
};

export type RenderToPass = (passEncoder: GPURenderPassEncoder) => void;

export const Pass: LiveComponent<PassProps> = (fiber) => (props) => {
  const {device, colorAttachments, depthStencilAttachment, children, render} = props;

  const Done = useMemo(() => (fiber) => (rs: RenderToPass[]) =>
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

  if (!Done.displayName) Done.displayName = '[Pass]';

  return gatherReduce(children ?? render(), Done);
}
