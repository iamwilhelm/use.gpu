import { ShaderModule, ParsedBundle, UniformAttribute, RefFlags as RF } from '../../types';
import { loadVirtualModule } from '../shader';
import { toMurmur53, scrambleBits53, mixBits53 } from '../hash';
import { toBundle, getBundleHash, getBundleKey } from '../bundle';

export type BundleToAttribute = (
  bundle: ShaderModule,
) => UniformAttribute;

export type MakeIndexedAccessor = (
  ns: string,
  name: string,
  args: string,
  fields: UniformAttribute[],
  valueAccessors: string[],
  indexAccessor: string,
) => string;

const INDEX_ENTRY = 'getIndex';
const INDEX_LINK = 'getIndexed';
const INDEX_SYMBOLS = [INDEX_ENTRY, INDEX_LINK];
const INDEX_EXTERNALS = [{
  func: {name: INDEX_LINK},
  flags: RF.External,
}];

const makeDeclarations = (name: string, type: any, parameters: any) => [{
  func: {name, type, parameters},
  flags: RF.Exported,
}] as any[];

export const makeIndexWith = (
  makeIndexedAccessor: MakeIndexedAccessor,
  bundleToAttribute: BundleToAttribute,
) => (
  values: Record<string, ShaderModule>,
  indices: ShaderModule,
): ParsedBundle => {

  const iBundle = toBundle(indices);
  const {module: iModule, virtuals: iVirtuals} = iBundle;
  const i = bundleToAttribute(iBundle);

  const fields: UniformAttribute[] = [];

  let hash = getBundleHash(iBundle);
  let key = getBundleKey(iBundle);
  
  const symbols = [...INDEX_SYMBOLS];
  const externals = [...INDEX_EXTERNALS];
  const links: Record<string, ParsedBundle> = {[INDEX_LINK]: iBundle};
  const revirtuals = [];
  if (iVirtuals) revirtuals.push(...iVirtuals);
  if (iModule.virtual) revirtuals.push(iModule);

  const keys = Object.keys(values);
  for (const k in values) {
    const value = values[k];
    const vBundle = toBundle(value);
    const {module: vModule, virtuals: vVirtuals} = vBundle;
    const v = bundleToAttribute(vBundle);

    const f = i.format.entry ?? i.format;
    if (v.args?.[0] !== f) {
      throw new Error(`Type Error: ${i.name} -> ${v.name}.\nCannot chain output ${f} to args (${v.args?.join(', ')}).`);
    }

    hash = mixBits53(hash, getBundleHash(vBundle));
    key  = mixBits53(key, getBundleKey(vBundle));

    fields.push(v);
    symbols.push(v.name);
    externals.push({
      func: {name: v.name},
      flags: RF.External,
    });
    links[v.name] = vBundle;
    if (vVirtuals) revirtuals.push(...vVirtuals);
    if (vModule.virtual) revirtuals.push(vModule);
  }

  const entry = INDEX_ENTRY;
  const arg = i.args?.[0] ?? 'u32';

  const code   = `@indexed [${i.name} / ${fields.map(f => f.name).join(' ')}]`;
  const rehash = scrambleBits53(mixBits53(toMurmur53(code), hash));
  const rekey  = scrambleBits53(mixBits53(rehash, key));

  const render = (namespace: string, rename: Map<string, string>) => {
    const name = rename.get(entry) ?? entry;

    const valueAccessors = fields.map(f => rename.get(f.name) ?? f.name);
    const indexAccessor = rename.get(INDEX_LINK) ?? INDEX_LINK;

    return makeIndexedAccessor(
      namespace,
      name,
      arg,
      fields,
      valueAccessors,
      indexAccessor,
    );
  }
  
  const exports = makeDeclarations(entry, 'never', [arg]);

  const indexed = loadVirtualModule(
    { render },
    { symbols, exports, externals },
    entry,
    rehash,
    code,
    rekey,
  );

  return {
    module: indexed,
    links,
    virtuals: revirtuals,
  };
};
