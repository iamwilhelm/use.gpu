import { LiveFiber, LiveComponent, LiveElement, Task } from '@use-gpu/live/types';
import { CanvasRenderingContextGPU } from '@use-gpu/webgpu/types';
import { use, provide, gatherReduce, useContext, useMemo, useOne } from '@use-gpu/live';
import { PRESENTATION_FORMAT, DEPTH_STENCIL_FORMAT, EMPTY_COLOR } from '../constants';
import { RenderContext } from '../providers/render-provider';
import { FrameContext } from '../providers/frame-context';

import {
  makeColorState,
  makeColorAttachment,
  makeRenderTexture,
  makeDepthTexture,
  makeDepthStencilState,
  makeDepthStencilAttachment,
} from '@use-gpu/core';

export type RenderToTextureProps = {
  width: number,
  height: number,

  presentationFormat?: GPUTextureFormat,
  depthStencilFormat?: GPUTextureFormat | null,
  backgroundColor?: GPUColor,
  samples?: number,

  children?: LiveElement<any>, 
};

export const RenderToTexture: LiveComponent<RenderToTextureProps> = (fiber) => (props) => {
  const renderContext = useContext(RenderContext);
  const {device} = renderContext;

  const {
    width = renderContext.width,
    height = renderContext.height,
    samples = renderContext.samples,
    presentationFormat = PRESENTATION_FORMAT,
    depthStencilFormat = DEPTH_STENCIL_FORMAT,
    backgroundColor = EMPTY_COLOR,
    children,
  } = props;

  const [renderTexture, resolveTexture] = useMemo(() => [
      makeRenderTexture(
        device,
        width,
        height,
        presentationFormat,
        samples,
      ),
      samples > 1 ? makeRenderTexture(
        device,
        width,
        height,
        presentationFormat,
      ) : null,
    ] as [GPUTexture, GPUTexture | null],
    [device, width, height, presentationFormat, samples]
  );

  const colorStates      = useOne(() => [makeColorState(presentationFormat)], presentationFormat);
  const colorAttachments = useMemo(() =>
    [makeColorAttachment(renderTexture, resolveTexture, backgroundColor)],
    [renderTexture, resolveTexture, backgroundColor]
  );
  const depthStencilState = useOne(() => makeDepthStencilState(depthStencilFormat), depthStencilFormat);

  const [
    depthTexture,
    depthStencilAttachment,
  ] = useMemo(() => {
      if (!depthStencilFormat) return [];

      const texture = makeDepthTexture(device, width, height, depthStencilFormat, samples);
      const attachment = makeDepthStencilAttachment(texture);
      return [texture, attachment];
    },
    [device, width, height, depthStencilFormat, samples]
  );

  const rttContext = useMemo(() => ({
    ...renderContext,
    width,
    height,
    colorStates,
    colorAttachments,
    depthTexture,
    depthStencilState,
    depthStencilAttachment,
  }), [renderContext, width, height, colorStates, colorAttachments, depthTexture, depthStencilState, depthStencilAttachment]);

  const view = provide(RenderContext, rttContext, childreZ);

  const Done = useMemo(() =>
    (fiber: LiveFiber<any>) => (ts: Task[]) => {
      for (let task of ts) task();
    },
  );

  // @ts-ignore
  if (!Done.displayName) Done.displayName = '[RenderToTexture]';

  const frame = useOne(() => ({current: 0}));
  frame.current++;

  return provide(FrameContext, frame.current, gatherReduce(view, Done));
}
