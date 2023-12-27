import type { LC, PropsWithChildren } from '@use-gpu/live';
import type { ShaderModule } from '@use-gpu/shader';

import { makeContext, useContext, useNoContext } from '@use-gpu/live';
import { useShader } from '../hooks/useShader';
import { useShaderRefs } from '../hooks/useShaderRef';

export type ScissorContextProps = ShaderModule;

export const ScissorContext = makeContext<ScissorContextProps>(null, 'ScissorContext');

export const useScissorContext = () => useContext<ScissorContextProps | null>(ScissorContext);
export const useNoScissorContext = () => useNoContext(ScissorContext);
