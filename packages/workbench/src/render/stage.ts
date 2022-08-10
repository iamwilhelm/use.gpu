import type { LC, PropsWithChildren, LiveFiber, LiveElement, Task } from '@use-gpu/live';
import type { StorageTarget, TextureTarget } from '@use-gpu/core';

import { use, yeet, memo, provide, multiGather, useContext, useMemo } from '@use-gpu/live';
import { DeviceContext } from '../providers/device-provider';
import { ComputeContext, useComputeContext, useNoComputeContext } from '../providers/compute-provider';
import { usePerFrame, useNoPerFrame } from '../providers/frame-provider';
import { useInspectable } from '../hooks/useInspectable'
import { Await } from './await';

const NO_TARGETS: any[] = [];

export type StageProps = {
  target?: StorageTarget | TextureTarget,
  targets?: (StorageTarget | TextureTarget)[],
  live?: boolean,
  render?: () => LiveElement<any>,
};

export const Stage: LC<StageProps> = memo((props: PropsWithChildren<StageProps>) => {
  const {
    live = false,
    target,
    targets,
    children,
    render,
  } = props;

  const inspect = useInspectable();

  const content = render ? render() : children;
  if (!content) return null;
  
  const context = useMemo(() => targets ?? (target ? [target] : []), [target, ...(targets ?? NO_TARGETS)]);

  return provide(ComputeContext, context, content);
}, 'Stage');
