import { makeChainTo } from '../../util/operators/chain';
import { bundleToAttribute } from '../shader';

const arg = (x: number) => String.fromCharCode(97 + x);

export const makeChainAccessor = (
  type: string,
  name: string,
  args: string[],
  from: string,
  to: string,
  rest: number = 0,
) => {
  const symbols = args.map((t, i) => `${arg(i)}`);
  const tail = rest != null ? symbols.slice(rest) : null;

  if (type === 'void') {
    return `fn ${name}(${symbols.map((s, i) => `${s}: ${args[i]}`).join(', ')}) {
  ${from}(${symbols.join(', ')});
  ${to}(${tail?.join(', ') ?? ''});
}
`;
  }

  return `fn ${name}(${symbols.map((s, i) => `${s}: ${args[i]}`).join(', ')}) -> ${type} {
  return ${to}(${from}(${symbols.join(', ')})${tail?.length ? ['', ...tail].join(', ') : ''});
}
`;
}

export const chainTo = makeChainTo(makeChainAccessor, bundleToAttribute);
