import { LiveComponent, LiveElement } from '@use-gpu/live/types';

import { memo, provide, makeContext, useMemo } from '@use-gpu/live';
import { ViewUniforms, UniformAttribute } from '@use-gpu/core/types';
import { VIEW_UNIFORMS, makeProjectionMatrix, makeOrbitMatrix } from '@use-gpu/core';

export const RenderContext = () => makeContext();

export type RenderProviderProps = {
  renderContext: CanvasRendering
  children: LiveElement<any>[],
};

export const RenderProvider: LiveComponent<RenderProviderProps> = memo((fiber) => (props) => {
  const {renderContext, children} = props;
  useMemo(() => console.log('renderContext changed'), [renderContext]);
  return provide(RenderContext, renderContext, children);
}, 'RenderProvider');