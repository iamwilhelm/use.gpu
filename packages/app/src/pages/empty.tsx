import { LiveComponent } from '@use-gpu/live/types';
import { CanvasRenderingContextGPU } from '@use-gpu/webgpu/types';
import { DataField, Emitter, ShaderLanguages, StorageSource, ViewUniforms, UniformAttribute, RenderPassMode } from '@use-gpu/core/types';

import { use, useMemo, useOne, useResource, useState } from '@use-gpu/live';

import {
  Loop, Draw, Pass,
  CompositeData, Data, RawData, Inline,
  OrbitCamera, OrbitControls,
  Pick, Cursor, Points, Lines,
  RawQuads as Quads, RawLines,
  RenderToTexture,
  Router, Routes,
} from '@use-gpu/components';
import { Mesh } from '../mesh';
import { makeMesh } from '../meshes/mesh';

export type EmptyPageProps = {
  _unused?: boolean,
};

export const EmptyPage: LiveComponent<EmptyPageProps> = (fiber) => (props) => {

  return (
    use(Draw)({
      children: use(Pass)({}),
    })
  );
};
