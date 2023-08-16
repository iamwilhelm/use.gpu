import type { ShaderModule } from '@use-gpu/shader';

import { makeContext, useContext } from '@use-gpu/live';
import { parseColor, useProp } from '@use-gpu/traits';
import { bindBundle } from '@use-gpu/shader/wgsl';

import { DEFAULT_LIGHT_CONTEXT } from '../providers/light-provider';

import { getPassThruColor } from '@use-gpu/wgsl/mask/passthru.wgsl';

import { applyPBRMaterial } from '@use-gpu/wgsl/material/pbr-apply.wgsl';
import { applyPBREnvironment } from '@use-gpu/wgsl/material/pbr-environment.wgsl';
import { getDefaultEnvironment } from '@use-gpu/wgsl/material/lights-default-env.wgsl';
import { getDefaultPBRMaterial } from '@use-gpu/wgsl/material/pbr-default.wgsl';

import { getLitFragment } from '@use-gpu/wgsl/instance/fragment/lit.wgsl';
import { getMaterialSurface } from '@use-gpu/wgsl/instance/surface/material.wgsl';

// Default PBR shader with built-in light
const getSurface = bindBundle(getMaterialSurface, {
  getMaterial: getDefaultPBRMaterial,
});
const getLight = bindBundle(getLitFragment, {
  applyLights: DEFAULT_LIGHT_CONTEXT.bindMaterial(applyPBRMaterial),
  applyEnvironment: bindBundle(applyPBREnvironment, {
    sampleEnvironment: getDefaultEnvironment,
  }),
});
export const DEFAULT_MATERIAL_CONTEXT = {
  solid: {
    getFragment: getPassThruColor,
  },
  shaded: {
    getSurface,
    getLight,
  },
};

export type MaterialContextProps = Record<string, Record<string, ShaderModule | null | undefined>>;

export const MaterialContext = makeContext<MaterialContextProps>(DEFAULT_MATERIAL_CONTEXT, 'MaterialContext');

export const useMaterialContext = () => useContext(MaterialContext);
