import type { Lazy } from '@use-gpu/core';
import type { ShaderSource } from '@use-gpu/shader';
import { useOne, useNoOne } from '@use-gpu/live';

export const useShaderRef = <T>(value?: T, source?: ShaderSource) => {
  if (source) {
    useNoOne();
    return source;
  }
  if ((value as any)?.current != null) {
    useNoOne();
    return value;
  }
  if (value == null) {
    useNoOne();
    return value;
  }
  if (typeof value === 'function') {
    useNoOne();
    return value;
  }
  const ref = useOne(() => ({current: value}));
  ref.current = value;
  return ref;
};

export const useShaderRefs = <T>(...values: (Lazy<T> | T)[]): Lazy<T>[] => {
  let i = 0;

  const refs = useOne(() => values.map((current: T) => 
    typeof current === 'function' ? current :
    current.current != null ? current :
    {current}
  ), values.length);
  for (const ref of refs) ref.current = values[i++];

  return refs;
};
