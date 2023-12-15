import { Lazy } from './types';

export const resolve = <T>(x: Lazy<T>): T => {
  if (typeof x === 'function') return (x as any)();
  if (typeof x === 'object' && x != null) {
    if ('expr' in x) return x.expr();
    if ('current' in x) return x.current;
  }
  return x;
};

export const proxy = <T extends object>(target: T, override: Record<string, any>) => {
  return new Proxy(target, {
    get: (target, s) => {
      if (Object.hasOwn(override, s)) return resolve((override as any)[s]);
      return (target as any)[s];
    },
  }) as T;
};

export const lazy = <T extends object>(target: T, overrideRef: Lazy<Record<string, any>>) => {
  return new Proxy(target, {
    get: (target, s) => {
      const override = resolve(overrideRef);
      if (Object.hasOwn(override, s)) return resolve((override as any)[s]);
      return (target as any)[s];
    },
  }) as T;
};

export const pick = <A, B>(
  items: A[],
  accessor: (a: A) => B,
) => {
  return proxy(items, {
    get: (target, prop) => {
      if (typeof prop === 'number') return accessor(items[i]);
      return target[prop];
    },
  });
};

