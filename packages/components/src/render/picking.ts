import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { CanvasRenderingContextGPU } from '@use-gpu/webgpu/types';
import {
  PICKING_FORMAT,
  PICKING_COLOR,
} from '../constants';

import { RenderContext, RenderProvider } from '../providers/render-provider';
import { memo, use, provide, useContext, useMemo, makeContext } from '@use-gpu/live';
import {
  makeColorState,
  makeColorAttachment,
  makeRenderTexture,
} from '@use-gpu/core';

type PickingContextType = {
  renderContext: CanvasRenderingContextGPU,
  pickingTexture: GPUTexture,
};

export const PickingContext = makeContext(null, 'PickingContext');

export type PickingProps = {
  pickingFormat?: GPUTextureFormat, 
  pickingColor?: GPUColor,
  resolution: number,

  children?: LiveElement<any>,
}

export const Picking: LiveComponent<PickingProps> = (fiber) => (props) => {
  const renderContext = useContext(RenderContext);

  const {
    pickingFormat = PICKING_FORMAT,
    pickingColor = PICKING_COLOR,
    resolution = 1,

    children,
  } = props;

  const {colorStates: renderColorStates} = renderContext;
  const colorStates = useMemo(() => [
    ...renderContext.colorStates,
    makeColorState(pickingFormat),
  ], [pickingFormat, renderColorStates]);

  const pickingContext = useMemo(() => {
    const {device, width: w, height: h} = renderContext;
    const width = w * resolution;
    const height = h * resolution;
    const samples = 1;

    const pickingTexture = makeRenderTexture(device, width, height, pickingFormat, samples);

    const colorAttachments = [
      ...renderContext.colorAttachments,
      makeColorAttachment(pickingTexture, null, pickingColor),
    ];

    const context = {
      renderContext: {
        ...renderContext,
        width,
        height,
        samples,
        colorStates,
        colorAttachments,
      } as CanvasRenderingContextGPU,
      pickingTexture,
    };
    
    return context;
  }, [renderContext, pickingFormat, pickingColor, resolution]);

  return use(PickingProvider)({ pickingContext, children });
}

export type PickingProviderProps = {
  pickingContext: PickingContextType,
  children: LiveElement<any>,
};

export const PickingProvider: LiveComponent<PickingProviderProps> = memo((fiber) => (props) => {
  const {pickingContext, children} = props;
  return provide(PickingContext, pickingContext, children);
}, 'PickingProvider');
