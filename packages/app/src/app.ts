import { LiveComponent } from '@use-gpu/live/types';
import { CanvasRenderingContextGPU } from '@use-gpu/webgpu/types';
import { DataField, Emitter, ShaderLanguages, StorageSource, ViewUniforms, UniformAttribute, RenderPassMode } from '@use-gpu/core/types';

import { use, useMemo, useOne, useResource, useState } from '@use-gpu/live';

import {
  AutoCanvas,
  Loop, Draw, Pass,
  CompositeData, Data, RawData, Inline,
  OrbitCamera, OrbitControls,
  AutoPicking, Pick,
  Cursor, Points, Lines,
  RawQuads as Quads, RawLines,
  RenderToTexture,
  Router, Routes,
  ViewProvider,
} from '@use-gpu/components';
import { Mesh } from './mesh';
import { makeMesh } from './meshes/mesh';
import { UseInspect } from '@use-gpu/inspect';

import { GeometryPage } from './pages/geometry';

export type AppProps = {
  device: GPUDevice,
  adapter: GPUAdapter,
  canvas: HTMLCanvasElement,
  languages: ShaderLanguages,
};

export const App: LiveComponent<AppProps> = (fiber) => (props) => {
  const {canvas, device, adapter, languages} = props;

  const inspect = useInspector();
  const mesh = makeMesh();

  const routes = (
    use(Router)({
      routes: {
        "/": {
          routes: {
            "test": { element: use(GeometryPage)({ canvas }) },
          },
        },
      },
    })
  );

  return [
    use(AutoCanvas)({
      canvas, device, adapter, languages, samples: 4,
      children:
      
        use(AutoPicking)({
          canvas,
          children: routes,
        })
    }),
    inspect ? use(UseInspect)({fiber, canvas}) : null,
  ];
};

const useInspector = () => {
  const [inspect, setInspect] = useState<boolean>(true);
  useResource((dispose) => {
    const keydown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === 'i') setInspect((s) => !s);
      if (e.metaKey && e.key === 'j') setInspect((s) => s);
    }

    window.addEventListener('keydown', keydown);
    dispose(() => window.addEventListener('keydown', keydown));
  });

  return inspect;
}
