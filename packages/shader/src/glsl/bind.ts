import { ParsedModule, ParsedBundle, ShaderModule, CompressedNode, ShaderDefine, DataBinding, UniformAttribute } from '../types';

import { defineConstants, loadStaticModule, loadVirtualModule } from './shader';
import { compressAST, decompressAST } from './ast';
import { getProgramHash, makeKey } from '../util/hash';
import { makeBindingAccessors, makeUniformBlock } from './gen';
import { parseBundle, toBundle, parseLinkAliases, forBundleModules } from '../util/bundle';
import { PREFIX_CLOSURE, PREFIX_VIRTUAL, VIRTUAL_BINDGROUP } from '../constants';
import mapValues from 'lodash/mapValues';

const TIMED = false;

const timed = (name: string, f: any) => {
  if (!TIMED) return f;
  return (...args: any[]) => {
    const t = +new Date();
    const v = f(...args);
    console.log(name, (+new Date() - t), 'ms');
    return v;
  }
}

const NO_SYMBOLS = [] as any[];

export const bindingToModule = (
  binding: DataBinding,
): ShaderModule => {
  const {uniform: {name}} = binding;
  const links = makeBindingAccessors([binding], VIRTUAL_BINDGROUP);
  const module = links[name];
  return {...module, entry: name};
}

export const bindingsToLinks = (
  bindings: DataBinding[],
): Record<string, ShaderModule> => {
  return makeBindingAccessors(bindings, VIRTUAL_BINDGROUP);
}

export const bindBundle = timed('bindBundle', (
  bundle: ShaderModule,
  linkDefs: Record<string, ShaderModule> = {},
  defines?: Record<string, ShaderDefine> | null,
  key: string | number = makeKey(),
): ParsedBundle => {
  const {module, libs} = toBundle(bundle);
  return bindModule(module, libs, linkDefs, defines, key);
});

export const bindModule = timed('bindModule', (
  main: ParsedModule,
  libs: Record<string, ShaderModule> = {},
  linkDefs: Record<string, ShaderModule> = {},
  defines?: Record<string, ShaderDefine> | null,
  key: string | number = makeKey(),
): ParsedBundle => {
  const [links, aliases] = parseLinkAliases(linkDefs);

  const {name, table} = main;
  const {hash, modules, externals} = table;

  const rehash = getProgramHash(`#closure [${name}] ${hash} ${key.toString(16)}`);
  const namespace = `${PREFIX_CLOSURE}${rehash.slice(0, 6)}_`;

  const relinks: Record<string, ShaderModule> = {};
  const reexternals = [];
  const reimports = modules?.slice() ?? [];

  if (defines && Object.keys(defines).length) {
    const def = defineConstants(defines) + "\n";
    reimports.push({at: -1, symbols: NO_SYMBOLS, name: namespace, imports: NO_SYMBOLS});
    relinks[namespace] = loadStaticModule(def, 'def');
  }

  if (externals) for (const external of externals) if (external.prototype) {
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
});

export const resolveBindings = timed('resolveBindings', (
  modules: ShaderModule[],
): {
  modules: ShaderModule[],
  uniforms: DataBinding[],
  bindings: DataBinding[],
} => {
  const allUniforms = [] as DataBinding[];
  const allBindings = [] as DataBinding[];

  const seen = new Set();

  // Gather all namespaced uniforms and bindings from all programs.
  // Assign base offset to each virtual module in-place.
  let base = 0;
  for (const m of modules) {
    forBundleModules(m, (m: ParsedModule) => {
      const {virtual} = m;
      if (virtual) {
        const {table: {hash}} = m;
        if (seen.has(hash)) return;
        seen.add(hash);

        const {uniforms, bindings} = virtual;
        const namespace = `${PREFIX_VIRTUAL}${base}_`;
        if (uniforms) for (const u of uniforms) allUniforms.push(namespaceBinding(namespace, u));
        if (bindings) for (const b of bindings) allBindings.push(b);

        // Mutate virtual modules as they are ephemeral
        virtual.namespace = namespace;
        virtual.base = base;
        base += allBindings.length;
      }
    });
  }

  // Create combined uniform block as top-level import
  const code = makeUniformBlock(allUniforms, VIRTUAL_BINDGROUP, allBindings.length);
  const lib = loadStaticModule(code, VIRTUAL_BINDGROUP);
  const imported = {at: -1, symbols: NO_SYMBOLS, name: VIRTUAL_BINDGROUP, imports: NO_SYMBOLS};

  // Append to modules
  const out = modules.map((m: ShaderModule) => {
    const {module, libs} = toBundle(m);
    const {table} = module;
    const {modules} = table;

    const retable = {
      ...table,
      modules: modules ? [...modules, imported] : [imported],
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
});

export const namespaceBinding = (namespace: string, binding: DataBinding) => {
  const {uniform} = binding;
  const {name} = uniform;
  const imp = namespace + name;
  return {...binding, uniform: {...uniform, name: imp}};
};
