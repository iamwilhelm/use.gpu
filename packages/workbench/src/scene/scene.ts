import type { LiveComponent, PropsWithChildren } from '@use-gpu/live';
import type { ObjectTrait } from './types';
import { memo, provide, useOne } from '@use-gpu/live';
import { mat4 } from 'gl-matrix';

import { useMatrixContext, useNoMatrixContext, MatrixContext } from '../providers/matrix-provider';

export type SceneProps = {
  inherit?: boolean,
};

export const Scene: LiveComponent<SceneProps> = (props: PropsWithChildren<SceneProps>) => {
  const {
    inherit = false,
    children,
  } = props;

  const parent = inherit ? useMatrixContext() : useNoMatrixContext();
  const combined = useOne(() => parent ?? mat4.create(), parent);
  
  return provide(MatrixContext, combined, children);
};
