import { LiveFiber, LiveComponent, LiveElement, Task } from '@use-gpu/live/types';
import { CanvasRenderingContextGPU } from '@use-gpu/webgpu/types';
import { ColorSpace } from '@use-gpu/core/types';
import { use, provide, resume, gather, useContext, useMemo, useOne } from '@use-gpu/live';
import { PRESENTATION_FORMAT, DEPTH_STENCIL_FORMAT, COLOR_SPACE, EMPTY_COLOR } from '../constants';
import { RenderContext } from '../providers/render-provider';
import { FrameContext } from '../providers/frame-provider';

import {
  makeColorState,
  makeColorAttachment,
  makeRenderableTexture,
  makeDepthTexture,
  makeDepthStencilState,
  makeDepthStencilAttachment,
  makeTextureView,
  BLEND_PREMULTIPLIED,
} from '@use-gpu/core';

export type RenderToTextureProps = {
  width: number,
  height: number,
  live?: boolean,

  presentationFormat?: GPUTextureFormat,
  depthStencilFormat?: GPUTextureFormat | null,
  backgroundColor?: GPUColor,
  colorSpace?: ColorSpace,
  colorInput?: ColorSpace,
  samples?: number,

  children?: LiveElement<any>,
  then?: (targetTexture: GPUTexture) => LiveElement<any>,
};

export const RenderToTexture: LiveComponent<RenderToTextureProps> = (props) => {
  const renderContext = useContext(RenderContext);
  const {device} = renderContext;

  const {
    width = renderContext.width,
    height = renderContext.height,
    samples = renderContext.samples,
    presentationFormat = PRESENTATION_FORMAT,
    depthStencilFormat = DEPTH_STENCIL_FORMAT,
    backgroundColor = EMPTY_COLOR,
    colorSpace = COLOR_SPACE,
    colorInput = COLOR_SPACE,
    live = true,
    children,
    then,
  } = props;

  if (live) useContext(FrameContext);
  else useNoContext(FrameContext);

  const [renderTexture, resolveTexture] = useMemo(() => [
      makeRenderableTexture(
        device,
        width,
        height,
        presentationFormat,
        samples,
      ),
      samples > 1 ? makeRenderableTexture(
        device,
        width,
        height,
        presentationFormat,
      ) : null,
    ] as [GPUTexture, GPUTexture | null],
    [device, width, height, presentationFormat, samples]
  );
  
  const targetTexture = resolveTexture ?? renderTexture;

  const colorStates      = useOne(() => [makeColorState(presentationFormat, BLEND_PREMULTIPLIED)], presentationFormat);
  const colorAttachments = useMemo(() =>
    [makeColorAttachment(renderTexture, resolveTexture, backgroundColor)],
    [renderTexture, resolveTexture, backgroundColor]
  );
  const depthStencilState = useOne(() => depthStencilFormat
    ? makeDepthStencilState(depthStencilFormat)
    : undefined,
    depthStencilFormat);

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
  
  const swapView = useOne(() => () => {});

  const rttContext = useMemo(() => ({
    ...renderContext,
    width,
    height,
    colorSpace,
    colorInput,
    colorStates,
    colorAttachments,
    depthTexture,
    depthStencilState,
    depthStencilAttachment,
    swapView,
  }), [renderContext, width, height, colorStates, colorAttachments, depthTexture, depthStencilState, depthStencilAttachment]);

  const source = useMemo(() => ({
    texture: targetTexture,
    view: makeTextureView(targetTexture),
    sampler: {},
    layout: 'texture_2d<f32>',
    format: presentationFormat,
    colorSpace,
    size: [width, height],
    version: 0,
  }), [targetTexture, width, height, presentationFormat]);

  const view = provide(RenderContext, rttContext, children);
  const Done = useOne(() =>
    resume((ts: Task[]) => {
      for (let task of ts) task();
      return then && then(source);
    })
  , source);

  source.version++;
  return gather(provide(FrameContext, source.version, view), Done);
}
