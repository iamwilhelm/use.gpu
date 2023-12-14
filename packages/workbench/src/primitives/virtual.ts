import type { LiveComponent } from '@use-gpu/live';
import type { VirtualDraw } from '../pass/types';
import { memo, use, useMemo, useRef } from '@use-gpu/live';

import { useInspectHoverable } from '../hooks/useInspectable';
import { usePassContext } from '../providers/pass-provider';

export type VirtualProps = VirtualDraw;

export const Virtual: LiveComponent<VirtualProps> = memo((props: VirtualProps) => {
  const {useVariants} = usePassContext();

  const hovered = useInspectHoverable();
  const variants = useVariants(props, hovered);

  if (Array.isArray(variants)) {
    if (variants.length === 1) {
      const [component] = variants;
      return use(component, props);
    }
    return variants.map(component => use(component, props));
  }
  else if (variants) {
    // Inline static virtuals
    const component = variants;
    const componentRef = useRef(component);

    if (component === componentRef.current) return component(props);
    else return use(component, props);
  }
}, 'Virtual');
