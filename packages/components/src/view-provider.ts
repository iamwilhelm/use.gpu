import { LiveComponent, LiveElement } from '@use-gpu/live/types';

import { memo, provide, makeContext, useMemo } from '@use-gpu/live';
import { ViewUniforms, UniformAttribute } from '@use-gpu/core/types';
import { VIEW_UNIFORMS, makeProjectionMatrix, makeOrbitMatrix } from '@use-gpu/core';

export const ViewContext = makeContext(null, 'ViewContext');

export type ViewProviderProps = {
  defs: UniformAttribute[],
  uniforms: ViewUniforms,
  children: LiveElement<any>[],
};

export const ViewProvider: LiveComponent<ViewProviderProps> = memo((fiber) => (props) => {
  const {defs, uniforms, children} = props;
  const context = useMemo(() => ({defs, uniforms}), [defs, uniforms]);
  return provide(ViewContext, context, children);
}, 'ViewProvider');