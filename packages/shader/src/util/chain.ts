import { UniformAttribute, ShaderModule, ParsedBundle } from '../types';
import { loadVirtualModule } from '../util/shader';
import { getProgramHash } from '../util/hash';
import { toBundle, getBundleHash, getBundleKey } from '../util/bundle';
import { bundleToAttribute, toTypeString } from '../util/cast';
import { PREFIX_CHAIN } from '../constants';

const NO_SYMBOLS = [] as string[];

export type MakeChainAccessor = (
  type: string,
  name: string,
  args: string[],
  from: string,
  to: string,
) => string;

export const makeChainTo = (
  makeChainAccessor: MakeChainAccessor,
) => (
  from: ShaderModule,
  to: ShaderModule,
): ParsedBundle => {
  const fBundle = toBundle(from);
  const tBundle = toBundle(to);
  
  const {module: fromModule, virtuals: fromVirtuals} = fBundle;
  const {module: toModule, virtuals: toVirtuals} = tBundle;

  const {name: fromName, format: fromFormat, args: fromArgs} = bundleToAttribute(from);
  const {name: toName, format: toFormat, args: toArgs} = bundleToAttribute(to);

  const args = fromArgs?.map(a => toTypeString(a));
  const check = toArgs?.map(a => toTypeString(a));
  const type = toTypeString(toFormat);

  if (check?.length !== 1 || check[0] !== fromFormat) {
    throw new Error(`Cannot chain output ${fromFormat} of ${fromName} to args (${check?.join(', ')}) of ${toName}`);
  }

  const h1 = getBundleHash(fBundle);
  const h2 = getBundleHash(tBundle);

  const k1 = getBundleKey(fBundle);
  const k2 = getBundleKey(tBundle);

  const code    = `@chain [${fromName} ${toName}] [${h1}] [${h2}]`;
  const rehash  = getProgramHash(code);
  const rekey   = getProgramHash(`${code} ${k1} ${k2}`);
  const symbols = ['chain', 'from', 'to'];

  const namespace1 = `${PREFIX_CHAIN}${rehash.slice(0, 6)}_1`;
  const namespace2 = `${PREFIX_CHAIN}${rehash.slice(0, 6)}_2`;

  const modules = [
    {
      at: 0,
      symbols: NO_SYMBOLS,
      name: namespace1,
      imports: [{name: 'from', imported: fromName}],
    },
    {
      at: 0,
      symbols: NO_SYMBOLS,
      name: namespace2,
      imports: [{name: 'to', imported: toName}],
    },
  ];

  // Code generator
  const render = (namespace: string, rename: Map<string, string>) => {
    const name = rename.get('chain') ?? 'chain';
    const from = rename.get('from') ?? 'from';
    const to = rename.get('to') ?? 'to';
    return makeChainAccessor(type, name, args ?? [], from, to);
  }

  const chain = loadVirtualModule(
    { render },
    { symbols, modules },
    'chain',
    rehash,
    code,
    rekey,
  );

  const revirtuals = [];
  if (fromVirtuals) revirtuals.push(...fromVirtuals);
  if (toVirtuals) revirtuals.push(...toVirtuals);
  if (fromModule.virtual) revirtuals.push(fromModule);
  if (toModule.virtual) revirtuals.push(toModule);

  return {module: chain, libs: {
    [namespace1]: from,
    [namespace2]: to,
  }, virtuals: revirtuals};
}
