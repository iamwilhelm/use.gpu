import { LiveComponent, LiveElement } from '@use-gpu/live/types';

import { memo, provide, makeContext, useOne } from '@use-gpu/live';
import { ViewUniforms, UniformAttribute } from '@use-gpu/core/types';
import { VIEW_UNIFORMS, makeProjectionMatrix, makeOrbitMatrix } from '@use-gpu/core';

export const GLSLContext = makeContext(null, 'GLSLContext');

export type GLSLProviderProps = {
  compileGLSL: (s: string, t: string) => string,
};

export const GLSLProvider: LiveComponent<GLSLProviderProps> = memo((fiber) => (props) => {
  const {compileGLSL, children} = props;
  const value = useOne(() => ({compileGLSL}), compileGLSL);
  return provide(GLSLContext, value, children);
}, 'GLSLProvider');