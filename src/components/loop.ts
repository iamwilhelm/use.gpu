import { LiveComponent } from '../live/types';
import { defer, useCallback, useOne, useResource } from '../live/live';
import { prepareSubContext, renderContext } from '../live/tree';

export type LoopProps = {
  swapChain: GPUSwapChain,
  colorAttachments: GPURenderPassColorAttachmentDescriptor[],
  update: () => void,
  render: () => void,
};

export const Loop: LiveComponent<LoopProps> = (context) => (props) => {
  const {swapChain, colorAttachments, update, render} = props;

  const ref = useOne(context, 0)(() => ({update, render}));
  ref.update = update;
  ref.render = render;

  const paint = useCallback(context, 1)((context) => (ref) => ref.render());
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
      subContext.host.dispose(subContext);
    }
  });
}
