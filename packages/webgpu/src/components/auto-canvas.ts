import type { LiveComponent, LiveElement } from '@use-gpu/live';

import { use, useResource, useNoResource } from '@use-gpu/live';
import { PickingTarget } from '@use-gpu/workbench';
import { CursorProvider } from '@use-gpu/workbench';

import { makeOrAdoptCanvas } from '../web';
import { AutoSize } from './auto-size';
import { Canvas } from './canvas';
import { DOMEvents } from './dom-events';

export type AutoCanvasProps = {
  /** Adopt HTML canvas */
  canvas?: HTMLCanvasElement,
  /** Adopt from, or create HTML canvas in CSS selector */
  selector?: string,

  /** Color format */
  format?: GPUTextureFormat,
  /** Depth stencil format */
  depthStencil?: GPUTextureFormat,
  /** Canvas background */
  backgroundColor?: GPUColor,
  /** Multisampling / Anti-aliasing */
  samples?: number,

  /** Autofocus keyboard on canvas */
  autofocus?: boolean,
  /** Enable DOM events */
  events?: boolean,
  /** Enable GPU picking */
  picking?: boolean,
  /** If running in an iframe, avoid preventing default on scroll. */
  iframe?: boolean,
  children: LiveElement,
}

export const AutoCanvas: LiveComponent<AutoCanvasProps> = (props) => {
  const {
    selector,
    children,
    events = true,
    autofocus = false,
    picking = true,
    iframe = false,
    ...rest
  } = props;

  let {canvas} = props;
  if (!canvas && props.selector) {
    canvas = useResource((dispose) => {
      const [c, d] = makeOrAdoptCanvas(props.selector!);
      dispose(d);
      return c;
    }, [props.selector]);
  }
  else {
    useNoResource();
  }
  if (!canvas) throw new Error(`Cannot find canvas '${props.selector ?? props.canvas}'`);

  const view = events ? (
    use(DOMEvents, {
      autofocus,
      iframe,
      element: canvas,
      children:
        use(CursorProvider, {
          element: canvas,
          children,
        })
    })
  ) : children;

  return (
    use(AutoSize, {
      canvas,
      children:
        use(Canvas, {
          ...rest,
          canvas,
          children:
            picking
            ? use(PickingTarget, {
                children: view,
              })
            : view
        })
    })
  );
}