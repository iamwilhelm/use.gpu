import { LiveComponent } from '@use-gpu/live/types';
import { CanvasRenderingContextGPU } from '@use-gpu/webgpu/types';
import { DataField, Emitter, ShaderLanguages, StorageSource, ViewUniforms, UniformAttribute, RenderPassMode } from '@use-gpu/core/types';

import { use, useMemo, useOne, useResource, useState } from '@use-gpu/live';

import {
  Draw, Pass, Viewport,
} from '@use-gpu/components';
import { Mesh } from '../mesh';
import { makeMesh } from '../meshes/mesh';

export type InteractPageProps = {
  _unused?: boolean,
};

export const InteractPage: LiveComponent<InteractPageProps> = (fiber) => (props) => {

  return (
    use(Viewport)({
      children:
        use(Draw)({
          children: use(Pass)({}),
        })
    })
  );
};
