import type { UseGPURenderContext, TextureSource } from '@use-gpu/core';
import { makeContext, useContext, useNoContext } from '@use-gpu/live';

export type PickingContextProps = {
  renderContext: UseGPURenderContext,
  pickingTexture: GPUTexture,
  pickingSource: TextureSource,
  captureTexture: () => void,
  sampleTexture: (x: number, y: number) => number[],
};

export const PickingContext = makeContext<PickingContextProps>(undefined, 'PickingContext');

export const usePickingContext = () => useContext<PickingContextProps>(PickingContext);
export const useNoPickingContext = () => useNoContext(PickingContext);
