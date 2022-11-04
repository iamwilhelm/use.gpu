import React from 'react';
import type { LC, LiveElement } from '@use-gpu/live';

import { provide, wrap, useAwait, useOne } from '@use-gpu/live';
import { Queue, DeviceContext } from '@use-gpu/workbench';//'/providers/device-provider'

import { mountGPUDevice } from '../web';

export type ErrorRenderer = (e: Error) => LiveElement;

export type WebGPUProps = {
  fallback: LiveElement | ErrorRenderer,
};

export const WebGPU: LC<WebGPUProps> = ({fallback, children}) => {
  const [result, error] = useAwait(mountGPUDevice);
  return (
    result ? provide(DeviceContext, result.device, wrap(Queue, children)) :
    error ? (typeof fallback === 'function' ? fallback(error) : fallback) : null
  );
};
