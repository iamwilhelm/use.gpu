import { ArrowFunction } from '@use-gpu/live/types';
import { useOne } from '@use-gpu/live';

type PropDefTypes<T extends Record<string, ArrowFunction>> = {
  [P in keyof T]?: ReturnType<T[P]>;
};

type UseTrait<I, O> = (props: Partial<I>) => O;

export const makeUseTrait = <
  T extends Record<string, any>,
  P extends PropDef = any,
>(
  propDef: P,
  defaultValues: Record<string, any>
): UseTrait<T, PropDefTypes<P>> => {
  const defaults: Record<string, any> = {};
  for (const k in defaultValues) defaults[k] = propDef[k](defaultValues[k]);
  return (props: Partial<T>) => useTrait(props, propDef, defaults);
};

const useTrait = <
  T extends Record<string, any>,
  P extends PropDef = any,
>(
  props: Partial<T>,
  propDef: P,
  defaults: Record<string, any>,
): PropDefTypes<P> => {
  const parsed: Record<string, any> = useOne(() => ({}));

  for (let k in propDef) {
    const v = props[k];
    parsed[k] = useProp(v, propDef[k], defaults ? defaults[k] : undefined);
  }

  return parsed as T;
};