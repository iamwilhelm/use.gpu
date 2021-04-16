import {LiveComponent} from '../live/types';
import {useResource, useState} from '../live/live';

export type AutoSizeProps = {
  canvas: HTMLCanvasElement,
  render: (width: number, height: number) => void,
}

export const getCanvasSize = (window: HTMLWindowElement, canvas: HTMLCanvasElement) => {
  const dpi = window.devicePixelRatio;
  const {offsetWidth, offsetHeight} = canvas;
  return [dpi * offsetWidth, dpi * offsetHeight];
}

export const AutoSize: LiveComponent<AutoSizeProps> = (context) => (props) => {
  const {canvas, render} = props;
  
  const [size, setSize] = useState(context, 0)(() => getCanvasSize(window, canvas));
  const width  = canvas.width  = size[0];
  const height = canvas.height = size[1];

  useResource(context, 1)(() => {
    const resize = () => setSize(getCanvasSize(window, canvas))
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [canvas]);

  return render(width, height);
};
