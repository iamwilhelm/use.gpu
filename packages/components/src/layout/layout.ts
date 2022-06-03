import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { Point } from '@use-gpu/core/types';
import { LayoutElement, LayoutPicker } from './types';

import { memo, yeet, provide, gather, use, keyed, fragment, useContext, useConsumer, useFiber, useMemo, useOne } from '@use-gpu/live';
import { DebugContext } from '../providers/debug-provider';
import { LayoutContext } from '../providers/layout-provider';
import { MouseContext, WheelContext } from '../providers/event-provider';
import { ScrollContext } from '../consumers/scroll-consumer';
import { ViewContext } from '../providers/view-provider';
import { useInspectable, useInspectHoverable, useInspectorSelect, Inspector } from '../hooks/useInspectable';

import { makeBoxInspectLayout } from './lib/util';
import { UIRectangle } from './shape/ui-rectangle';
import { mat4, vec3 } from 'gl-matrix';

export type LayoutProps = {
  inspect?: boolean,
  render?: () => LiveElement<any>,
  children?: LiveElement<any>,
};

export const Layout: LiveComponent<LayoutProps> = memo((props: LayoutProps) => {
  const {render, children} = props;
  const inspect = useInspectable();
  const hovered = useInspectHoverable();
  return gather(children ?? (render ? render() : null), Resume(inspect, hovered));
}, 'Layout');

const Resume = (inspect: Inspector, hovered: boolean) => (els: LayoutElement[]) => {
  const layout = useContext(LayoutContext);
  const {layout: {inspect: toggleInspect}} = useContext(DebugContext);

  const [left, top, right, bottom] = layout;
  const into = [right - left, bottom - top] as Point;

  const {id} = useFiber();  
  const pickers: any[] = [];
  const sizes: Point[] = [];
  const offsets: Point[] = [];

  // Render children into root container
  const out = [] as LiveElement[];
  for (const {margin, fit, absolute} of els) {
    const {
      size,
      render,
      pick,
    } = fit(into);

    const [w, h] = absolute ? into : size;
    const [ml, mt] = margin;
    const layout = [left + ml, top + mt, left + ml + w, top + mt + h];
    const el = render(layout);
    
    sizes.push([w, h]);
    offsets.push([left + ml, top + mt]);

    if (Array.isArray(el)) out.push(...el);
    else if (el) out.push(el);

    if (pick) pickers.push((x: number, y: number, scroll: boolean = false) =>
      pick(x, y, layout[0], layout[1], layout[2], layout[3], scroll));
  }

  // Picking goes front-to-back
  pickers.reverse();

  // Inspectable layout
  inspect({
    layout: {
      into,
      size: into,
      sizes,
      offsets,
    },
  });
  if (hovered) out.push(...makeBoxInspectLayout(id, sizes, offsets)([0, 0, 0, 0]));

  // Add scroll listener
  out.push(keyed(Scroller, -2, pickers));
  
  // Interactive inspect handler
  if (toggleInspect) out.push(keyed(Inspect, -1, pickers));

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
    viewPixelRatio: { current: dpi },
    viewSize: { current: [width, height] },
    projectionMatrix: { current: matrix },
  } = viewUniforms;

  const { wheel } = useWheel();
  const [px, py] = screenToView(matrix, wheel.x / width * dpi * 2.0 - 1.0, 1.0 - wheel.y / height * dpi * 2.0);
  
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
    viewPixelRatio: { current: dpi },
    viewSize: { current: [width, height] },
    projectionMatrix: { current: matrix },
  } = viewUniforms;
  
  const setHighlight = useInspectorSelect();

  const { mouse, pressed } = useMouse();
  const [px, py] = screenToView(matrix, mouse.x / width * dpi * 2.0 - 1.0, 1.0 - mouse.y / height * dpi * 2.0);

  const picked = useOne(() => {
    for (const picker of pickers) {
      const picked = picker(px, py);
      if (picked) return picked;
    }
  }, [pickers]);

  if (!picked) return null;

  const [pickedId, rectangle] = picked;
  useOne(() => setHighlight(pickedId ?? null), pickedId);
  useOne(() => pressed.left && setHighlight(pickedId ?? null, true), pressed.left);

  return null;
}