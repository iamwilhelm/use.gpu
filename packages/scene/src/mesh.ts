import type { LiveComponent, PropsWithChildren } from '@use-gpu/live';
import type { GPUGeometry } from '@use-gpu/core';
import type { ShaderSource } from '@use-gpu/shader';
import type { ObjectTrait } from './types';
import { memo, use, wrap, useOne } from '@use-gpu/live';

import { FaceLayer } from '@use-gpu/workbench';

import { Primitive } from './primitive';

export type MeshProps = {
  id?: number,
  geometry: GPUGeometry,
  shaded?: boolean,
  side?: 'front' | 'back' | 'both',
};

export const Mesh: LiveComponent<MeshProps> = memo((props: PropsWithChildren<MeshProps>) => {
  return (
    wrap(Primitive,
      use(FaceLayer, props)
    )
  );
}, 'Mesh');
