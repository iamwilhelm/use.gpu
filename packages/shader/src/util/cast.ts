import { UniformAttribute, ShaderModule, ParsedBundle } from '../types';
import { loadVirtualModule } from '../util/shader';
import { getProgramHash } from '../util/hash';
import { toBundle, getBundleHash, getBundleKey } from '../util/bundle';
import { PREFIX_CAST } from '../constants';

const NO_SYMBOLS = [] as string[];

type TypeLike = {
  name: string,
  type?: TypeLike,
  args?: TypeLike[],
};

export type CastTo = {
  basis: string,
  signs?: string,
  gain?: number,
};

export type MakeCastAccessor = (
  name: string,
  accessor: string,
  args: string[],
  from: string,
  to: string,
  swizzle: string | CastTo,
) => string;

export const toTypeString = (t: TypeLike | string): string => {
  if (typeof t === 'object') {
    if (t.type) return toTypeString(t.type);
    if (t.args) return `${t.name}<${t.args.map(t => toTypeString(t)).join(',')}>`;
    else return t.name;
  }
  return t;
}

const EXTERNALS = [{
  func: {name: 'getValue'},
  flags: 0,
}];

export const makeCastTo = (
  makeCastAccessor: MakeCastAccessor,
) => (
  source: ShaderModule,
  type: string,
  swizzle: string | CastTo,
): ParsedBundle => {
  const bundle = toBundle(source);

  const {module, virtuals} = bundle;
  const {name, format, args} = bundleToAttribute(bundle);

  const hash = getBundleHash(bundle);
  const key  = getBundleKey(bundle);

  const code   = `@cast [${name} ${format}] [${hash}]`;
  const rehash = getProgramHash(code);
  const rekey  = getProgramHash(`${code} ${key}`);

  const symbols = ['cast', 'getValue'];

  // Code generator
  const render = (namespace: string, rename: Map<string, string>) => {
    const name = rename.get('cast') ?? 'cast';
    const accessor = rename.get('getValue') ?? 'getValue';
    return makeCastAccessor(name, accessor, args ?? [], format, type, swizzle);
  }


  const cast = loadVirtualModule(
    { render },
    { symbols, externals: EXTERNALS },
    'cast',
    rehash,
    code,
    rekey,
  );

  const revirtuals = module.virtual
    ? (virtuals ? [...virtuals, module] : [module])
    : virtuals;

  return {module: cast, links: {getValue: bundle}, virtuals: revirtuals};
}

export const bundleToAttribute = (
  bundle: ShaderModule,
  name?: string,
): UniformAttribute => {
  // @ts-ignore
  const module = bundle.module ?? bundle;
  const {table: {declarations}} = module;

  const entry = bundle.entry ?? module.entry ?? name;

  for (const fn of declarations) if (fn.func) {
    const {func} = fn;
    const {type, name, parameters} = func;
    if (name === entry) {
      return {name, format: toTypeString(type), args: parameters};
    }
  }

  return {name: name ?? 'main', format: 'void', args: []};
}

export const parseSwizzle = (swizzle: string | CastTo) => {
  let c: CastTo;
  if (typeof swizzle === 'string') c = {basis: swizzle};
  else c = swizzle as CastTo;

  let {basis} = c;
  while (basis.length < 4) basis = basis + '0';

  return c;
}
