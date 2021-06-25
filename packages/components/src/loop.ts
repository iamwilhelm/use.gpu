import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { GPUPresentationContext } from '@use-gpu/webgpu/types';
import {
  use, detach, useCallback, useOne, useResource, useSubContext, renderContext,
} from '@use-gpu/live';

export type LoopProps = {
  gpuContext: GPUPresentationContext,
  colorAttachments: GPURenderPassColorAttachmentDescriptor[],
  children?: LiveElement<any>,
  update?: () => void,
  render?: () => LiveElement<any>,
};

export type LoopRef = {
  children?: LiveElement<any>,
  update?: () => void,
  render?: () => LiveElement<any>,
};

const Paint = () => (ref: LoopRef) => ref.children ?? ref.render();

export const Loop: LiveComponent<LoopProps> = (fiber) => (props) => {
  const {gpuContext, colorAttachments, children, update, render} = props;

  const ref: LoopRef = useOne(fiber)(() => ({children, update, render}));
  ref.children = children;
  ref.update = update;
  ref.render = render;

  const fork = useOne(fiber)(() => use(Paint)(ref));
  return detach(fork, (detached: LiveFiber<any>) => {
    useResource(fiber)((dispose) => {
      let running = true;

      const loop = () => {
        if (ref.update) ref.update();

        // @ts-ignore
        colorAttachments[0].view = gpuContext
        // @ts-ignore
          .getCurrentTexture()
          .createView();

        renderFiber(detached);

        if (running) requestAnimationFrame(loop);
      }

      requestAnimationFrame(loop);
      dispose(() => running = false);
    });
  });
}
