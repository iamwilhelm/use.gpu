import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { LayoutElement, LayoutPicker, Point } from './types';

import { memo, yeet, provide, gather, use, keyed, fragment, useContext, useConsumer, useFiber, useMemo, useOne } from '@use-gpu/live';
import { DebugContext } from '../providers/debug-provider';
import { LayoutContext } from '../providers/layout-provider';
import { MouseContext, WheelContext } from '../providers/event-provider';
import { ScrollContext } from '../consumers/scroll-consumer';
import { ViewContext } from '../providers/view-provider';

import { UIRectangle } from './shape/ui-rectangle';
import { mat4, vec3 } from 'gl-matrix';

export type LayoutProps = {
  inspect?: boolean,
  render?: () => LiveElement<any>,
  children?: LiveElement<any>,
};

export const Layout: LiveComponent<LayoutProps> = memo((props: LayoutProps) => {
  const {inspect, render, children} = props;
  return gather(children ?? (render ? render() : null), Resume);
}, 'Layout');

const Resume = (els: LayoutElement[]) => {
  const layout = useContext(LayoutContext);
  const {layout: {inspect}} = useContext(DebugContext);

  const [left, top, right, bottom] = layout;
  const size = [right - left, bottom - top] as Point;
  
  const pickers: any[] = [];

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

    if (pick) pickers.push((x: number, y: number, scroll: boolean = false) => pick(x, y, left + ml, top + mt, scroll));
  }
  
  pickers.reverse();
  
  out.push(keyed(Scroller, -2, pickers));

  if (inspect) out.push(keyed(Inspect, -1, pickers));

  return fragment(out);
};

const screenToView = (projectionMatrix: mat4, x: number, y: number) => {
  const v = [x, y, 0.5, 1.0] as any;
  const m = mat4.create();
  mat4.invert(m, projectionMatrix);
  vec3.transformMat4(v, v, m);
  return [v[0], v[1]];
};

export const Scroller = (pickers: any[]) => {
  const { useWheel } = useContext(WheelContext);
  const { viewUniforms } = useContext(ViewContext);
  const {
    viewSize: { current: [width, height] },
    projectionMatrix: { current: matrix },
  } = viewUniforms;

  const { wheel } = useWheel();
  const [px, py] = screenToView(matrix, wheel.x / width * 2.0 - 1.0, 1.0 - wheel.y / height * 2.0);
  
  useOne(() => {
    const { x, y, moveX, moveY, stopped } = wheel;
    if (stopped) return;

    for (const picker of pickers) {
      const picked = picker(px, py, true);
      if (picked) {
        const [id, rectangle, onScroll] = picked;
        if (onScroll) onScroll(moveX, moveY);

        useConsumer(ScrollContext);
        return;
      }
    }
  }, wheel);
}

export const Inspect = (pickers: any[]) => {
  const { id } = useFiber();
  const { useMouse } = useContext(MouseContext);
  const { viewUniforms } = useContext(ViewContext);
  const {
    viewSize: { current: [width, height] },
    projectionMatrix: { current: matrix },
  } = viewUniforms;

  const { mouse } = useMouse();
  const [px, py] = screenToView(matrix, mouse.x / width * 2.0 - 1.0, 1.0 - mouse.y / height * 2.0);

  const picked = useOne(() => {
    for (const picker of pickers) {
      const picked = picker(px, py);
      if (picked) return picked;
    }
  }, [pickers]);

  if (!picked) return null;

  const [, rectangle] = picked;
  return useMemo(() => 
    use(UIRectangle, {
      id,
      layout: rectangle,
      fill: [0, 1, 1, .2],
      stroke: [0.3, 0.9, 1, 1],
      border: [2, 2, 2, 2],
    }),
    [id, ...rectangle]
  );
}