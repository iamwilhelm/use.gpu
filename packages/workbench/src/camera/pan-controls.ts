import type { LiveComponent, LiveElement } from '@use-gpu/live';

import { useCallback, useContext, useMemo, useOne, useResource, useState, useYolo } from '@use-gpu/live';
import { MouseContext, WheelContext, KeyboardContext } from '../providers/event-provider';
import { LayoutContext } from '../providers/layout-provider';

const π = Math.PI;

export type PanControlsProps = {
  x?: number,
  y?: number,
  zoom?: number,
  zoomSpeed?: number,
  anchor?: [number, number],
  scroll?: boolean,
  active?: boolean,
  centered?: boolean,
  version?: number,

  minX?: number,
  maxX?: number,
  minY?: number,
  maxY?: number,
  minZoom?: number,
  maxZoom?: number,

  render: (x: number, y: number, zoom: number) => LiveElement,
};

const DEFAULT_ANCHOR = [0.5, 0.5];

export const PanControls: LiveComponent<PanControlsProps> = (props) => {
  const layout = useContext(LayoutContext);
  const [l, t, r, b] = layout;

  const {
    zoom: initialZoom = 1,
    x: initialX = 0,
    y: initialY = 0,
    zoomSpeed = 1/80,
    centered = true,

    minX,
    maxX,
    minY,
    maxY,
    minZoom,
    maxZoom,

    scroll = false,
    active = true,
    anchor = DEFAULT_ANCHOR,
    version,
    render,
  } = props;

  const [x, setX]       = useState<number>(initialX);
  const [y, setY]       = useState<number>(initialY);
  const [zoom, setZoom] = useState<number>(initialZoom);

  let originX = 0;
  let originY = 0;
  let offsetX = 0;
  let offsetY = 0;

  const w = Math.abs(r - l);
  const h = Math.abs(b - t);
  if (centered) {
    originX = w / 2;
    originY = h / 2;

    offsetX = -w * (anchor[0] - 0.5);
    offsetY = -h * (anchor[1] - 0.5);
  }

  const { useMouse } = useContext(MouseContext);
  const { useWheel } = useContext(WheelContext);
  const { useKeyboard } = useContext(KeyboardContext);

  const { mouse } = useMouse();
  const { wheel } = useWheel();
  const { keyboard } = useKeyboard();

  let reset = false;
  useOne(() => {
    reset = keyboard.modifiers.alt && keyboard.keys.enter;
  }, keyboard);

  useOne(() => {
    setX(initialX);
    setY(initialY);
    setZoom(initialZoom);
  }, reset || version);

  useOne(() => {
    setX(initialX);
  }, initialX);

  useOne(() => {
    setY(initialY);
  }, initialY);

  useOne(() => {
    setZoom(initialZoom);
  }, initialZoom);

  const clampX = useCallback((x: number, zoom: number) => {
    let minXZ = minX != null ? minX - w * (zoom - 1) / zoom / 2 : null;
    let maxXZ = maxX != null ? maxX - w * (zoom + 1) / zoom / 2 : null;

    if (minXZ != null && maxXZ != null && minXZ >= maxXZ) minXZ = maxXZ = (minXZ + maxXZ) / 2;

    if (minXZ != null) x = -Math.max(minXZ, -x);
    if (maxXZ != null) x = -Math.min(maxXZ, -x);

    return x;
  }, [minX, maxX, w]);

  const clampY = useCallback((y: number, zoom: number) => {
    let minYZ = minY != null ? minY - h * (zoom - 1) / zoom / 2 : null;
    let maxYZ = maxY != null ? maxY - h * (zoom + 1) / zoom / 2 : null;

    if (minYZ != null && maxYZ != null && minYZ >= maxYZ) minYZ = maxYZ = (minYZ + maxYZ) / 2;

    if (minYZ != null) y = -Math.max(minYZ, -y);
    if (maxYZ != null) y = -Math.min(maxYZ, -y);
    return y;
  }, [minY, maxY, h]);

  useOne(() => {
    const { moveX, moveY, buttons, stopped } = mouse;
    if (!active || stopped) return;

    if (buttons.left) {
      if (moveX || moveY) {
        setX(x => clampX(x + moveX / zoom, zoom));
        setY(y => clampY(y + moveY / zoom, zoom));
      }
    }
  }, mouse);

  useOne(() => {
    const {moveX, moveY, stop, stopped} = wheel;
    if (!active || stopped) return;

    if (!!scroll !== keyboard.modifiers.shift) {
      if (moveX || moveY) {
        setX(x => clampX(x - moveX / zoom, zoom));
        setY(y => clampY(y - moveY / zoom, zoom));
      }
    }
    else if (moveY) {
      let z = zoom * Math.pow(2, -moveY * zoomSpeed);

      if (minZoom != null) z = Math.max(minZoom, z);
      if (maxZoom != null) z = Math.min(maxZoom, z);

      if (z !== zoom) {
        const mx = mouse.x - originX;
        const my = mouse.y - originY;

        const px = (mx / zoom) - x;
        const py = (my / zoom) - y;

        let xx = (mx / z) - px;
        let yy = (my / z) - py;

        setZoom(z);
        setX(clampX(xx, z));
        setY(clampY(yy, z));
      }
    }

    stop();
  }, wheel);

  const panX = centered ? x - originX * (zoom - 1) / zoom + offsetX : x;
  const panY = centered ? y - originY * (zoom - 1) / zoom + offsetY : y;

  return useYolo(() => render(panX, panY, zoom), [render, panX, panY, zoom]);
};
