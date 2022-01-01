import { LiveComponent, LiveElement } from '@use-gpu/live/types';

import { provide, useContext, useOne } from '@use-gpu/live';
import { LayoutContext } from '../providers/layout-provider';

export type AbsoluteProps = {
  left?: number | null,
  top?: number | null,
  right?: number | null,
  bottom?: number | null,
  width?: number | null,
  height?: number | null,

  children?: LiveElement<any>,
};

export const Absolute: LiveComponent<AbsoluteProps> = (fiber) => (props) => {
  let {
    left,
    top,
    right,
    bottom,
    width,
    height,
  } = useContext(LayoutContext);

  const layout = useOne(() => {
    let {
      left: l,
      right: r,
      top: t,
      bottom: b,
      width: w,
      height: h,
    } = props;

    if (l != null) left += l;
    if (r != null) right -= r;
    if (t != null) top += t;
    if (b != null) bottom -= b;
    if (w != null) {
      width = w;
      right = left + width;
    }
    else {
      width = right - left;
    }

    if (h != null) {
      height = h;
      bottom = top + height;
    }
    else {
      height = bottom - top;
    }

    return { left, top, right, bottom, width, height };  
  }, props);

  const {children} = props;
  return provide(LayoutContext, layout, children);
};
