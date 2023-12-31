import type { ShaderModule } from '@use-gpu/shader';

import { makeContext, useContext } from '@use-gpu/live';
import { bindBundle } from '@use-gpu/shader/wgsl';

export type EnvironmentContextProps = ShaderModule | null;

export const EnvironmentContext = makeContext<EnvironmentContextProps>(null, 'EnvironmentContext');

export const useEnvironmentContext = () => useContext(EnvironmentContext);
