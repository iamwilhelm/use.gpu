import GLSL from './glsl';

import { mountGPU } from '@use-gpu/webgpu';
import { defer, render } from '@use-gpu/live';

import { App } from './app';

const ROOT_SELECTOR = '#use-gpu';

export const main = async (): Promise<void> => {
  const compileGLSL = await GLSL();
  const {adapter, device, canvas} = await mountGPU(ROOT_SELECTOR);

  const root = await render(
    defer(App)({adapter, device, canvas, compileGLSL})
  );
  
  console.log({root})
}
