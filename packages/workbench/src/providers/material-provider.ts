import type { ShaderModule } from '@use-gpu/shader';

import { makeContext, useContext } from '@use-gpu/live';
import { parseColor, useProp } from '@use-gpu/traits';
import { bindBundle } from '@use-gpu/shader/wgsl';

import { DEFAULT_LIGHT_CONTEXT } from '../providers/light-provider';

import { getDefaultPBRMaterial } from '@use-gpu/wgsl/material/pbr-default.wgsl';
import { applyPBRMaterial } from '@use-gpu/wgsl/material/pbr-apply.wgsl';

import { getShadedFragment } from '@use-gpu/wgsl/instance/fragment/shaded.wgsl';
import { getMaterialSurface } from '@use-gpu/wgsl/instance/surface/material.wgsl';

// Default PBR shader with built-in light
const getSurface = bindBundle(getMaterialSurface, {
  getMaterial: getDefaultPBRMaterial,
});
const getLight = bindBundle(getShadedFragment, {
  applyLights: DEFAULT_LIGHT_CONTEXT.bindMaterial(applyPBRMaterial),
});
export const DEFAULT_MATERIAL_CONTEXT = {
  shaded: {
    getSurface,
    getLight,
  },
};

export type MaterialContextProps = Record<string, Record<string, ShaderModule>>;

export const MaterialContext = makeContext<MaterialContextProps>(DEFAULT_MATERIAL_CONTEXT, 'MaterialContext');

export const useMaterialContext = () => useContext(MaterialContext);
