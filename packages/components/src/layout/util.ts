export const parseDimension = (x: string | number, total: number): number => {
  if (typeof x === 'number') return x;

  const s = x as string;
  if (s[s.length - 1] === '%') {
    return +s.slice(0, -1) / 100 * total;
  }

  return +s;
}