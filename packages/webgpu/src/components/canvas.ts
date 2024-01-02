import type { LiveComponent, PropsWithChildren } from '@use-gpu/live';
import type { UseGPURenderContext, ColorSpace } from '@use-gpu/core';

import { EventProvider, RenderContext, LayoutContext, DeviceContext, QueueReconciler } from '@use-gpu/workbench';
import { provide, use, useCallback, useContext, useMemo, useOne, useFiber } from '@use-gpu/live';
import {
  makeColorState,
  makeColorAttachment,
  makeTargetTexture,
  makeReadbackTexture,
  makeDepthTexture,
  makeDepthStencilState,
  makeDepthStencilAttachment,
  BLEND_PREMULTIPLY,
} from '@use-gpu/core';

import { Loop } from '@use-gpu/workbench';

import { DEPTH_STENCIL_FORMAT, COLOR_SPACE, BACKGROUND_COLOR } from '../constants';
import { makePresentationContext } from '../web';

//const {signal} = QueueReconciler;

export type CanvasProps = {
  canvas: HTMLCanvasElement,

  format?: GPUTextureFormat,
  depthStencil?: GPUTextureFormat,
  backgroundColor?: GPUColor,
  colorSpace?: ColorSpace,
  colorInput?: ColorSpace,
  samples?: number,

  width: number,
  height: number,
  pixelRatio?: number,
};

export const Canvas: LiveComponent<CanvasProps> = (props: PropsWithChildren<CanvasProps>) => {
  const {
    width,
    height,
    pixelRatio = 1,
    canvas,
    children,
    format = navigator.gpu.getPreferredCanvasFormat(),
    depthStencil = DEPTH_STENCIL_FORMAT,
    backgroundColor = BACKGROUND_COLOR,
    colorSpace = COLOR_SPACE,
    colorInput = COLOR_SPACE,
    samples = 1,
  } = props;

  const device = useContext(DeviceContext);

  if (width * height === 0) return;

  const layout = useMemo(() => [0, height / pixelRatio, width / pixelRatio, 0], [width, height, pixelRatio]);

  const renderTexture = useMemo(() => {
    const texture = (
      samples > 1
      ? makeTargetTexture(
          device,
          width,
          height,
          format,
          samples,
        )
      : null
    );
    texture.label = '<Canvas> RenderTarget';
    return texture;
  }, [device, width, height, format, samples]);

  const colorStates      = useOne(() => [makeColorState(format, BLEND_PREMULTIPLY)], format);
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
      texture.label = '<Canvas> DepthTarget';

      const attachment = makeDepthStencilAttachment(texture, depthStencil);
      return [texture, attachment];
    },
    [device, width, height, depthStencil, samples]
  );

  const gpuContext = useMemo(() =>
    makePresentationContext(device, canvas, format),
    [device, canvas, format, width, height],
  );

  const swap = useCallback((view?: GPUTextureView) => {
    const v = view ?? gpuContext
      .getCurrentTexture()
      .createView();
    if (!view) v.label = '<Canvas> GPUPresentationContext View';

    if (samples > 1) colorAttachments[0].resolveTarget = v;
    else colorAttachments[0].view = v;
  }, [gpuContext, samples, colorAttachments])

  const renderContext = useOne(() => ({
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

    swap,
  } as UseGPURenderContext), [
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

    swap,
  ]);

  const fiber = useFiber();
  fiber.__inspect = fiber.__inspect ?? {};
  fiber.__inspect.canvas = {
    element: canvas,
    context: gpuContext,
    device,
    renderTexture,
  };

  return [
    provide(RenderContext, renderContext,
      provide(LayoutContext, layout,
        // Wrap everything in a paint-flushing loop so that canvas resize is processed in one pass
        use(Loop, {
          children
        })
      )
    )
  ];
};
