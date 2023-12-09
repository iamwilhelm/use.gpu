export const jsonEquals = (a: any, b: any) => a === b || JSON.stringify(a) === JSON.stringify(b);

export const deep = (...deep: string[]) => {
  const deepSet = new Set(deep);

  return (a: any, b: any) => {
    for (const k of deep) if (!jsonEquals(a[k], b[k])) return false;
    for (const k in b) if (!deepSet.has(k) && !a.hasOwnProperty(k)) return false;
    for (const k in a) if (!deepSet.has(k) && a[k] !== b[k]) return false;
    return true;
  };
};
