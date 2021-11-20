import { LiveFiber, LiveComponent, LiveElement, Task } from '@use-gpu/live/types';
import { gatherReduce, makeContext, useContext, useOne, useMemo, provide } from '@use-gpu/live';
import { RenderContext } from '../providers/render-provider';
import { FrameContext } from '../providers/frame-context';

export type DrawProps = {
  children?: LiveElement<any>,
  render?: () => LiveElement<any>,
};

const Done = (fiber: LiveFiber<any>) => (ts: Task[]) => {
  const {gpuContext, colorAttachments, samples} = useContext(RenderContext);

  const view = gpuContext
  // @ts-ignore
    .getCurrentTexture()
    .createView();

  // @ts-ignore
  if (samples > 1) colorAttachments[0].resolveTarget = view; 
  else colorAttachments[0].view = view;

  for (let task of ts) task();
};

// @ts-ignore
if (!Done.displayName) Done.displayName = '[Draw]';
// @ts-ignore
Done.isStaticComponent = true;

export const Draw: LiveComponent<DrawProps> = (fiber) => (props) => {
  const {children, render} = props;

  const frame = useOne(() => ({current: 0}));
  frame.current++;

  return provide(FrameContext, frame.current,
    gatherReduce(children ?? (render ? render() : null), Done)
  );
};
