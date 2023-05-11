import type { LiveComponent, PropsWithChildren } from '@use-gpu/live';
import type { ShaderModule } from '@use-gpu/shader';
import type { Rectangle } from '@use-gpu/core';
import type { LayoutFit, FitInto } from '../types';

import { memo, gather, yeet, useMemo } from '@use-gpu/live';
import { chainTo } from '@use-gpu/shader/wgsl';
import { memoFit, memoLayout } from '../lib/util';

export type TransformProps = {
  mask?: ShaderModule,
  transform?: ShaderModule,
};

export const Transform: LiveComponent<TransformProps> = memo((props: PropsWithChildren<TransformProps>) => {
  const {
    mask,
    transform,
    children,
  } = props;

  return gather(children, (items: LayoutFit[]) => {
    return useMemo(() => yeet(items.map(item => ({
      ...item,
      fit: memoFit((
        into: FitInto
      ) => {
        const fit = item.fit(into);
        return {
          ...fit,
          render: memoLayout((
            box: Rectangle,
            origin: Rectangle,
            clip?: ShaderModule,
            parentMask?: ShaderModule,
            parentTransform?: ShaderModule,
          ) => {
            const xmask = parentMask && mask ? chainTo(parentMask, mask) : parentMask ?? mask;
            const xform = parentTransform && transform ? chainTo(parentTransform, transform) : parentTransform ?? transform;
            return fit.render(box, box, clip, xmask, xform);
          })
        };
      }),
    }))), [items, mask, transform]);
  });
}, 'Transform');
