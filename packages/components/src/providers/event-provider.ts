import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { PickingUniforms } from '@use-gpu/core/types';

import { memo, provideMemo, makeContext, useContext, useMemo, useOne, useResource, useState } from '@use-gpu/live';
import { makeIdAllocator, PICKING_UNIFORMS } from '@use-gpu/core';
import { PickingContext } from '../render/picking';

const CAPTURE_EVENT = {capture: true};

export const EventContext = makeContext(null, 'EventContext');

export type EventProviderProps = {
  element: HTMLElement,
  children: LiveElement<any>,
};

export type MouseState = {
  buttons: number,
  x: number,
  y: number,
};

export const EventProvider: LiveComponent<EventProviderProps> = memo((fiber) => ({element, children}) => {
  const {sampleTexture} = useContext(PickingContext);

  const [mouseState, setMouseState] = useState<MouseState>({
    buttons: 0,
    x: 0,
    y: 0,
  });

  const allocId = useOne(() => makeIdAllocator<OnPick>());
  const mouseTargetId = sampleTexture(mouseState.x, mouseState.y);

  const ref = useOne(() => ({
    mouseState,
    mouseTargetId,
  }));
  ref.mouseState = mouseState;
  ref.mouseTargetId = mouseTargetId;

  const api = useOne(() => ({
    useId: () => useResource(() => {
      const id = allocId.obtain();
      dispose(() => allocId.release(id));
      return id;
    }),
    getMouseState: () => ref.mouseState,
    getMouseTarget: () => ref.mouseTargetId,
  }));

  useResource((dispose) => {
  }, mouseTargetId);

  useResource((dispose) => {
    let left, top;

    const onSnapshot = () => ({left, top} = element.getBoundingClientRect());

    const onMove = (buttons: number, clientX: number, clientY: number) => {
      setMouseState({
        buttons,
        x: clientX - left,
        y: clientY - top,
      });
    };

    const onTouchStart = (e: TouchEvent) => {
      const {targetTouches: [touch]} = e;
      const {clientX, clientY} = touch;
      onSnapshot();
      onMove(1, clientX, clientY);
    }

    const onTouchMove = (e: TouchEvent) => {
      const {targetTouches: [touch]} = e;
      const {clientX, clientY} = touch;
      onMove(1, clientX, clientY);
    }

    const onTouchEnd = (e: TouchEvent) => {
      const {targetTouches: [touch]} = e;
      if (!touch.length) setMouseState((state) => ({...state, buttons: 0}));
    }

    const onMouseDown = (e: MouseEvent) => {
      const {buttons, clientX, clientY} = e;
      onSnapshot();
      onMove(buttons, clientX, clientY);
    };

    const onMouseMove = (e: MouseEvent) => {
      const {buttons, clientX, clientY} = e;
      onMove(buttons, clientX, clientY);
    };

    const onMouseUp = (e: MouseEvent) => {
      const {buttons, clientX, clientY} = e;
      onMove(buttons, clientX, clientY);
    };

    element.addEventListener('mousedown', onMouseDown, CAPTURE_EVENT);
    element.addEventListener('mousemove', onMouseMove, CAPTURE_EVENT);
    element.addEventListener('mouseup', onMouseUp, CAPTURE_EVENT);

    element.addEventListener('touchstart', onTouchStart, CAPTURE_EVENT);
    element.addEventListener('touchmove', onTouchMove, CAPTURE_EVENT);
    element.addEventListener('touchend', onTouchEnd, CAPTURE_EVENT);

    dispose(() => {
      element.removeEventListener('mousedown', onMouseDown, CAPTURE_EVENT);
      element.removeEventListener('mousemove', onMouseMove, CAPTURE_EVENT);
      element.removeEventListener('mouseup', onMouseUp, CAPTURE_EVENT);

      element.removeEventListener('touchstart', onTouchStart, CAPTURE_EVENT);
      element.removeEventListener('touchmove', onTouchMove, CAPTURE_EVENT);
      element.removeEventListener('touchend', onTouchEnd, CAPTURE_EVENT);
    });
  }, [element]);

  return provideMemo(EventContext, api, children);
}, 'EventProvider');
