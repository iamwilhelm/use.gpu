import { useCallback, useOne } from '@use-gpu/live';

export const useDoubleBuffered = <T>(make: () => T) => {
  const ref = useOne(() => ({
    front: make(),
    back: make(),
    flip: false,
  }));

  return useCallback(() => {
    const f = ref.flip = !ref.flip;
    return f ? ref.front : ref.back;
  });
};
