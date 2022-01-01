import { LiveComponent, LiveElement } from '@use-gpu/live/types';

import { provide, useContext, useMemo } from '@use-gpu/live';
import { LayoutContext } from '../providers/layout-provider';

export type AbsoluteProps = {
  left?: string | number | null,
  top?: string | number | null,
  right?: string | number | null,
  bottom?: string | number | null,
  width?: string | number | null,
  height?: string | number | null,

  children?: LiveElement<any>,
};

const parse = (x: string | number, total: number): number => {
  if (typeof x === 'number') return x;

  const s = x as string;
  if (s[s.length - 1] === '%') {
    return +s.slice(0, -1) / 100 * total;
  }

  return +s;
}

export const Absolute: LiveComponent<AbsoluteProps> = (fiber) => (props) => {
  const layout = useContext(LayoutContext);

  const nextLayout = useMemo(() => {
    let {
      left,
      top,
      right,
      bottom,
      width,
      height,
    } = layout;

    let {
      left: l,
      right: r,
      top: t,
      bottom: b,
      width: w,
      height: h,
    } = props;

    if (l != null) left += parse(l, width);
    if (r != null) right -= parse(r, width);
    if (t != null) top += parse(t, height);
    if (b != null) bottom -= parse(b, height);
    if (w != null) {
      width = parse(w, width);
      if (l != null || r == null) right = left + width;
      else left = right - width;
    }
    else {
      width = right - left;
    }

    if (h != null) {
      height = parse(h, height);
      if (t != null || b == null) bottom = top + height;
      else top = bottom - height;
    }
    else {
      height = bottom - top;
    }

    return { left, top, right, bottom, width, height };  
  }, [props, layout]);

  const {children} = props;
  return provide(LayoutContext, nextLayout, children);
};
