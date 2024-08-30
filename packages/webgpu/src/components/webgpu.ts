import type { LC, LiveElement, PropsWithChildren } from '@use-gpu/live';

import { provide, wrap, useAwait, useResource } from '@use-gpu/live';
import { Queue, DeviceContext } from '@use-gpu/workbench';

import { mountGPUDevice } from '../web';

export type ErrorRenderer = (e: Error) => LiveElement;

export type WebGPUProps = PropsWithChildren<{
  fallback: LiveElement | ErrorRenderer,
}>;

export const WebGPU: LC<WebGPUProps> = ({fallback, children}: WebGPUProps) => {
  const [result, error] = useAwait(() => mountGPUDevice([], ["rg11b10ufloat-renderable", "depth32float-stencil8", "shader-f16"]), []);
  useResource((dispose) => {
    if (!result) return;

    const {device} = result;
    const handler = (event: any) => {
      console.error(event.error.message);
    };

    device.addEventListener('uncapturederror', handler);
    dispose(() => device.addEventListener('uncapturederror', handler));
  }, [result]);
  return (
    result ? provide(DeviceContext, result.device, wrap(Queue, children)) :
    error ? (typeof fallback === 'function' ? fallback(error) : fallback) : null
  );
};
