import { LiveComponent } from '@use-gpu/live/types';
import { CanvasRenderingContextGPU } from '@use-gpu/webgpu/types';
import { DataField, Emitter, StorageSource, ViewUniforms, UniformAttribute, RenderPassMode } from '@use-gpu/core/types';

import { use, morph, useFiber, useMemo, useOne, useResource, useState } from '@use-gpu/live';

import {
  AutoCanvas, CanvasPicking,
  Loop, Draw, Pass,
  CompositeData, Data, RawData,
  FontLoader,
  OrbitCamera, OrbitControls,
  Pick,
  Cursor, Points, Lines,
  RawQuads as Quads, RawLines,
  RenderToTexture,
  Router, Routes,
  TextProvider,
  ViewProvider,
} from '@use-gpu/components';
import { UseInspect } from '@use-gpu/inspect';

import { GeometryPage } from './pages/geometry';
import { InteractPage } from './pages/interact';
import { LayoutPage } from './pages/layout';
import { AtlasPage } from './pages/atlas';
import { RTTPage } from './pages/rtt';
import { PlotPage } from './pages/plot';
import { EmptyPage } from './pages/empty';

export type AppProps = {
  device: GPUDevice,
  adapter: GPUAdapter,
  canvas: HTMLCanvasElement,
};

export const App: LiveComponent<AppProps> = (props) => {
  const {canvas, device, adapter} = props;

  const fiber = useFiber();
  const inspect = useInspector();

  const routes = (
    use(Router, {
      routes: {
        "/": {
          routes: {
            "geometry": { element: use(GeometryPage, { canvas }) },
            "layout": { element: use(LayoutPage, { }) },
            "interact": { element: use(InteractPage, { }) },
            "atlas": { element: use(AtlasPage, { }) },
            "plot": { element: use(PlotPage, { canvas }) },
            "rtt": { element: use(RTTPage, { canvas }) },
            "": { element: use(GeometryPage, { canvas }) },
            "*": { element: use(EmptyPage, { }) },
          },
        },
      },
    })
  );
  
  const fonts = [
    {
      family: 'Lato',
      weight: 400,
      style: 'normal',
      src: '/Lato-Regular.ttf',
    },
    {
      family: 'Lato',
      weight: 400,
      style: 'italic',
      src: '/Lato-Italic.ttf',
    },
    {
      family: 'Lato',
      weight: 500,
      style: 'normal',
      src: '/Lato-Bold.ttf',
    },
  ];

  return [
      use(AutoCanvas, {
        canvas, device, adapter, samples: 4,
        children: 
          use(FontLoader, {
            fonts,
            children: routes,
          })
      }),
      inspect ? use(UseInspect, {fiber, canvas}) : null,
  ];
};

const useInspector = () => {
  const [inspect, setInspect] = useState<boolean>(true);
  useResource((dispose) => {
    const keydown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'i') setInspect((s) => !s);
      if ((e.ctrlKey || e.metaKey) && e.key === 'j') setInspect((s) => s);
    }

    window.addEventListener('keydown', keydown);
    dispose(() => window.addEventListener('keydown', keydown));
  });

  return inspect;
}
