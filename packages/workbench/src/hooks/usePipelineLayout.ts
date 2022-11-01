import { makeBindGroupLayout, makePipelineLayout } from '@use-gpu/core';
import { useMemo, useNoMemo } from '@use-gpu/live';

export const usePipelineLayout = (
  device: GPUDevice,
  entries: GPUBindGroupLayoutEntry[][],
  bindGroup0?: GPUBindGroupLayout,
) => {
  return useMemo(() => {
    const layouts = entries.map(es => makeBindGroupLayout(device, es));
    return makePipelineLayout(device, bindGroup0 ? [bindGroup0, ...layouts] : layouts);
  }, [device, entries, bindGroup0]);
};

export const useNoPipelineLayout = useNoMemo;