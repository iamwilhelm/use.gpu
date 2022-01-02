import { LiveComponent, LiveElement } from '@use-gpu/live/types';

import { provide, useContext, useMemo } from '@use-gpu/live';
import { LayoutContext } from '../providers/layout-provider';
import { LayoutState } from './types';
import { parseDimension } from './lib/util';

export type AbsoluteProps = {
  left?: string | number | null,
  top?: string | number | null,
  right?: string | number | null,
  bottom?: string | number | null,
  width?: string | number | null,
  height?: string | number | null,

  snap?: boolean,
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
      snap = true,
    } = props;

    let favorW = false;
    let favorH = false;

    if (l != null) left   += parseDimension(l, width);
    if (r != null) right  -= parseDimension(r, width);
    if (t != null) top    += parseDimension(t, height);
    if (b != null) bottom -= parseDimension(b, height);
    if (w != null) {
      width = parseDimension(w, width);
      if (l != null || r == null) right = left + width;
      else left = right - width;
      favorW = true;
    }

    if (h != null) {
      height = parseDimension(h, height);
      if (t != null || b == null) bottom = top + height;
      else top = bottom - height;
      favorH = true;
    }

    if (snap) {
      left = Math.round(left);
      top = Math.round(top);

      if (favorW) {
        width = Math.round(width);
        right = left + width;
      }
      else {
        right = Math.round(right);
        width = right - left;
      }

      if (favorH) {
        height = Math.round(height);
        bottom = top + height;
      }
      else {
        bottom = Math.round(bottom);
        height = bottom - top;
      }
    }

    return [left, top, right, bottom] as LayoutState;
  }, [props, layout]);

  const {children} = props;
  return provide(LayoutContext, nextLayout, children);
};
