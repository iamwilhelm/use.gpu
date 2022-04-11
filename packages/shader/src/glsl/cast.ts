import { makeCastTo } from '../util/cast';

export { bundleToAttribute } from '../util/cast';

const arg = (x: number) => String.fromCharCode(97 + x);

export const makeCastAccessor = (
  name: string,
  accessor: string,
  args: string[],
  from: string,
  to: string,
  swizzle: string | string[],
) => {
  const symbols = args.map((t, i) => `${arg(i)}`);

  let ret: string;
  if (typeof swizzle === 'string') ret = 'v.' + swizzle;
  else ret = `${to}(${swizzle.join(', ')})`;

  return `${to} ${name}(${symbols.map((s, i) => `${args[i]} ${s}`).join(', ')}) {
  ${to} v = ${accessor}(${symbols.join(', ')});
  return ${ret};
}
`;
}

export const castTo = makeCastTo(makeCastAccessor);
