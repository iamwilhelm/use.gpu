import type { LiveComponent, PropsWithChildren } from '@use-gpu/live';
import type { ShaderModule } from '@use-gpu/shader';
import type { Rectangle, UniformAttribute } from '@use-gpu/core';
import type { LayoutFit, FitInto } from '../types';

import { memo, gather, yeet, useMemo } from '@use-gpu/live';
import { bindBundle, chainTo } from '@use-gpu/shader/wgsl';

import { memoFit, memoLayout } from '../lib/util';

import { getCombinedClip } from '@use-gpu/wgsl/layout/clip.wgsl';

export type TransformProps = {
  clip?: ShaderModule,
  mask?: ShaderModule,
  transform?: ShaderModule,
};

export const Transform: LiveComponent<TransformProps> = memo((props: PropsWithChildren<TransformProps>) => {
  const {
    clip,
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
            parentClip?: ShaderModule,
            parentMask?: ShaderModule,
            parentTransform?: ShaderModule,
          ) => {
            const xmask = parentMask && mask ? chainTo(parentMask, mask) : parentMask ?? mask;
            const xform = parentTransform && transform ? chainTo(parentTransform, transform) : parentTransform ?? transform;
            const xclip = parentClip ? (
              bindBundle(
                getCombinedClip,
                {
                  getParent: parentClip,
                  getSelf: clip ?? null,
                }
              )
            ) : clip;

            return fit.render(box, box, xclip, xmask, xform);
          })
        };
      }),
    }))), [items, mask, transform]);
  });
}, 'Transform');
