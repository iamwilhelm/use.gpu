import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { CanvasRenderingContextGPU } from '@use-gpu/webgpu/types';

import { AutoSize } from './auto-size';
import { Canvas } from './canvas';

import { defer } from '@use-gpu/live';

export type AutoCanvasProps = {
  device: GPUDevice,
  adapter: GPUAdapter,
  canvas: HTMLCanvasElement,

  presentationFormat?: GPUTextureFormat,
  depthStencilFormat?: GPUTextureFormat,
  backgroundColor?: GPUColor,

  render: (context: CanvasRenderingContextGPU) => LiveElement<any>,
}

export const AutoCanvas: LiveComponent<AutoCanvasProps> = () => (props) =>
  defer(AutoSize)({
    canvas: props.canvas,
    render: () => defer(Canvas)(props)
  });
