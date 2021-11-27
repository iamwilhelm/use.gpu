import { ShaderLanguages, ShaderLib } from '@use-gpu/core/types';
import { UniformDefinition, UniformAttribute } from './types';
import { makeBoundStorageAccessors, makeBoundShader } from '@use-gpu/core';
import { linkCode as link } from '@use-gpu/shader';
import partition from 'lodash/partition';

import { useMemo, useOne } from '@use-gpu/live';

export const useBoundStorage = (
  uniforms: UniformDefinition[],
  dataBindings: ResolvedDataBindings,
  base: number = 0,
) => {
  const {links, constants} = dataBindings;

  // Storage only needs to change if arrangement of links vs constants changes.
  const storageKeys = Object.keys(links);
  const memoKey = useMemo(() => Math.random(), storageKeys);

  return useOne(() => makeBoundStorageAccessors(uniforms, dataBindings, base), memoKey);
};
