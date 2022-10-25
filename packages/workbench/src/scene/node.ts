import type { LiveComponent, PropsWithChildren } from '@use-gpu/live';
import type { ObjectTrait } from './types';
import { memo, provide } from '@use-gpu/live';
import { mat4 } from 'gl-matrix';

import { useMatrixContext, MatrixContext } from '../providers/matrix-provider';

export type NodeProps = Partial<ObjectTrait> & {
  _?: number,
};

export const Node: LiveComponent<NodeProps> = (props: PropsWithChildren<NodeProps>) => {
  const parent = useMatrixContext();
  const {position: p, scale: s, quaternion: q, rotation: r, matrix: m} = useObjectTrait(props);

  const combined = useOne(() => {
    const matrix = mat4.create();

    if (m) {
      mat4.copy(matrix, m);
      if (p || r || q || s) {
        const t = mat4.create();
        composeTransform(t, p, r, q, s);
        mat4.multiply(matrix, matrix, t);
      }
    }
    else if (p || r || q || s) {
      composeTransform(matrix, p, r, q, s);
    }

    return matrix;
  }, [p, s, q, r, m]);

  return provide(MatrixContext, combined, children);
};
