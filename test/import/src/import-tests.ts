import { LiveComponent } from '@use-gpu/live/types';
import { TypedArray } from '@use-gpu/core/types';
import { CanvasRenderingContextGPU } from '@use-gpu/webgpu/types';
import { ParsedBundle, ParsedModule } from '@use-gpu/shader/types';

import { use, renderSync } from '@use-gpu/live';
import { uploadBuffer } from '@use-gpu/core';
import { mountGPU } from '@use-gpu/webgpu';
import { GLSLLinker } from '@use-gpu/shader';
import { UseInspect } from '@use-gpu/inspect';
import { Draw } from '@use-gpu/components';

import GLSLLoader from '@use-gpu/glsl-loader';
import { loadModule } from '@use-gpu/shader/glsl';

import GLSLModules from '@use-gpu/glsl';

import maskPoint from '@use-gpu/glsl/mask/point.glsl';
import { circle } from '@use-gpu/glsl/mask/point.glsl';

type AppProps = {
  foo: number,
};

type NodeProps = {
  bar: number,
};

const testRender = () => {
  const App: LiveComponent<AppProps> = () => (props) => use(Node)({bar: props.foo});
  const Node: LiveComponent<NodeProps> = () => (props) => null;

  try {

    const root = renderSync(
      use(App)({foo: 1})
    );
    return root && root.id && root.bound && root.mount;
  } catch (e: any) {
    console.error(e);
    return false;
  }
}

const testGLSL = () => {
  if (!GLSLModules['instance/vertex/quad']) return false;
  if (!(maskPoint.module && maskPoint.libs)) return false;
  if (!(circle.module && circle.libs)) return false;

  if (!isModule(loadModule(GLSLModules['instance/vertex/quad'], 'quad'))) return false;

  return true;
}

const isModule = (module: any) => module.name && module.table && module.tree;

if (!testRender() || !testGLSL()) process.exit(1);
