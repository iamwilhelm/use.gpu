import {GPUMount, GPUDeviceMount} from './types';

export const mountGPU = async (selector: string): Promise<GPUMount> => {
 
  const {adapter, device} = await mountGPUDevice();
  const canvas = mountCanvas(selector);

  return {adapter, device, canvas};
}

export const mountGPUDevice = async (): Promise<GPUDeviceMount> => {
  if (!navigator.gpu) throw new Error("WebGPU not supported in browser");

  const adapter = await navigator.gpu.requestAdapter({
    powerPreference: "high-performance",
  });
  if (!adapter) throw new Error("Cannot get WebGPU adapter");

  const device = await adapter.requestDevice();
  if (!device) throw new Error("Cannot get WebGPU device");

  return {adapter, device};
}

export const mountCanvas = (selector: string): HTMLCanvasElement => {

  const el = document.querySelector(selector);
  if (!el) throw new Error(`Cannot find ${selector} in DOM`);

  const canvas = document.createElement('canvas');
  el.appendChild(canvas);

  return canvas;
}

export const makeSwapChain = (
  device: GPUDevice,
  canvas: HTMLCanvasElement,
  format: GPUTextureFormat,
): GPUSwapChain => {
  const gpuContext = canvas.getContext("gpupresent") as unknown as GPUCanvasContext | null;
  if (!gpuContext) throw new Error("Cannot get WebGPU Canvas context");

  const swapChainDescriptor = { device, format };
  // @ts-ignore
  const swapChain = gpuContext.configureSwapChain(swapChainDescriptor);

  return swapChain;
}
