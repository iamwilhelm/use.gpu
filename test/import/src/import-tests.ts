import { LiveComponent } from '@use-gpu/live/types';
import { TypedArray } from '@use-gpu/core/types';
import { GPUDeviceMount } from '@use-gpu/webgpu/types';
import { ParsedBundle, ParsedModule } from '@use-gpu/shader/types';

import { use, renderSync } from '@use-gpu/live';
import { uploadBuffer } from '@use-gpu/core';
import { mountGPUDevice } from '@use-gpu/webgpu';
import { WGSLLinker } from '@use-gpu/shader';
import { UseInspect } from '@use-gpu/inspect';
import { Draw, Pass, RawQuads } from '@use-gpu/workbench';

import WGSLLoader from '@use-gpu/wgsl-loader';
import { loadModule } from '@use-gpu/shader/wgsl';

import WGSLModules from '@use-gpu/wgsl';

import maskPoint from '@use-gpu/wgsl/mask/point.wgsl';
import { circle } from '@use-gpu/wgsl/mask/point.wgsl';
import instanceVertex from '@use-gpu/wgsl/instance/vertex/quad.wgsl';

type AppProps = {
  foo: number,
};

type NodeProps = {
  bar: number,
};

const testRender = () => {
  const App: LiveComponent<AppProps> = (props) => use(Node, {bar: props.foo});
  const Node: LiveComponent<NodeProps> = (props) => null;

  try {
    const root = renderSync(
      use(App, {foo: 1})
    );
    return root && root.id && root.bound && root.mount;
  } catch (e: any) {
    console.error(e);
    return false;
  }
}

const testWGSL = () => {
  if (!WGSLModules['instance/vertex/quad']) return [false, 'cannot find /quad in modules'];
  if (!(maskPoint.module && maskPoint.libs)) return [false, 'cannot find maskpoint'];
  if (!(circle.module && circle.libs)) return [false, 'cannot find circle module'];

  if (!isModule(instanceVertex.libs['@use-gpu/wgsl/use/view']?.module)) return [false, 'cannot find use/view'];
  if (!isModule(instanceVertex.libs['@use-gpu/wgsl/use/types']?.module)) return [false, 'cannot find use/types'];

  if (!isModule(loadModule(WGSLModules['instance/vertex/quad'], 'quad'))) return [false, 'cannot load /quad'];

  return [true];
}

const isModule = (module: any) => module?.name && module?.table && module?.tree;

if (!testRender()) {
  console.error('failed during render test');
  process.exit(1);
}

const [ok, error] = testWGSL();
if (!ok) {
  console.error('failed during wgsl test', error);
  process.exit(1);
}

