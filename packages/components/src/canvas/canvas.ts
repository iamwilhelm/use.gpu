import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { CanvasRenderingContextGPU } from '@use-gpu/webgpu/types';
import { ColorSpace } from '@use-gpu/core/types';
import { PRESENTATION_FORMAT, DEPTH_STENCIL_FORMAT, COLOR_SPACE, BACKGROUND_COLOR } from '../constants';

import { EventProvider } from '../providers/event-provider';
import { RenderContext } from '../providers/render-provider';
import { LayoutContext } from '../providers/layout-provider';
import { DeviceContext } from '../providers/device-provider';
import { provide, use, imperative, useCallback, useContext, useMemo, useOne } from '@use-gpu/live';
import { makePresentationContext } from '@use-gpu/webgpu';
import {
  makeColorState,
  makeColorAttachment,
  makeRenderTexture,
  makeReadbackTexture,
  makeDepthTexture,
  makeDepthStencilState,
  makeDepthStencilAttachment,
  BLEND_PREMULTIPLIED,
} from '@use-gpu/core';

export type CanvasProps = {
  canvas: HTMLCanvasElement,

  format?: GPUTextureFormat,
  depthStencil?: GPUTextureFormat,
  backgroundColor?: GPUColor,
  colorSpace?: ColorSpace,
  colorInput?: ColorSpace,
  samples?: number,
  pixelRatio?: number,

  children?: LiveElement<any>,
}

const getPixelRatio = () => typeof window !== 'undefined' ? window.devicePixelRatio : 1;

export const Canvas: LiveComponent<CanvasProps> = imperative((props: CanvasProps) => {
  const {
    canvas,
    children,
    pixelRatio = getPixelRatio(),
    format = PRESENTATION_FORMAT,
    depthStencil = DEPTH_STENCIL_FORMAT,
    backgroundColor = BACKGROUND_COLOR,
    colorSpace = COLOR_SPACE,
    colorInput = COLOR_SPACE,
    samples = 1
  } = props;

  const device = useContext(DeviceContext);

  const {width, height} = canvas;
  const layout = useMemo(() => [0, height / pixelRatio, width / pixelRatio, 0], [width, height, pixelRatio]);

  const renderTexture = useMemo(() =>
    samples > 1
    ? makeRenderTexture(
        device,
        width,
        height,
        format,
        samples,
      )
    : null,
    [device, width, height, format, samples]
  );
  
  const colorStates      = useOne(() => [makeColorState(format, BLEND_PREMULTIPLIED)], format);
  const colorAttachments = useMemo(() =>
    [makeColorAttachment(renderTexture, null, backgroundColor)],
    [backgroundColor, renderTexture]
  );
  const depthStencilState = useOne(() => makeDepthStencilState(depthStencil), depthStencil);

  const [
    depthTexture,
    depthStencilAttachment,
  ] = useMemo(() => {
      const texture = makeDepthTexture(device, width, height, depthStencil, samples);
      const attachment = makeDepthStencilAttachment(texture, depthStencil);
      return [texture, attachment];
    },
    [device, width, height, depthStencil, samples]
  );

  const gpuContext = useMemo(() =>
    makePresentationContext(device, canvas, format),
    [device, canvas, format, width, height],
  );
  
  const swapView = useCallback((view?: GPUTextureView) => {
    view = view ?? gpuContext
      .getCurrentTexture()
      .createView();

    if (samples > 1) colorAttachments[0].resolveTarget = view; 
    else colorAttachments[0].view = view;
  }, [gpuContext, samples, colorAttachments])

  const renderContext = {
    width,
    height,
    pixelRatio,
    samples,

    device,
    gpuContext,
    colorSpace,
    colorInput,
    colorStates,
    colorAttachments,
    depthTexture,
    depthStencilState,
    depthStencilAttachment,

    swapView,
    canvas,
  } as CanvasRenderingContextGPU;

  return (
    provide(RenderContext, renderContext,
      provide(LayoutContext, layout, children)
    )
  );
}, 'Canvas')
