import { LiveComponent } from '@use-gpu/live/types';
import { GPUTextAPI } from '@use-gpu/text/types';

import { provide, useAsync, makeContext } from '@use-gpu/live';
import { GPUText } from '@use-gpu/text';

export const GPUTextContext = makeContext(undefined, 'GPUTextContext');

export type GPUTextContext = {
  gpuText: GPUTextAPI,
};

export type GPUTextProvider = {
  children: LiveElement<any>,
};

export const GPUTextProvider: LiveComponent<GPUTextProviderProps> = ({children}) => {
  const gpuText = useAsync(GPUText);
  return gpuText && children ? provide(GPUTextContext, gpuText, children) : null;
};