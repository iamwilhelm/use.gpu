import { LiveContext, LiveComponent, LiveElement } from '../live/types';
import { defer, useCallback, useOne, useResource } from '../live/live';
import { prepareSubContext, renderContext } from '../live/tree';

export type LoopProps = {
  swapChain: GPUSwapChain,
  colorAttachments: GPURenderPassColorAttachmentDescriptor[],
  update: () => void,
  render: () => LiveElement<any>,
};

export type LoopRef = {
  update: () => void,
  render: () => LiveElement<any>,
};

export const Loop: LiveComponent<LoopProps> = (context) => (props) => {
  const {swapChain, colorAttachments, update, render} = props;

  const ref: LoopRef = useOne(context, 0)(() => ({update, render}));
  ref.update = update;
  ref.render = render;

  const paint = useCallback(context, 1)((context: LiveContext<any>) => (ref: LoopRef) => ref.render());
  const subContext = useOne(context, 2)(() => prepareSubContext(context, defer(paint)(ref)));

  useResource(context, 3)(() => {
    let running = true;

    const loop = () => {
      if (ref.update) ref.update();

      colorAttachments[0].attachment = swapChain
        .getCurrentTexture()
        .createView();

      renderContext(subContext);

      if (running) requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
    return () => {
      running = false;
      if (subContext?.host) subContext.host.dispose(subContext);
    }
  });

  return null;
}
