import { ParsedModule, ParsedBundle, CompressedNode, ShaderDefine, DataBinding } from '../types';

import { defineConstants, loadStaticModule, loadVirtualModule } from './shader';
import { compressAST, decompressAST } from './ast';
import { getProgramHash, makeKey } from '../util/hash';
import { makeBindingAccessors } from './gen';
import { parseBundle, toBundle, parseLinkAliases } from '../util/bundle';
import { PREFIX_CLOSURE, VIRTUAL_BINDGROUP } from '../constants';
import mapValues from 'lodash/mapValues';

const NO_SYMBOLS = [] as any[];

export const bindingsToLinks = (
  bindings: Record<string, DataBinding>,
  key: string | number = makeKey(),
): Record<string, ParsedBundle | ParsedModule> => {
  return makeBindingAccessors(Object.values(bindings), VIRTUAL_BINDGROUP, key);
}

export const bindBundle = (
  bundle: ParsedBundle | ParsedModule,
  linkDefs: Record<string, ParsedBundle | ParsedModule> = {},
  defines: Record<string, ShaderDefine> = {},
  key: string | number = makeKey(),
): ParsedBundle => {
  const {module, libs} = toBundle(bundle);
  return bindModule(module, libs, linkDefs, defines, key);
}

export const bindModule = (
  main: ParsedModule,
  libs: Record<string, ParsedBundle | ParsedModule> = {},
  linkDefs: Record<string, ParsedBundle | ParsedModule> = {},
  defines: Record<string, ShaderDefine> = {},
  key: string | number = makeKey(),
): ParsedBundle => {
  const [links, aliases] = parseLinkAliases(linkDefs);

  const {table} = main;
  const {hash, modules, externals} = table;

  const rehash = getProgramHash(`#closure ${hash} ${key.toString(16)}`);
  const namespace = `${PREFIX_CLOSURE}${rehash.slice(0, 6)}_`;

  const relinks: Record<string, ParsedBundle | ParsedModule> = {};
  const reexternals = [];
  const reimports = modules.slice();

  if (defines && Object.keys(defines).length) {
    const def = defineConstants(defines) + "\n";
    reimports.push({at: -1, symbols: NO_SYMBOLS, name: namespace, imports: NO_SYMBOLS});
    relinks[namespace] = loadStaticModule(def, 'def');
  }

  for (const external of externals) if (external.prototype) {
    const {flags, prototype} = external;
    const {name} = prototype;
    const resolved = aliases?.get(name) ?? name;

    if (links[name]) {
      const imp = namespace + name;
      relinks[imp] = {...links[name], entry: resolved};
      reimports.push({at: 0, symbols: NO_SYMBOLS, name: imp, imports: [{name, imported: resolved}]});
    }
    else {
      reexternals.push(external);
    }
  }

  const retable = {
    ...table,
    hash: rehash,
    modules: reimports,
    externals: reexternals,
  };

  return {
    module: {
      ...main,
      table: retable,
    },
    libs: {...libs, ...relinks},
  };
}
