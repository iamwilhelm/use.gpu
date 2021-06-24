import { LiveComponent } from '@use-gpu/live/types';
import { CanvasRenderingContextGPU } from '@use-gpu/webgpu/types';
import { CameraUniforms, UniformAttribute } from '@use-gpu/core/types';

import { defer } from '@use-gpu/live';

import {
  AutoCanvas,
  Loop, Draw, Pass,
  OrbitCamera, OrbitControls,
} from '@use-gpu/components';
import { Cube } from './cube';

export type AppProps = {
  device: GPUDevice,
  adapter: GPUAdapter,
  canvas: HTMLCanvasElement,
  compileGLSL: (s: string, t: string) => string,
};

export const App: LiveComponent<AppProps> = live (props) => {
  const {canvas, device, adapter, compileGLSL} = props;

  const {
    width, height, gpuContext,
    colorStates, colorAttachments,
    depthStencilState, depthStencilAttachment,
  } = mount AutoCanvas({canvas, device, adapter});

  const [radius, phi, theta] = mount OrbitControls({canvas});

  const [defs, uniforms] = mount OrbitCamera({
    canvas, width, height,
    radius, phi, theta,
  });

  mount Draw({device, gpuContext, colorAttachments});

  const passEncoder = mount Pass({device, colorAttachments, depthStencilAttachment});

  reconcile {
    cube: mount Cube({device, colorStates, depthStencilState, compileGLSL, defs, uniforms, passEncoder}),
  }
};


export const AutoCanvas: LiveComponent<AutoCanvasProps> = live (props) => {
  const {canvas} = props;
  mount AutoSize({canvas});
  mount Canvas(props);
}

export type OrbitControlsProps = {
  bearingSpeed?: number,
  pitchSpeed?: number,
  canvas: HTMLCanvasElement,
  render: (phi: number, theta: number, radius: number) => LiveElement<any>,
};

export const OrbitControls: LiveComponent<OrbitControlsProps> = live (props) => {
  const {
    bearingSpeed = DEFAULT_OPTIONS.bearingSpeed,
    pitchSpeed   = DEFAULT_OPTIONS.pitchSpeed, 
    canvas,
    render,
  } = props;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [radius, setRadius]   = useState<number>(5);
  const [bearing, setBearing] = useState<number>(0.6);
  const [pitch, setPitch]     = useState<number>(0.4);

  useResource((dispose) => {
    const onWheel = (e: WheelEvent) => {
      const {deltaMode, deltaY} = e;
      let f = 1;
      if (deltaMode === 1) f = 10;
      if (deltaMode === 2) f = 30;
      setRadius((r: number) => r * (1 + deltaY * f / 100));
      e.preventDefault();
    };

    const onMouseMove = (e: MouseEvent) => {
      const {buttons, movementX, movementY} = e;
      const size = Math.min(canvas.width, canvas.height);
      const speedX = bearingSpeed / size;
      const speedY = pitchSpeed   / size;

      if (buttons & 1) {
        setBearing((phi: number) => phi + movementX * speedX);
        setPitch((theta: number) => clamp(theta + movementY * speedY, -π/2, π/2));
        e.preventDefault();
      }
    };

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('wheel', onWheel);

    dispose(() => {
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('wheel', onWheel);
    });
  }, [canvas]);

  return render(radius, bearing, pitch);
};

