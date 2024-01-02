import type { LC, PropsWithChildren } from '@use-gpu/live';
import type { ShaderSource } from '@use-gpu/shader/wgsl';

import { provide, extend } from '@use-gpu/live';
import { MatrixContext } from '../providers/matrix-provider';
import { TransformContext } from '../providers/transform-provider';
import { useMatrixTransformSources } from '../hooks/useMatrixTransform';
import { useCombinedTransform } from '../hooks/useCombinedTransform';
import { mat4 } from 'gl-matrix';

const NO_MAT4 = mat4.create();

export type IndexedTransformProps = PropsWithChildren<{
  matrices?: ShaderSource,
  normalMatrices?: ShaderSource,
  immediate?: boolean,
}>;

export const IndexedTransform: FC<IndexedTransformProps> = (props: IndexedTransformProps) => {
  const {matrices, normalMatrices, immediate, children} = props;

  const transform = useMatrixTransformSources(matrices, normalMatrices);
  const context = useCombinedTransform(transform);

  return immediate ? (
    extend(children, {transform: context})
  ) : (
    provide(MatrixContext, NO_MAT4,
      provide(TransformContext, transform, children)
    )
  );
};
