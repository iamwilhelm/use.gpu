export const parseDimension = (x: string | number, total: number): number => {
  if (typeof x === 'number') return x;

  const s = x as string;
  if (s[s.length - 1] === '%') {
    return +s.slice(0, -1) / 100 * total;
  }

  return +s;
}

export const parseAlignment = (x: string | number): number => {
  const isStart = (x === 'start');
  const isEnd = (x === 'end');

  const align = isStart ? 0 : isEnd ? 1 : 0.5;
  return align;
}