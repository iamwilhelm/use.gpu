import { LiveComponent } from '@use-gpu/live/types';
import {
  use, detach, mapReduce, useCallback, useOne, renderFiber,
} from '@use-gpu/live';

export type PassProps = {
  device: GPUDevice,
  colorAttachments: GPURenderPassColorAttachmentDescriptor[],
  depthStencilAttachment: GPURenderPassDepthStencilAttachmentDescriptor,
  render: (encoder: GPURenderPassEncoder) => void,
};

export type RenderToPass = (passEncoder: GPURenderPassEncoder) => void;

export const mapper = (t: RenderToPass) => [t];
export const reducer = (a: RenderToPass[], b: RenderToPass[]) => [...a, ...b];

export const Pass: LiveComponent<PassProps> = (fiber) => (props) => {
  const {device, colorAttachments, depthStencilAttachment, children, render} = props;

  return mapReduce(
    children ?? render(), mapper, reducer,
    (rs: RenderToPass[]) => {
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
    },
  );
}
