import { ShaderModule } from '@use-gpu/shader/wgsl/types';
import { makeContext, useContext } from '@use-gpu/live';

const DEFAULT_TRANSFORM = {
  range: [[-1, 1], [-1, 1], [-1, 1], [-1, 1]],
  swizzle: 'xyzw',
	transform: null,
};

export const TransformContext = makeContext<TransformContextProps>(DEFAULT_TRANSFORM, 'TransformContext');

export const useTransformContext = () => useContext<TransformContextProps>(TransformContext);
