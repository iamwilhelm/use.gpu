import { LiveFiber, LiveComponent, LiveElement, Task } from '@use-gpu/live/types';
import { gatherReduce, makeContext, useContext, useOptionalContext, useNoContext, useOne, useMemo, provide } from '@use-gpu/live';
import { RenderContext } from '../providers/render-provider';
import { FrameContext } from '../providers/frame-provider';
import { PickingContext } from './picking';

export type DrawProps = {
  live?: boolean,
  children?: LiveElement<any>,
  render?: () => LiveElement<any>,
};

const makeStaticDone = (c: any): any => {
  c.isStaticComponent = true;
  c.displayName = '[Draw]';
  return c;
}

const Done = makeStaticDone((fiber: LiveFiber<any>) => (ts: Task[]) => {
  const {device, gpuContext, colorAttachments, samples} = useContext(RenderContext);
  const pickingContext = useContext(PickingContext);
  const frameContext = useOptionalContext(FrameContext);

  const view = gpuContext
  // @ts-ignore
    .getCurrentTexture()
    .createView();

  // @ts-ignore
  if (samples > 1) colorAttachments[0].resolveTarget = view; 
  else colorAttachments[0].view = view;

  for (let task of ts) task();
  if (pickingContext) pickingContext.captureTexture();
});

export const Draw: LiveComponent<DrawProps> = (fiber) => (props) => {
  const {live, children, render} = props;

  if (live) useContext(FrameContext);
  else useNoContext(FrameContext);

  return gatherReduce(children ?? (render ? render() : null), Done);
};
