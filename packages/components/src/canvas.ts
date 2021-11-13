import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { ShaderLanguages } from '@use-gpu/core/types';
import { CanvasRenderingContextGPU } from '@use-gpu/webgpu/types';
import { PRESENTATION_FORMAT, DEPTH_STENCIL_FORMAT, BACKGROUND_COLOR } from './constants';

import { RenderProvider } from './render-provider';
import { use, useMemo, useOne } from '@use-gpu/live';
import { makePresentationContext } from '@use-gpu/webgpu';
import {
  makeColorState,
  makeColorAttachment,
  makeRenderTexture,
  makeDepthTexture,
  makeDepthStencilState,
  makeDepthStencilAttachment,
} from '@use-gpu/core';

export type CanvasProps = {
  device: GPUDevice,
  adapter: GPUAdapter,
  canvas: HTMLCanvasElement,
  languages: ShaderLanguages,

  presentationFormat?: GPUTextureFormat,
  depthStencilFormat?: GPUTextureFormat,
  backgroundColor?: GPUColor,
  samples?: number,

  children?: LiveElement<any>,
}

export const Canvas: LiveComponent<CanvasProps> = (fiber) => (props) => {
  const {
    device,
    canvas,
    children,
    languages,
    presentationFormat = PRESENTATION_FORMAT,
    depthStencilFormat = DEPTH_STENCIL_FORMAT,
    backgroundColor = BACKGROUND_COLOR,
    samples = 1
  } = props;

  const {width, height} = canvas;

  const renderTexture = useMemo(() =>
    samples
    ? makeRenderTexture(
        device,
        width,
        height,
        presentationFormat,
        samples,
      )
    : null,
    [samples]
  );

  const colorStates      = useOne(() => [makeColorState(presentationFormat)], presentationFormat);
  const colorAttachments = useMemo(() =>
    [makeColorAttachment(renderTexture, null, backgroundColor)],
    [backgroundColor, renderTexture]
  );

  const [
    depthTexture,
    depthStencilState,
    depthStencilAttachment,
  ] = useMemo(() => {
      const texture = makeDepthTexture(device, width, height, depthStencilFormat, samples);
      const state = makeDepthStencilState(depthStencilFormat);
      const attachment = makeDepthStencilAttachment(texture);
      return [texture, state, attachment];
    },
    [device, width, height, depthStencilFormat, samples]
  );

  const gpuContext = useMemo(() =>
    makePresentationContext(device, canvas, presentationFormat),
    [device, canvas, presentationFormat, width, height],
  );

  const renderContext = {
    width,
    height,
    samples,
    device,
    languages,
    gpuContext,
    colorStates,
    colorAttachments,
    depthTexture,
    depthStencilState,
    depthStencilAttachment,
  } as CanvasRenderingContextGPU;

  return use(RenderProvider)({ renderContext, children });
}
