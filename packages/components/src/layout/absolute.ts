import { LiveComponent, LiveElement } from '@use-gpu/live/types';

import { provide, useContext, useMemo } from '@use-gpu/live';
import { LayoutState, LayoutContext } from '../providers/layout-provider';
import { parseDimension } from './util';

export type AbsoluteProps = {
  left?: string | number | null,
  top?: string | number | null,
  right?: string | number | null,
  bottom?: string | number | null,
  width?: string | number | null,
  height?: string | number | null,

  children?: LiveElement<any>,
};

export const Absolute: LiveComponent<AbsoluteProps> = (fiber) => (props) => {
  const layout = useContext(LayoutContext);

  const nextLayout = useMemo(() => {
    let [
      left,
      top,
      right,
      bottom,
    ] = layout;

    let width = right - left;
    let height = bottom - top;

    let {
      left: l,
      right: r,
      top: t,
      bottom: b,
      width: w,
      height: h,
    } = props;

    if (l != null) left   += parseDimension(l, width);
    if (r != null) right  -= parseDimension(r, width);
    if (t != null) top    += parseDimension(t, height);
    if (b != null) bottom -= parseDimension(b, height);
    if (w != null) {
      width = parseDimension(w, width);
      if (l != null || r == null) right = left + width;
      else left = right - width;
    }

    if (h != null) {
      height = parseDimension(h, height);
      if (t != null || b == null) bottom = top + height;
      else top = bottom - height;
    }

    return [left, top, right, bottom] as LayoutState;
  }, [props, layout]);

  const {children} = props;
  return provide(LayoutContext, nextLayout, children);
};
