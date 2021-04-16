import { LiveComponent, LiveElement } from '../live/types';
import { CanvasRenderingContextGPU } from '../canvas/types';

import { AutoSize } from './autosize';
import { Canvas } from './canvas';

import { defer } from '../live/live';

export type AutoCanvasProps = {
  device: GPUDevice,
  adapter: GPUAdapter,
  canvas: HTMLCanvasElement,

  swapChainFormat?: GPUTextureFormat,
  depthStencilFormat?: GPUTextureFormat,
  backgroundColor?: GPUColor,

  render: (context: CanvasRenderingContextGPU) => LiveElement<any>,
}

export const AutoCanvas: LiveComponent<AutoCanvasProps> = () => (props) =>
  defer(AutoSize)({
    canvas: props.canvas,
    render: () => defer(Canvas)(props)
  });
