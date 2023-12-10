import type { MemoCompare } from './types';

export const shouldEqual = (spec: Record<string, MemoCompare>) => {
  const custom = new Set(Object.keys(spec));

  return (a: any, b: any) => {
    for (const k in spec) if (!spec[k](a[k], b[k])) return false;
    for (const k in b) if (!custom.has(k) && !a.hasOwnProperty(k)) return false;
    for (const k in a) if (!custom.has(k) && a[k] !== b[k]) return false;
    return true;
  };
};

export const sameArray = (a: any, b: any) => {
  const isA = 'length' in a;
  const isB = 'length' in b;

  if (isA && isB) {
    const an = a.length;
    const bn = b.length;

    if (an !== bn) return false;
    for (let i = 0; i < an; ++i) if (a[i] !== b[i]) return false;
    return true;
  }

  return a === b;
};

export const sameObject = (a: any, b: any) => {
  const isA = typeof a === 'object' && !!a;
  const isB = typeof b === 'object' && !!b;

  if (isA && isB) {
    for (const k in b) if (!a.hasOwnProperty(k)) return false;
    for (const k in a) if (a[k] !== b[k]) return false;
  }

  return a === b;
};

export const sameAny = (a: any, b: any) => sameArray(a, b) || sameObject(a, b);

export const sameJson = (a: any, b: any) => a === b || JSON.stringify(a) === JSON.stringify(b);
