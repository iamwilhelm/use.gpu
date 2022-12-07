import type { LC, PropsWithChildren, LiveFiber, LiveElement, ArrowFunction } from '@use-gpu/live';
import type { UseGPURenderContext, RenderPassMode } from '@use-gpu/core';
import type { VirtualDraw } from './pass';

import { use, quote, yeet, memo, provide, multiGather, useContext, useMemo, useOne } from '@use-gpu/live';
import { RenderContext } from '../providers/render-provider';
import { PassContext } from '../providers/pass-provider';
import { DeviceContext } from '../providers/device-provider';
import { PickingContext } from './picking';
import { useInspectable } from '../hooks/useInspectable'
import { Await } from './await';

import { ComputePass } from '../pass/compute-pass';
import { ReadbackPass } from '../pass/readback-pass';

export type ComputeProps = {
  immediate?: boolean,
};

export type VirtualDraw = {
  pipeline: DeepPartial<GPURenderPipelineDescriptor>,
  defines: Record<string, any>,
  mode?: RenderPassMode | string,
  id?: number,

  vertexCount?: Lazy<number>,
  instanceCount?: Lazy<number>,
  indirect?: StorageSource, 

  renderer?: string,
  links?: Record<string, ShaderModule>,
};

export const Compute: LC<ComputePropsProps> = memo((props: PropsWithChildren<ComputePropsProps>) => {
  const {
    immediate,
    children,
  } = props;

  const inspect = useInspectable();

  const Resume = (calls: Record<string, (ComputeToPass | RenderToPass | CommandToBuffer | ArrowFunction)[]>) =>
    useOne(() => [
      calls.compute ? use(ComputePass, {immediate, calls}) : null,
      calls.post || calls.readback ? use(ReadbackPass, {calls}) : null,
    ], calls);

  return multiGather(children, Resume);
}, 'Pass');
