import { LiveFiber, LiveComponent, LiveElement, Task } from '@use-gpu/live/types';
import {
  gather, provide, resume,
  makeContext, useContext, useOptionalContext, useNoContext,
} from '@use-gpu/live';
import { RenderContext } from '../providers/render-provider';
import { FrameContext } from '../providers/frame-provider';
import { PickingContext } from './picking';

export type DrawProps = {
  live?: boolean,
  render?: () => LiveElement<any>,
  children?: LiveElement<any>,
};

export const Draw: LiveComponent<DrawProps> = (props) => {
  const {live = true, render, children} = props;

  if (live) useOptionalContext(FrameContext);
  else useNoContext(FrameContext);

  return gather(children ?? (render ? render() : null), Resume);
};

const Resume = resume((ts: Task[]) => {
  const {device, swapView, colorAttachments, targetTexture, width, height, samples} = useContext(RenderContext);
  const pickingContext = useContext(PickingContext);
  const frameContext = useOptionalContext(FrameContext);

  swapView();

  for (let task of ts) task();

  /*
  const src = {
    texture: targetTexture,
  };
  const dst = {
    texture: gpuContext.getCurrentTexture(),
  };
  
  const commandEncoder = device.createCommandEncoder();
  commandEncoder.copyTextureToTexture(src, dst, [width, height, 1]);
  device.queue.submit([commandEncoder.finish()]);
  /*
  */

  if (pickingContext) pickingContext.captureTexture();
});
