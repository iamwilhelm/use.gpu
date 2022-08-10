import type { StorageSource } from '@use-gpu/core';

import { resolve } from '@use-gpu/core';
import { useOne } from '@use-gpu/live';

export const useDerivedSource = (
  source: StorageSource,
  override: Record<string, any>,
) => {
  return useOne(() => getDerivedSource(source, override), source);
};

export const getDerivedSource = (
  source: StorageSource,
  override: Record<string, any>,
) => {
  return new Proxy(source, {
    get: (target, s) => {
      if (Object.hasOwn(override, s)) return resolve((override as any)[s]);
      return (target as any)[s];
    },
  }) as StorageSource;
};
