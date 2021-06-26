import { LiveFiber, LiveComponent, LiveElement } from '@use-gpu/live/types';
import { GPUPresentationContext } from '@use-gpu/webgpu/types';
import {
  use, detach, useCallback, useOne, renderFiber,
} from '@use-gpu/live';

export type DrawProps = {
  gpuContext: GPUPresentationContext,
  colorAttachments: GPURenderPassColorAttachmentDescriptor[],
  render: () => LiveElement<any>,
};

export const Draw: LiveComponent<DrawProps> = (fiber) => (props) => {
  const {gpuContext, colorAttachments, children} = props;

  // @ts-ignore
  colorAttachments[0].view = gpuContext
  // @ts-ignore
    .getCurrentTexture()
    .createView();

  return children;
}
