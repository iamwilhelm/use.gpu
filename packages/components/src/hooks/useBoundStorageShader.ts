import { ShaderLanguages, ShaderLib } from '@use-gpu/core/types';
import { UniformDefinition, UniformAttribute } from './types';
import { makeBoundStorageShader } from '@use-gpu/core';
import { linkModule as link } from '@use-gpu/shader';
import partition from 'lodash/partition';

import { useMemo, useOne } from '@use-gpu/live';
import { checkStorageType } from './storage';

export const useBoundStorageShader = (
  vertexShader: string,
  fragmentShader: string,
  uniforms: UniformDefinition[],
  dataBindings: ResolvedDataBindings,
  codeBindings: ShaderLib,
  defines: Record<string, string>,
  languages: ShaderLanguages,
  deps: any[] | null = null,
  base: number = 0,
) => {
  const {glsl: {compile, modules, cache}} = languages;
  const {links, constants} = dataBindings;

  // Shader only needs to change if arrangement of links vs constants changes.
  const storageKeys = Object.keys(links);
  const memoKey = useMemo(() => Math.random(), deps ? [...storageKeys, ...deps] : storageKeys);

  return useOne(() => {
    return makeBoundStorageShader(
      vertexShader,
      fragmentShader,
      uniforms,
      dataBindings,
      codeBindings,
      defines,
      compile,
      link,
      modules,
      cache,
      base,
    );
  }, memoKey);
};
