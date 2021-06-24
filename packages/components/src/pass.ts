import { LiveComponent } from '@use-gpu/live/types';
import {
  use, fork, useCallback, useOne,
  useSubContext, renderContext,
} from '@use-gpu/live';

export type PassProps = {
  device: GPUDevice,
  colorAttachments: GPURenderPassColorAttachmentDescriptor[],
  depthStencilAttachment: GPURenderPassDepthStencilAttachmentDescriptor,
  render: (encoder: GPURenderPassEncoder) => void,
};

export type PassRef = {
  passEncoder: GPURenderPassEncoder,
  render: (encoder: GPURenderPassEncoder) => void,
};

const Encode = () => (ref: PassRef) => ref.render(ref.passEncoder);

export const Pass: LiveComponent<PassProps> = (context) => (props) => {
  const {device, colorAttachments, depthStencilAttachment, render} = props;

  const renderPassDescriptor: GPURenderPassDescriptor = {
    colorAttachments,
    depthStencilAttachment,
  };

  const commandEncoder = device.createCommandEncoder();
  const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);

  const ref: PassRef = useOne(context, 0)(() => ({passEncoder, render}));
  ref.render = render;
  ref.passEncoder = passEncoder;

  const subContext = useSubContext(context, 2)(use(Encode)(ref));

  renderContext(subContext);

  passEncoder.endPass();

  // @ts-ignore
  device.queue.submit([commandEncoder.finish()]);

  return fork(subContext);
}
