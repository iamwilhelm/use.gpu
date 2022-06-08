import { LC } from '@use-gpu/live/types';
import { CanvasRenderingContextGPU } from '@use-gpu/webgpu/types';
import { DataField, Emitter, StorageSource, ViewUniforms, UniformAttribute, RenderPassMode } from '@use-gpu/core/types';

import React from '@use-gpu/live/jsx';
import { useFiber, useMemo, useOne, useResource, useState } from '@use-gpu/live';
import { HTML } from '@use-gpu/react';

import {
  AutoCanvas, DebugProvider,
  FontLoader,
  Router, Routes,
  WebGPU,
} from '@use-gpu/components';

import { UseInspect } from '@use-gpu/inspect';
import '@use-gpu/inspect/theme.css';

import { makeRoutes } from './routes';
import { makePicker } from './ui/page-picker';

import { FALLBACK_MESSAGE } from './fallback';

export const App: LC = () => {
  
  const root = document.querySelector('#use-gpu')!;
  const inner = document.querySelector('#use-gpu .canvas')!;

  const router = useOne(() => (
    <Router>
      <Routes routes={makeRoutes()} />
      <Routes routes={makePicker(root)} />
    </Router>
  ), root);
  
  const fonts = useOne(() => [
    {
      family: 'Lato',
      weight: 400,
      style: 'normal',
      src: '/fonts/Lato-Regular.ttf',
    },
    {
      family: 'Lato',
      weight: 400,
      style: 'italic',
      src: '/fonts/Lato-Italic.ttf',
    },
    {
      family: 'Lato',
      weight: 500,
      style: 'normal',
      src: '/fonts/Lato-Bold.ttf',
    },
    {
      family: 'Noto Emoji',
      weight: 400,
      style: 'normal',
      src: '/fonts/NotoColorEmoji.ttf',
    },
  ]);

  const fiber = useFiber();
  const inspect = useInspector();

  const view = useMemo(() => (
    <WebGPU
      fallback={(error: Error) => <HTML container={inner}>{FALLBACK_MESSAGE(error) as any}</HTML>}
    >
      <AutoCanvas
        selector={'#use-gpu .canvas'}
        samples={4}
      >
        <FontLoader fonts={fonts}>
          {router}
        </FontLoader>
      </AutoCanvas>
    </WebGPU>
  ), [root, fonts, router]);

  return (
    <UseInspect
      fiber={fiber}
      container={root}
      active={inspect}
      provider={DebugProvider}
    >
      {view}
    </UseInspect>
  )
};

// Toggle inspector with ctrl/cmd-I.
// Trigger re-render with ctrl/cmd-J.
const useInspector = () => {
  const [version, setVersion] = useState<number>(0);
  const [inspect, setInspect] = useState<boolean>(true);

  useResource((dispose) => {
    const keydown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'i') setInspect((s) => !s);
      if ((e.ctrlKey || e.metaKey) && e.key === 'j') setVersion((s) => s + 1);
    }

    window.addEventListener('keydown', keydown);
    dispose(() => window.addEventListener('keydown', keydown));
  });

  return inspect;
}
