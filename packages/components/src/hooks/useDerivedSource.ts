import { LambdaSource, StorageSource } from '@use-gpu/shader/wgsl/types';
import { ShaderModule } from '@use-gpu/shader/wgsl/types';

import { useMemo } from '@use-gpu/live';

type InputSource = LambdaSource | StorageSource;
type GetProps = {
  length: (source: InputSource) => number,
  size: (source: InputSource) => number[],
};

export const useDerivedSource = (shader: ShaderModule, getProps: GetProps) => {
  return useMemo(() =>
    new Proxy({
      shader,
    }, {
      get: (target, s) => {
        if (s === 'length') return getProps.length();
        if (s === 'size') return getProps.size();
        return target[s];
      },
    }) as LambdaSource
  , [shader, getProps]);
}
