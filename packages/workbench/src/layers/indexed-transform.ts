import type { LC, PropsWithChildren } from '@use-gpu/live';
import type { ShaderSource } from '@use-gpu/shader/wgsl';

import { provide } from '@use-gpu/live';
import { MatrixContext } from '../providers/matrix-provider';
import { TransformContext } from '../providers/transform-provider';
import { useMatrixTransformSources } from '../hooks/useMatrixTransform';
import { mat4 } from 'gl-matrix';

const NO_MAT4 = mat4.create();

export type IndexedTransformProps = PropsWithChildren<{
  matrices?: ShaderSource,
  normalMatrices?: ShaderSource,
}>;

export const IndexedTransform: FC<IndexedTransformProps> = (props: IndexedTransformProps) => {
  const {matrices, normalMatrices, children} = props;

  const transform = useMatrixTransformSources(matrices, normalMatrices);

  return (
    provide(MatrixContext, NO_MAT4,
      provide(TransformContext, transform, children)
    )
  );
};
