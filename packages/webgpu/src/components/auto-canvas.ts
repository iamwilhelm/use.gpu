import { LiveComponent, LiveElement } from '@use-gpu/live/types';

import { use, useResource, useNoResource } from '@use-gpu/live';
import { Picking } from '@use-gpu/workbench';
import { CursorConsumer } from '@use-gpu/workbench';

import { makeOrAdoptCanvas } from '../web';
import { AutoSize } from './auto-size';
import { Canvas } from './canvas';
import { DOMEvents } from './dom-events';

export type AutoCanvasProps = {
  canvas?: HTMLCanvasElement,
  selector?: string,

  format?: GPUTextureFormat,
  depthStencil?: GPUTextureFormat,
  backgroundColor?: GPUColor,
  samples?: number,

  picking?: boolean,
  children: LiveElement<any>,
}

export const AutoCanvas: LiveComponent<AutoCanvasProps> = (props) => {
  const {
    selector,
    children,
    picking = true,
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

  const view = (
    use(DOMEvents, {
      element: canvas,
      children:
        use(CursorConsumer, {
          element: canvas,
          children,
        })
    })
  );

  return (
    use(AutoSize, {
      canvas,
      children:
        use(Canvas, {
          ...rest,
          canvas,
          children:
            picking
            ? use(Picking, {
                children: view,
              })
            : view
        })
    })
  );
}