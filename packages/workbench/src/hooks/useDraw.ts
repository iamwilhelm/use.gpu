import type { LiveComponent } from '@use-gpu/live';
import type { VirtualDraw } from '../pass/types';
import { memo, use, useHooks, useNoHooks } from '@use-gpu/live';

import { useInspectHoverable, useNoInspectHoverable } from '../hooks/useInspectable';
import { useVariantContext, useNoVariantContext } from '../providers/pass-provider';
import { PassReconciler } from '../reconcilers';

const {quote} = PassReconciler;

export const useDraw = (props: VirtualDraw) => {
  const memo = Object.values(props);
  return useHooks(() => {
    const useVariants = useVariantContext();

    const hovered = useInspectHoverable();
    const variants = useVariants(props, hovered);

    if (Array.isArray(variants)) {
      if (variants.length === 1) {
        const [component] = variants;
        return quote(use(component, props));
      }
      return quote(variants.map(component => use(component, props)));
    }
    else if (variants) {
      const component = variants;
      return quote(use(component, props));
    }
  }, memo);
};

export const useNoDraw = useNoHooks;
