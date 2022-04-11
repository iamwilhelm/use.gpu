import { makeCastTo, parseSwizzle } from '../util/cast';

export { bundleToAttribute } from '../util/cast';

const arg = (x: number) => String.fromCharCode(97 + x);

export const makeCastAccessor = (
  name: string,
  accessor: string,
  args: string[],
  from: string,
  to: string,
  swizzle: string,
) => {
  const symbols = args.map((t, i) => `${arg(i)}`);

  const isScalar = !from.match(/vec</)

  let ret: string;
  if (typeof swizzle === 'string' && !isScalar && swizzle.match(/^[xyzw]+$/)) {
    ret = 'v.' + swizzle;
  }
  else {
    const terms = makeSwizzle(from, swizzle, 'v');
    ret = `${to}(${terms.join(', ')})`;
  }

  return `fn ${name}(${symbols.map((s, i) => `${s}: ${args[i]}`).join(', ')}) -> ${to} {
  let v = ${accessor}(${symbols.join(', ')});
  return ${ret};
}
`;
}

export const makeSwizzle = (
  from: string,
  swizzle: string,
  name: string,
) => {
  const terms = parseSwizzle(swizzle);

  const isFloat = from.match(/(^|<)f/);
  const isScalar = !from.match(/vec</)

  const literal = (v: number, neg: boolean) => {
    if (neg) v = -v;
    if (isFloat) return v.toString() + '.0';
    return Math.round(v).toString();
  };

  const out: string[] = terms.map(([v, neg]) => 
    typeof v === 'number' ? literal(v, neg) : 
    (neg ? '-' : '') + (isScalar ? `${name}` : `${name}.${v}`));

  return out;
}

export const castTo = makeCastTo(makeCastAccessor);
