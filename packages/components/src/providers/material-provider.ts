import { LC, PropsWithChildren } from '@use-gpu/live/types';
import { TextureSource } from '@use-gpu/core/types';
import { ShaderModule } from '@use-gpu/shader/types';

import { provide } from '@use-gpu/live';
import { useProp } from '../traits/useProp';
import { ColorLike } from '../traits/types';
import { parseColor } from '../traits/parse';
import { makeContext, useContext } from '@use-gpu/live';
import { bundleToAttributes } from '@use-gpu/shader/wgsl';

import { useBoundShader } from '../hooks/useBoundShader';
import { useShaderRef } from '../hooks/useShaderRef';
import { applyPBRMaterial } from '@use-gpu/wgsl/material/pbr.wgsl';

export const MaterialContext = makeContext<ShaderModule>(applyPBRMaterial, 'MaterialContext');

export const useMaterialContext = () => useContext(MaterialContext);

type MaterialProps = {
  material: ShaderModule,
};

const PBR_BINDINGS = bundleToAttributes(applyPBRMaterial);

type PBRMaterialProps = {
  albedo: ColorLike,
  metalness: number,
  roughness: number,

  albedoMap: TextureSource,
  metalnessMap: TextureSource,
  roughnessMap: TextureSource,
};

export const PBRMaterial: LC<PBRMaterialProps> = (props: PropsWithChildren<PBRMaterialProps>) => {
  const {
    metalness = 0.2,
    roughness = 0.8,
    
    albedoMap,
    metalnessMap,
    roughnessMap,

    children,
  } = props;

  const albedo = useProp(props.albedo, parseColor);

  const a = useShaderRef(albedo, albedoMap);
  const m = useShaderRef(metalness, metalnessMap);
  const r = useShaderRef(roughness, roughnessMap);

  const applyMaterial = useBoundShader(applyPBRMaterial, PBR_BINDINGS, [a, m, r]);

  return provide(MaterialContext, applyMaterial, children);
}