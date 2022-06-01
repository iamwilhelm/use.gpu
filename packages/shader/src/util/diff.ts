import { UniformAttribute, ShaderModule, ParsedBundle } from '../types';
import { loadVirtualModule } from './shader';
import { getHash } from './hash';
import { toBundle, getBundleHash, getBundleKey } from './bundle';
import { PREFIX_CAST } from '../constants';

const NO_SYMBOLS = [] as string[];

export type BundleToAttribute = (
  bundle: ShaderModule,
) => UniformAttribute;

export type MakeDiffAccessor = (
  name: string,
  accessor: string,
  args: string[],
  type: string,
  offsets: (number | string)[],
) => string;

const EXTERNALS = [{
  func: {name: 'getValue'},
  flags: 0,
}];

export const makeDiffBy = (
  makeDiffAccessor: MakeDiffAccessor,
  bundleToAttribute: BundleToAttribute,
) => (
  source: ShaderModule,
  offset: null | number | string | (null | number | string)[],
  size: null | ShaderModule | (null | ShaderModule)[],
): ParsedBundle => {
  const bundle = toBundle(source);

  const {module, virtuals} = bundle;
  const {name, format, args} = bundleToAttribute(bundle);

  const entry = 'diff';

  const hash = getBundleHash(bundle);
  const key  = getBundleKey(bundle);

  const offsets = Array.isArray(offset) ? offset : [offset];
  const sizes   = Array.isArray(size) ? size : [size];

  const symbols = [entry, 'getValue'];
  const getSizes = sizes.map((s, i) => `getSize${i}`);
  symbols.push(...getSizes);

  const code   = `@diff [${getSizes.join(' ')}] [${hash}]`;
  const rehash = getHash(code);
  const rekey  = getHash(`${rehash} ${key}`);

  const externals = [
    ...EXTERNALS,
    ...getSizes.map(getSize => ({func: {name: getSize}, flags: 0})),
  ];
  const links = {
    getValue: bundle,
  };
  getSizes.forEach((getSize, i) => links[getSize] = sizes[i]);

  // Code generator
  const render = (namespace: string, rename: Map<string, string>) => {
    const name = rename.get(entry) ?? 'entry';
    const accessor = rename.get('getValue') ?? 'getValue';
    const sizes = getSizes.map(getSize => rename.get(getSize) ?? getSize);
    return makeDiffAccessor(name, accessor, sizes, args ?? [], format, offsets);
  }

  const diff = loadVirtualModule(
    { render },
    { symbols, externals },
    entry,
    rehash,
    code,
    rekey,
  );

  const revirtuals = module.virtual
    ? (virtuals ? [...virtuals, module] : [module])
    : virtuals;
  for (const m of sizes) if (m.virtual) revirtuals.push(m);

  return {
    module: diff,
    links,
    virtuals: revirtuals,
  };
}
