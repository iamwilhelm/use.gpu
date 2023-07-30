import type { LambdaSource, TextureSource, StorageSource } from '@use-gpu/core';

import { proxy } from '@use-gpu/core';
import { useOne } from '@use-gpu/live';

export const useDerivedSource = <T extends TextureSource | StorageSource | LambdaSource>(
  source: T,
  override: Record<string, any>,
): T => {
  return useOne(() => getDerivedSource(source, override), source);
};

export const getDerivedSource = <T extends TextureSource | StorageSource | LambdaSource>(
  source: T,
  override: Record<string, any>,
): T => {
  return proxy(source, override);
};

