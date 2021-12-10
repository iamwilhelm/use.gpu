import { ParsedModule, ParsedBundle, ShaderModule, CompressedNode, ShaderDefine, DataBinding } from '../types';

import { defineConstants, loadStaticModule, loadVirtualModule } from './shader';
import { compressAST, decompressAST } from './ast';
import { getProgramHash, makeKey } from '../util/hash';
import { makeBindingAccessors, makeUniformBlock } from './gen';
import { parseBundle, toBundle, parseLinkAliases, forBundleModules } from '../util/bundle';
import { PREFIX_CLOSURE, VIRTUAL_BINDGROUP } from '../constants';
import mapValues from 'lodash/mapValues';

const NO_SYMBOLS = [] as any[];

export const bindingsToLinks = (
  bindings: Record<string, DataBinding>,
  key: string | number = makeKey(),
): Record<string, ShaderModule> => {
  return makeBindingAccessors(Object.values(bindings), VIRTUAL_BINDGROUP, key);
}

export const bindBundle = (
  bundle: ShaderModule,
  linkDefs: Record<string, ShaderModule> = {},
  defines: Record<string, ShaderDefine> = {},
  key: string | number = makeKey(),
): ParsedBundle => {
  const [module, libs] = parseBundle(bundle);

  return bindModule(module, libs, linkDefs, defines, key);
}

export const bindModule = (
  main: ParsedModule,
  libs: Record<string, ShaderModule> = {},
  linkDefs: Record<string, ShaderModule> = {},
  defines: Record<string, ShaderDefine> = {},
  key: string | number = makeKey(),
): ParsedBundle => {
  const [links, aliases] = parseLinkAliases(linkDefs);

  const {table} = main;
  const {hash, modules, externals} = table;

  const rehash = getProgramHash(`#closure ${hash} ${key.toString(16)}`);
  const namespace = `${PREFIX_CLOSURE}${rehash.slice(0, 6)}_`;

  const relinks: Record<string, ShaderModule> = {};
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

    if (links[name]) {
      const link = links[name] as any;
      const entry = link.module?.entry ?? link.entry;
      const resolved = entry ?? aliases?.get(name) ?? name;

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

export const resolveBindings = (
  modules: ShaderModule[],
): {
  modules: ShaderModule[],
  uniforms: DataBinding[],
  bindings: DataBinding[],
} => {
  const allUniforms = [] as DataBinding[];
  const allBindings = [] as DataBinding[];

  const seen = new Set();
  const bases = new Map<string, number>();

  let base = 0;
  for (const m of modules) {
    forBundleModules(m, (m: ParsedModule) => {
      const {table: {hash}, virtual, namespace} = m;
      if (virtual) {
        if (seen.has(hash)) return;
        seen.add(hash);

        const {uniforms, bindings} = virtual;
        const ns = namespace ?? '';
        for (const u of uniforms) allUniforms.push(namespaceBinding(ns, u));
        for (const b of bindings) allBindings.push(b);

        bases.set(hash, base);
        base += allBindings.length;
      }
    });
  }

  const code = makeUniformBlock(allUniforms, VIRTUAL_BINDGROUP, allBindings.length);
  const lib = loadStaticModule(code, VIRTUAL_BINDGROUP);
  const imported = {at: -1, symbols: NO_SYMBOLS, name: VIRTUAL_BINDGROUP, imports: NO_SYMBOLS};

  const out = modules.map((m: ShaderModule) => {
    const {module, libs} = toBundle(m);
    const {table} = module;
    const {modules} = table;

    const retable = {
      ...table,
      modules: [...modules, imported],
    };

    return {
      module: {
        ...module,
        table: retable,
      },
      libs: {
        ...libs,
        [VIRTUAL_BINDGROUP]: lib,
      },
    };
  });

  return {
    modules: out,
    uniforms: allUniforms,
    bindings: allBindings,
  };
}

export const namespaceBinding = (namespace: string, binding: DataBinding) => {
  const {uniform} = binding;
  const {name} = uniform;
  const imp = namespace + name;
  return {...binding, uniform: {...uniform, name: imp}};
};
