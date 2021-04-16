import GLSL from './glsl';

import { mountGPU } from '../canvas/mount';
import { defer } from '../live/live';
import { render } from '../live/tree';

import { App } from './app';

const ROOT_SELECTOR = '#use-gpu';

export const main = async () => {
  const compileGLSL = await GLSL();
  const {adapter, device, canvas} = await mountGPU(ROOT_SELECTOR);

  const root = await render(
    defer(App)({adapter, device, canvas, compileGLSL})
  );
  
  console.log({root})
}
