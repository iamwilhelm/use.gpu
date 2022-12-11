import type { ShaderSource } from '@use-gpu/shader';
import type { Ref } from '@use-gpu/live';
import type { Lazy } from '@use-gpu/core';

import { useOne, useNoOne } from '@use-gpu/live';

export const useShaderRef = <T>(
  value?: T,
  source?: ShaderSource,
): ShaderSource | (() => T) | Ref<T> | null => {
  if (source) {
    useNoOne();
    return source;
  }
  if (value == null) {
    useNoOne();
    return null;
  }
  if ((value as any)?.current != null) {
    useNoOne();
    return value as any as Ref<T>;
  }
  if (typeof value === 'function') {
    useNoOne();
    return value as any as (() => T);
  }

  const ref = useOne(() => ({current: value}));
  ref.current = value;
  return ref;
};

export const useNoShaderRef = useNoOne;

export const useShaderRefs = <T>(...values: (Lazy<T>)[]): (Ref<T> | (() => T))[] => {
  let i = 0;

  const refs = useOne(() => values.map((current: any) => 
    typeof current === 'function' ? current :
    current.current != null ? current :
    {current}
  ), values.length);
  for (const ref of refs) ref.current = values[i++];

  return refs;
};
