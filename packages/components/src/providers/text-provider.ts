import { LiveComponent } from '@use-gpu/live/types';
import { GPUTextAPI } from '@use-gpu/text/types';

import { provide, useAsync, makeContext } from '@use-gpu/live';
import { GPUText } from '@use-gpu/text';

export type TextContextProps = {
  gpuText: GPUTextAPI,
};

export const TextContext = makeContext<TextContextProps>(undefined, 'TextContext');

export type TextContext = {
  children: LiveElement<any>,
};

export const TextProvider: LiveComponent<TextProviderProps> = ({children}) => {
  const gpuText = useAsync(GPUText);
  return gpuText && children ? provide(TextContext, gpuText, children) : null;
};