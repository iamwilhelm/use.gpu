import type { LiveComponent, PropsWithChildren } from '@use-gpu/live';
import type { UseGPURenderContext, ColorSpace } from '@use-gpu/core';

import { useTimeContext } from '@use-gpu/workbench';
import { useOne, useResource } from '@use-gpu/live';

export type FPSCounterProps = {
  container?: Element | string | null,

  left?: number,
  top?: number,
  width?: number,
  height?: number,
  samples?: number,
};

export const FPSCounter: LiveComponent<FPSCounterProps> = (props: PropsWithChildren<FPSCounterProps>) => {
  const {
    container,

    pad = 5,
    font = 14,
    left = 0,
    top = 0,
    width = 200,
    height = 100,
    samples = 100,
  } = props;

  const time = useTimeContext();
  
  const values = useOne(() => []);
  if (time.delta) values.push(1000 / time.delta);
  if (values.length > samples) values.shift();

  const [canvas, w, h, p] = useResource((dispose) => {
    const parent = typeof container === 'string' ? document.querySelector(container) : container;
    if (!parent) throw new Error(`Cannot find parent element '${container}'`);

    const wp = width + pad*2;
    const hp = height + pad*2;

    const canvas = document.createElement('canvas');
    const {devicePixelRatio: dpi} = window;
    canvas.width = wp * dpi;
    canvas.height = hp * dpi;
    canvas.style.left = `${left}px`;
    canvas.style.top = `${top}px`;
    canvas.style.width = `${wp}px`;
    canvas.style.height = `${hp}px`;
    canvas.style.position = 'absolute';

    parent.appendChild(canvas);

    dispose(() => parent.removeChild(canvas));

    return [canvas, width * dpi, height * dpi, pad * dpi];
  }, [container]);

  const context = useOne(() => canvas.getContext('2d'), canvas);
  context.fillStyle = '#000000';
  context.fillRect(0, 0, w+p*2, h+p*2);

  const min = values.reduce((a, b) => Math.min(a, b), Infinity);
  const max = values.reduce((a, b) => Math.max(a, b), -Infinity);
  const avg = values.reduce((a, b) => a + b, 0) / (values.length || 1);

  const jitter = (max - min) / 2;

  const xs = width / samples;
  const skip = samples - values.length;

  const line = font + 4;
  const hh = h - line;

  const toHex = (f: number) => ('0' + ((f * 255) | 0).toString(16)).slice(-2);

  const toColor = (f: number) => {
    const t = Math.max(0, f - 0.95) / 0.05;
    const r = 1;
    const g = t;
    const b = t;
    return '#' + toHex(r) + toHex(g) + toHex(b);
  };

  for (let i = 0; i < values.length; ++i) {
    const x = (skip + i) * xs;
    const f = values[i] / max;
    const v = f * hh;
    context.fillStyle = toColor(f);
    context.fillRect(x + p, line + hh - v + p, xs, v);
  }

  const text = `${avg.toFixed(1)} fps - ${(1000 / avg).toFixed(1)}ms`;
  context.fillStyle = '#c0c0c0';
  context.font = 'bold 12px sans-serif';
  context.fillText(text, p, p + font - 2);
};
