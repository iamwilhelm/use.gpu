import GLSL from './glsl';

import { mountGPU } from '@use-gpu/webgpu';
import { use, render, formatTree } from '@use-gpu/live';

import { App } from './app';

const ROOT_SELECTOR = '#use-gpu';

export const main = async (): Promise<void> => {
  const compileGLSL = await GLSL();
  const {adapter, device, canvas} = await mountGPU(ROOT_SELECTOR);

  debugger;

  const root = await render(
    use(App)({adapter, device, canvas, compileGLSL})
  );
  
  // @ts-ignore
  const log = () => console.log(formatTree(root))
  setTimeout(() => log(), 2000);
}
