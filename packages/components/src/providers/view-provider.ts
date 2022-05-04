import { LiveComponent, LiveElement } from '@use-gpu/live/types';

import { memo, provide, makeContext, useMemo } from '@use-gpu/live';
import { ViewUniforms, UniformAttribute } from '@use-gpu/core/types';

export const ViewContext = makeContext<ViewContextProps>({
  viewUniforms: {none: {current: 0}},
  viewDefs: [{format: 'i32', name: 'none'}],
} as any as ViewContextProps, 'ViewContext');

export type ViewContextProps = {
  viewUniforms: ViewUniforms,
  viewDefs: UniformAttribute[],
};

export type ViewProviderProps = {
  defs: UniformAttribute[],
  uniforms: ViewUniforms,
  children?: LiveElement<any>,
};

export const ViewProvider: LiveComponent<ViewProviderProps> = memo((props: ViewProviderProps) => {
  const {defs: viewDefs, uniforms: viewUniforms, children} = props;
  const context = useMemo(() => ({viewDefs, viewUniforms}), [viewDefs, viewUniforms]);
  return provide(ViewContext, context, children);
}, 'ViewProvider');