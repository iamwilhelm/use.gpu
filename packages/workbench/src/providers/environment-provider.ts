import type { ShaderModule } from '@use-gpu/shader';

import { makeContext, useContext } from '@use-gpu/live';
import { bindBundle } from '@use-gpu/shader/wgsl';

import { getDefaultEnvironment } from '@use-gpu/wgsl/material/lights-default-env.wgsl';
import { SH_DIFFUSE, SH_SPECULAR } from '@use-gpu/wgsl/material/env/park.wgsl';

const defaultEnvironment = bindBundle(getDefaultEnvironment, { SH_DIFFUSE, SH_SPECULAR });

export type EnvironmentContextProps = ShaderModule | null;

export const EnvironmentContext = makeContext<EnvironmentContextProps>(defaultEnvironment, 'EnvironmentContext');

export const useEnvironmentContext = () => useContext(EnvironmentContext);
