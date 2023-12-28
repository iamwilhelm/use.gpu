import type { LiveComponent } from '@use-gpu/live';
import type { VirtualDraw } from '../pass/types';
import { memo, use, quote, useMemo } from '@use-gpu/live';

import { useInspectHoverable } from '../hooks/useInspectable';
import { useVirtualContext } from '../providers/pass-provider';

export type VirtualProps = VirtualDraw;

export const Virtual: LiveComponent<VirtualProps> = memo((props: VirtualProps) => {
  const useVariants = useVirtualContext();

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
