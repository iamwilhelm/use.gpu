import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { CanvasRenderingContextGPU } from '@use-gpu/webgpu/types';
import {
  PICKING_FORMAT,
  PICKING_COLOR,
  DEPTH_STENCIL_FORMAT,
} from '../constants';

import { RenderContext, RenderProvider } from '../providers';
import { memo, use, provide, useContext, useMemo, useOne, useResource, makeContext } from '@use-gpu/live';
import {
  makeColorState,
  makeColorAttachment,
  makeReadbackTexture,
  makeDepthTexture,
  makeDepthStencilState,
  makeDepthStencilAttachment,
  makeTextureReadbackBuffer,
  TEXTURE_ARRAY_TYPES,
  TEXTURE_FORMAT_SIZES,
  PICKING_UNIFORMS,
} from '@use-gpu/core';

const seq = (n: number, s: number = 0, d: number = 1) => Array.from({ length: n }).map((_, i: number) => s + d * i);

type OnPick = (index: number) => void;

type PickingContextType = {
  renderContext: CanvasRenderingContextGPU,
  pickingTexture: GPUTexture,
  captureTexture: () => void,
  sampleTexture: (x: number, y: number) => number[],
  usePicking: () => { pickingDefs: UniformAttribute[], pickingUniforms: any },
};

export const PickingContext = makeContext<PickingContextType>(null, 'PickingContext');
export const useNoPicking = () => useResource(() => ({}));

export type PickingProps = {
  pickingFormat?: GPUTextureFormat, 
  pickingColor?: GPUColor,
  depthStencilFormat?: GPUTextureFormat,
  resolution: number,

  children?: LiveElement<any>,
}

const NOP = () => {};

export const Picking: LiveComponent<PickingProps> = (fiber) => (props) => {
  const renderContext = useContext(RenderContext);

  const {
    pickingFormat = PICKING_FORMAT,
    pickingColor = PICKING_COLOR,
    depthStencilFormat = DEPTH_STENCIL_FORMAT,
    resolution = 1/2,

    children,
  } = props;

  const {colorStates: renderColorStates} = renderContext;
  const colorStates = useMemo(() => [
    makeColorState(pickingFormat),
  ], [pickingFormat]);
  const depthStencilState = useOne(() =>
    makeDepthStencilState(depthStencilFormat),
    depthStencilFormat
  );

  const pickingContext = useMemo(() => {
    const {device, width: w, height: h} = renderContext;
    const width = w * resolution;
    const height = h * resolution;
    const samples = 1;

    const [pickingBuffer, bytesPerRow, itemsPerRow, itemDims] = makeTextureReadbackBuffer(device, width, height, pickingFormat);
    const pickingTexture = makeReadbackTexture(device, width, height, pickingFormat);
    const depthTexture = makeDepthTexture(device, width, height, depthStencilFormat);

    const colorAttachments = [makeColorAttachment(pickingTexture, null, pickingColor)];
    const depthStencilAttachment = makeDepthStencilAttachment(depthTexture);

    let waiting = false;
    let captured = null;
    const captureTexture = async () => {
      if (waiting) return;

      const commandEncoder = device.createCommandEncoder();
      commandEncoder.copyTextureToBuffer(
        {texture: pickingTexture},
        {buffer: pickingBuffer, bytesPerRow},
        {width, height}
      );
      device.queue.submit([commandEncoder.finish()]);

      waiting = true;
      await pickingBuffer.mapAsync(GPUMapMode.READ);
      const ArrayType = TEXTURE_ARRAY_TYPES[pickingFormat];
      if (ArrayType) {
        const array = new ArrayType(pickingBuffer.getMappedRange());
        captured = array.slice();
      }
      pickingBuffer.unmap();
      waiting = false;
    }

    const sampleTexture = (x: number, y: number): number[] => {
      if (!captured) return seq(itemDims).map(i => 0);

      const offset = (itemsPerRow * y + x) * itemDims;
      const index = seq(itemDims).map(i => captured[offset + i]);
      return index;
    }

    const usePicking = (id: number) => useOne(() => ({
      pickingDefs: PICKING_UNIFORMS,
      pickingUniforms: {
        pickingId: { value: id },
      },
    }));

    const context = {
      renderContext: {
        ...renderContext,
        width,
        height,
        samples,
        colorStates,
        colorAttachments,
        depthStencilAttachment,
      } as CanvasRenderingContextGPU,
      captureTexture,
      sampleTexture,
      usePicking,
    };
    
    return context;
  }, [renderContext, colorStates, depthStencilState, resolution]);

  return provide(PickingContext, pickingContext, children);
};

export type PickingProviderProps = {
  pickingContext: PickingContextType,
  children: LiveElement<any>,
};

export const PickingProvider: LiveComponent<PickingProviderProps> = memo((fiber) => (props) => {
  const {pickingContext, children} = props;
  return provide(PickingContext, pickingContext, children);
}, 'PickingProvider');
