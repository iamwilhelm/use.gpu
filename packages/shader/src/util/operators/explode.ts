import { ShaderModule, ParsedBundle, UniformAttribute, RefFlags as RF } from '../../types';
import { loadVirtualModule } from '../shader';
import { toMurmur53, scrambleBits53, mixBits53 } from '../hash';
import { toBundle, getBundleEntry, getBundleHash, getBundleKey, getBundleName } from '../bundle';

export type BundleToAttribute = (
  bundle: ShaderModule,
) => UniformAttribute;

export type MakeExplodeAccessor = (
  ns: string,
  name: string,
  arg: string,
  source: string,
  fields: UniformAttribute[],
) => string;

const STRUCT_LINK = 'T';
const SOURCE_LINK = 'structStorage';

const EXPLODE_EXTERNALS = [{
  struct: {name: STRUCT_LINK},
  flags: RF.External,
}, {
  variable: {name: SOURCE_LINK},
  flags: RF.External,
}];

const makeDeclaration = (name: string, type: any, parameters: any) => ({
  func: {name, type, parameters},
  flags: RF.Exported,
}) as any;

export const makeExplode = (
  makeExplodeAccessor: MakeExplodeAccessor,
  bundleToAttribute: BundleToAttribute,
) => (
  struct: ShaderModule,
  source: ShaderModule,
): ParsedBundle => {

  const tBundle = toBundle(struct);
  const sBundle = toBundle(source);

  const {module: tModule, virtuals: tVirtuals} = tBundle;
  const {module: sModule, virtuals: sVirtuals} = sBundle;

  const {format: fields} = bundleToAttribute(tBundle);

  const entry = getBundleEntry(source);
  if (!Array.isArray(fields)) throw new Error(`Cannot explode non-struct type '${entry}: ${fields}' of ${getBundleName(bundle)}`);
  if (tVirtuals?.length) throw new Error(`Cannot explode virtual '${entry}' of ${getBundleName(bundle)}`);

  let hash = getBundleHash(tBundle) ^ getBundleHash(sBundle);
  let key = getBundleKey(tBundle) ^ getBundleKey(sBundle);

  const symbols = fields.map(({name}) => name);

  const links: Record<string, ParsedBundle> = {[STRUCT_LINK]: tBundle, [SOURCE_LINK]: sBundle};
  const revirtuals = [];
  if (sVirtuals?.length) revirtuals.push(...sVirtuals);
  if (tModule.virtual) revirtuals.push(tModule);
  if (sModule.virtual) revirtuals.push(sModule);

  const externals = EXPLODE_EXTERNALS;
  const args = source.args ?? ['u32'];
  if (args.length > 1) throw new Error(`Cannot explode getter for more than 1 index arg`);

  const code   = `@explode [${tModule.name}] [${sModule.name}]`;
  const rehash = scrambleBits53(mixBits53(toMurmur53(code), hash));
  const rekey  = scrambleBits53(mixBits53(rehash, key));

  const render = (namespace: string, rename: Map<string, string>) => {
    const name = rename.get(entry) ?? entry;
    const source = rename.get(SOURCE_LINK) ?? SOURCE_LINK;

    return makeExplodeAccessor(
      namespace,
      name,
      args[0],
      source,
      fields,
    );
  }
  
  const exports = fields.map(({name, format}) => makeDeclaration(name, format, args));

  const exploded = loadVirtualModule(
    { render },
    { symbols, exports, externals },
    null,
    rehash,
    code,
    rekey,
  );

  return {
    module: exploded,
    links,
    virtuals: revirtuals,
  };
};
