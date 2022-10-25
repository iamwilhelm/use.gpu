import type { UseGPURenderContext, TextureSource } from '@use-gpu/core';
import { makeContext, useContext, useNoContext } from '@use-gpu/live';
import { bundleToAttributes } from '@use-gpu/shader/wgsl';
import { useBoundShader, useNoBoundShader } from '../hooks/useBoundShader';

import { getPickingID } from '@use-gpu/wgsl/render/pick.wgsl';

const PICKING_BINDINGS = bundleToAttributes(getPickingID);

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

type PickingSource = {
  id?: number,
  lookup?: number,
  ids?: ShaderSource,
  lookups?: ShaderSource,
}

export const usePickingShader = ({id, ids, lookup, lookups}: PickingSource) => 
  id ?? ids ? useBoundShader(getPickingID, PICKING_BINDINGS, [id ?? ids, lookups]) : useNoBoundShader();
