import React from 'react';
import { LC, LiveElement } from '@use-gpu/live/types';

import { provide, wrap, useAsync, useOne } from '@use-gpu/live';
import { DeviceContext } from '@use-gpu/workbench';//'/providers/device-provider'

import { mountGPUDevice } from '../web';

type ErrorRenderer = (e: Error) => LiveElement<any>;

type WebGPUProps = {
  fallback: LiveElement<any> | ErrorRenderer,
};

export const WebGPU: LC<WebGPUProps> = ({fallback, children}) => {
  const [result, error] = useAsync(mountGPUDevice);
  return (
    result ? provide(DeviceContext, result.device, children) :
    error ? (typeof fallback === 'function' ? fallback(error) : fallback) : null
  );
};
