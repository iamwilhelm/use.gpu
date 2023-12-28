import type { LiveComponent } from '@use-gpu/live';
import type { VirtualDraw } from '../pass/types';
import { memo, use, useMemo } from '@use-gpu/live';

import { useInspectHoverable } from '../hooks/useInspectable';
import { useVariantContext } from '../providers/pass-provider';
import { PassReconciler } from '../reconcilers';

const {quote} = PassReconciler;

export type VirtualProps = VirtualDraw;

export const Virtual: LiveComponent<VirtualProps> = memo((props: VirtualProps) => {
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
}, 'Virtual');
