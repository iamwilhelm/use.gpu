import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { CanvasRenderingContextGPU } from '@use-gpu/webgpu/types';
import {
  PICKING_FORMAT,
  PICKING_COLOR,
} from './constants';

import { RenderContext, RenderProvider } from './render-provider';
import { use, useContext, useMemo } from '@use-gpu/live';
import {
  makeColorState,
  makeColorAttachment,
  makeRenderTexture,
} from '@use-gpu/core';

export type PickingProps = {
  pickingFormat?: GPUTextureFormat, 
  pickingColor?: GPUColor,

  children?: LiveElement<any>,
}

export const Picking: LiveComponent<PickingProps> = (fiber) => (props) => {
  const renderContext = useContext(RenderContext);

  const {
    pickingFormat = PICKING_FORMAT,
    pickingColor = PICKING_COLOR,

    children,
  } = props;

  const [
    colorStates,
    colorAttachments,
    pickingTexture,
  ] = useMemo(() => {
    const {device, width, height} = renderContext;
    const pickingTexture = makeRenderTexture(device, width, height, pickingFormat);

    const colorStates = [
      ...renderContext.colorStates,
      makeColorState(pickingFormat),
    ];
    const colorAttachments = [
      ...renderContext.colorAttachments,
      makeColorAttachment(pickingTexture, pickingColor),
    ];
    return [colorStates, colorAttachments, pickingTexture];
  }, [renderContext, pickingFormat, pickingColor]);

  const pickingContext = {
    ...renderContext,
    colorStates,
    colorAttachments,
  } as CanvasRenderingContextGPU;

  return use(RenderProvider)({ renderContext: pickingContext, children });
}
