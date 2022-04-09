import { ShaderSource } from '@use-gpu/shader/types';
import { useOne, useNoOne } from '@use-gpu/live';

export const useShaderRef = <T>(source?: ShaderSource, value?: T) => {
  if (source) {
    useNoOne();
    return source;
  }
  if (value?.current != null) {
    useNoOne();
    return value;
  }
  if (value == null) {
    useNoOne();
    return value;
  }
  const ref = useOne(() => ({current: value}));
  ref.current = value;
  return ref;
};
