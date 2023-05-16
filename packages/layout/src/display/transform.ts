import type { LiveComponent, PropsWithChildren } from '@use-gpu/live';
import type { ShaderModule } from '@use-gpu/shader';
import type { Rectangle, UniformAttribute } from '@use-gpu/core';
import type { LayoutElement, FitInto } from '../types';

import { memo, gather, yeet, useMemo } from '@use-gpu/live';
import { bindBundle, chainTo } from '@use-gpu/shader/wgsl';

import { memoFit, memoLayout } from '../lib/util';

import { getCombinedClip, getTransformedClip } from '@use-gpu/wgsl/layout/clip.wgsl';

export type TransformProps = {
  clip?: ShaderModule,
  mask?: ShaderModule,
  transform?: ShaderModule,
  inverse?: ShaderModule,
};

export const Transform: LiveComponent<TransformProps> = memo((props: PropsWithChildren<TransformProps>) => {
  const {
    clip,
    mask,
    transform,
    inverse,
    children,
  } = props;

  return gather(children, (items: LayoutElement[]) => {
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
            parentClip: ShaderModule | null,
            parentMask: ShaderModule | null,
            parentTransform: ShaderModule | null,
          ) => {
            const xmask = (parentMask && mask ? chainTo(parentMask, mask) : parentMask ?? mask) ?? null;
            const xform = (parentTransform && transform ? chainTo(parentTransform, transform) : parentTransform ?? transform) ?? null;

            const pclip = (parentClip && clip) ? (
              bindBundle(
                getCombinedClip,
                {
                  getParent: parentClip,
                  getSelf: clip ?? null,
                }
              )
            ) : (parentClip ?? clip) ?? null;
            
            const xclip = inverse ? (
              bindBundle(
                getTransformedClip,
                {
                  getParent: pclip,
                  applyTransform: inverse,
                }
              )
            ) : pclip;

            return fit.render(box, box, xclip, xmask, xform);
          })
        };
      }),
    }))), [items, mask, transform]);
  });
}, 'Transform');
