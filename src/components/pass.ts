import { LiveComponent } from '../live/types';
import { defer, useCallback, useOne, useResource } from '../live/live';
import { prepareSubContext, renderContext } from '../live/tree';

export type PassProps = {
  device: GPUDevice,
  colorAttachments: GPURenderPassColorAttachmentDescriptor[],
  depthStencilAttachment: GPURenderPassDepthStencilAttachmentDescriptor,
  render: (encoder: GPURenderPassEncoder) => void,
};

export const Pass: LiveComponent<PassProps> = (context) => (props) => {
  const {device, colorAttachments, depthStencilAttachment, render} = props;

  const renderPassDescriptor: GPURenderPassDescriptor = {
    colorAttachments,
    depthStencilAttachment,
  };

  const commandEncoder = device.createCommandEncoder();
  const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);

  const ref = useOne(context, 0)(() => ({passEncoder, render}));
  ref.render = render;
  ref.passEncoder = passEncoder;

  const paint = useCallback(context, 1)((context) => (ref) => ref.render(ref.passEncoder));
  const subContext = useOne(context, 2)(() => prepareSubContext(context, defer(paint)(ref)));

  renderContext(subContext);

  passEncoder.endPass();

  device.queue.submit([commandEncoder.finish()]);
}
