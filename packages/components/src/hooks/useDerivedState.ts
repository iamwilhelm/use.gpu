import { resolve } from '@use-gpu/core';
import { useOne, useState, useVersion } from '@use-gpu/live';

type Initial<T> = T | (() => T);

export const useDerivedState = <T>(initialState: Initial<T>, version: number = 0) => {
  const [value, setValue] = useState<T>(initialState);

  const newInitial = resolve(initialState);
  const v = useVersion(newInitial) + version;
  useOne(() => {
    setValue(newInitial);
  }, newInitial);

  return [value, setValue];
};
