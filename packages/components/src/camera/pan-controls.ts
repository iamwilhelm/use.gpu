import { LiveComponent, LiveElement } from '@use-gpu/live/types';

import { useContext, useMemo, useOne, useResource, useState } from '@use-gpu/live';
import { MouseContext, WheelContext, KeyboardContext } from '../providers/event-provider';
import { LayoutContext } from '../providers/layout-provider';

const CAPTURE_EVENT = {capture: true};

const π = Math.PI;
const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));

export type PanControlsProps = {
  x?: number,
  y?: number,
  zoom?: number,
  zoomSpeed?: number,
  anchor?: [number, number],
  active?: boolean,
  version?: number,

  render: (x: number, y: number, zoom: number) => LiveElement<any>,
};

export const PanControls: LiveComponent<PanControlsProps> = (props) => {
  const {
    x: initialX = 0,
    y: initialY = 0,
    zoom: initialZoom = 1,
    zoomSpeed = 1/100,
    active = true,
    version,
    render,
  } = props;

  const [x, setX]       = useState<number>(initialX);
  const [y, setY]       = useState<number>(initialY);
  const [zoom, setZoom] = useState<number>(initialZoom);

  useOne(() => {
    setX(initialX);
    setY(initialY);
    setZoom(initialZoom);
  }, version);

  const { useMouse } = useContext(MouseContext);
  const { useWheel } = useContext(WheelContext);
  const { useKeyboard } = useContext(KeyboardContext);
  const layout = useContext(LayoutContext);

  const mouse = useMouse();
  const wheel = useWheel();
  const keyboard = useKeyboard();

  useOne(() => {
    if (!active) return;

    const { moveX, moveY, buttons } = mouse;

    if (buttons.left) {
      if (moveX || moveY) {
        setX(x => x + moveX / zoom);
        setY(y => y + moveY / zoom);
      }
    }
  }, mouse.version);

  useOne(() => {
    if (!active) return;

    const {moveX, moveY, stop} = wheel;
    
    if (keyboard.modifiers.shift) {
      if (moveX || moveY) {
        setX(x => x - moveX / zoom);
        setY(y => y - moveY / zoom);        
      }
    }
    else if (moveY) {
      const z = zoom * (1 - moveY * zoomSpeed);
      
      const px = (mouse.x / zoom) - x;
      const py = (mouse.y / zoom) - y;

      const dx = (mouse.x / z) - px;
      const dy = (mouse.y / z) - py;

      setZoom(z);
      setX(dx);
      setY(dy);
    }

    stop();
  }, wheel.version);

  return useMemo(() => render(x, y, zoom), [render, x, y, zoom]);
};
