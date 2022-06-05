import { LambdaSource, StorageSource, Lazy } from '@use-gpu/core/types';
import { ShaderModule } from '@use-gpu/shader/types';
import { ArrowFunction } from '@use-gpu/live/types';

import { resolve } from '@use-gpu/core';
import { useMemo } from '@use-gpu/live';

type InputSource = LambdaSource | StorageSource;
type GetProps = {
  length?: Lazy<number>,
  size?: Lazy<number[]>,
};

export const useDerivedSource = (shader: ShaderModule, getProps: GetProps) => {
  return useMemo(() =>
    new Proxy({
      shader,
    }, {
      get: (target, s) => {
        if (s === 'length') {
          if (getProps.length) return resolve(getProps.length);
          if (getProps.size) return resolve(getProps.size).reduce((a, b) => a * b, 1);
          return 0;
        }
        if (s === 'size') {
          if (getProps.size) return resolve(getProps.size);
          if (getProps.length) return [resolve(getProps.length)];
          return [0];
        }
        return (target as any)[s];
      },
    }) as LambdaSource
  , [shader, getProps]);
}
