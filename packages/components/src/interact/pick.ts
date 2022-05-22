import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { useContext, useMemo, useNoMemo, useOne, useResource, useNoResource } from '@use-gpu/live';
import { EventContext, MouseContext, MouseEventState } from '../providers/event-provider';

type PickState = {
  id: number,
  hovered: boolean,
  pressed: {
    left: boolean,
    middle: boolean,
    right: boolean,
  },
  presses: {
    left: number,
    middle: number,
    right: number,
  },
  clicks: {
    left: number,
    middle: number,
    right: number,
  },
  index: number,
};

export type PickProps = {
  capture?: boolean,
  render?: (state: PickState) => LiveElement<any>,
  children?: LiveElement<any>,
  onMouseOver?: (m: MouseEventState) => void,
  onMouseOut?: (m: MouseEventState) => void,
  onMouseDown?: (m: MouseEventState) => void,
  onMouseUp?: (m: MouseEventState) => void,
  onMouseMove?: (m: MouseEventState) => void,
}

export const Pick: LiveComponent<PickProps> = ({
  render,
  children,
  onMouseOver,
  onMouseOut,
  onMouseDown,
  onMouseUp,
  onMouseMove,
}) => {
  const { useId } = useContext(EventContext);
  const { useMouse } = useContext(MouseContext);

  const id = useId();
  const mouse = useMouse(id);
  const { mouse: {x, y}, hovered, captured, pressed, presses, clicks, index } = mouse;

  if (onMouseMove) {
    useMemo(() => {
      if (hovered || captured) {
        if (onMouseMove) onMouseMove(mouse);
      }
    }, [x, y]);
  }
  else {
    useNoMemo();
  }

  if (onMouseOver || onMouseOut) {
    useResource((dispose) => {
      if (hovered) {
        if (onMouseOver) onMouseOver(mouse);
        if (onMouseOut) dispose(() => onMouseOut(mouse));
      }
    }, [hovered]);
  }
  else {
    useNoResource();
  }

  if (onMouseDown || onMouseUp) {
    const { left, middle, right } = pressed;
    useResource((dispose) => {
      if (left) {
        if (onMouseDown) onMouseDown(mouse);
        if (onMouseUp) dispose(() => onMouseUp(mouse));
      }
    }, [left]);
    useResource((dispose) => {
      if (middle) {
        if (onMouseDown) onMouseDown(mouse);
        if (onMouseUp) dispose(() => onMouseUp(mouse));
      }
    }, [middle]);
    useResource((dispose) => {
      if (right) {
        if (onMouseDown) onMouseDown(mouse);
        if (onMouseUp) dispose(() => onMouseUp(mouse));
      }
    }, [right]);
  }
  else {
    useNoResource();
    useNoResource();
    useNoResource();
  }

  const count = presses.left + clicks.left + presses.middle + clicks.middle + presses.right + clicks.right;

  return useMemo(() =>
    render ? render({id, index, hovered, pressed, presses, clicks}) : (children ?? null),
    [render, children, id, index, hovered, pressed, count]
  );
};

