import { LiveComponent } from '../live/types';
import { defer } from '../live/live';
import { AutoSize, Canvas } from '../components';

export type AppProps = {
  device: GPUDevice,
  adapter: GPUAdapter,
  canvas: HTMLCanvasElement,
};

export const App: LiveComponent<AppProps> = (context) => (props) => {
  const {canvas, device, adapter} = props;

  return defer(AutoSize)({
    canvas,
    render: (width: number, height: number) =>
      defer(Canvas)({
        canvas, device, adapter
      }),
  });
};

