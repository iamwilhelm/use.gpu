import { LiveComponent } from '@use-gpu/live/types';
import {
  use, yeet, mapReduce, useMemo,
} from '@use-gpu/live';

export type PassProps = {
  device: GPUDevice,
  colorAttachments: GPURenderPassColorAttachmentDescriptor[],
  depthStencilAttachment: GPURenderPassDepthStencilAttachmentDescriptor,
  render: (encoder: GPURenderPassEncoder) => void,
};

export type RenderToPass = (passEncoder: GPURenderPassEncoder) => void;

const mapper = (t: RenderToPass) => [t];
const reducer = (a: RenderToPass[], b: RenderToPass[]) => [...a, ...b];

export const Pass: LiveComponent<PassProps> = (fiber) => (props) => {
  const {device, colorAttachments, depthStencilAttachment, children, render} = props;

  const Done = useMemo(fiber)(() => (fiber) => (rs: RenderToPass[]) =>
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

  return mapReduce(children ?? render(), mapper, reducer, Done);
}
