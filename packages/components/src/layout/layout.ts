import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { LayoutElement, LayoutPicker, Point } from './types';

import { memo, yeet, provide, gather, use, keyed, useContext, useMemo } from '@use-gpu/live';
import { LayoutContext } from '../providers/layout-provider';
import { MouseContext } from '../providers/event-provider';

import { Surface } from './shape/surface';

export type LayoutProps = {
  render?: () => LiveElement<any>,
  children?: LiveElement<any>,
};

export const Layout: LiveComponent<LayoutProps> = memo((props: LayoutProps) => {
  const {render, children} = props;
  return gather(children ?? (render ? render() : null), Resume);
}, 'Layout');

const Resume = (els: LayoutElement[]) => {
  const layout = useContext(LayoutContext);
  const [left, top, right, bottom] = layout;
  const size = [right - left, bottom - top] as Point;
  
  const pickers: LayoutPicker[] = [];
  
  const out = [] as LiveElement[];
  for (const {margin, fit} of els) {
    const {
      size: [w, h],
      render,
      pick,
    } = fit(size);

    const [ml, mt] = margin;
    const el = render([left + ml, top + mt, left + ml + w, top + mt + h]);

    if (Array.isArray(el)) out.push(...el);
    else if (el) out.push(el);

    if (pick) pickers.push((x: number, y: number) => pick(x, y, left + ml, top + mt));
  }
  
  pickers.reverse();
  
  out.push(keyed(LayoutPick, 'pick', pickers));
  return out;
};

export const LayoutPick = (pickers: LayoutPicker[]) => {
  const {useMouse} = useContext(MouseContext);
  
  const { x, y } = useMouse();
  
  for (const picker of pickers) {
    const rectangle = picker(x, y);
    if (rectangle) {
      return use(Surface, {
        layout: rectangle,
        fill: [0, 1, 1, .2],
        stroke: [0.3, 0.9, 1, 1],
        border: [2, 2, 2, 2],
      });
    }
  }

  return null;
};