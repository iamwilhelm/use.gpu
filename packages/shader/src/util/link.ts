import { Tree } from '@lezer/common';
import { ParsedBundle, ParsedModule, ParsedModuleCache, ShaderDefine, ImportRef, RefFlags as RF } from '../types';
import { VIRTUAL_BINDGROUP } from '../constants';

import { parseBundle } from './bundle';
import { resolveShakeOps } from './shake';
import { timed } from './timed';
import mapValues from 'lodash/mapValues';

export type LinkModule = (
  main: ParsedModule,
  libraries?: Record<string, ParsedModule>,
  linkDefs?: Record<string, ParsedModule>,
  defines?: Record<string, ShaderDefine> | null,
) => string;

export type LoadModuleWithCache = (
  code: string,
  name: string,
  entry?: string,
  cache?: ParsedModuleCache | null,
) => ParsedModule;

export type GetPreambles = () => string[];

export type GetRenames = (
	defines?: Record<string, ShaderDefine> | null,
) => Map<string, string>;

export type DefineConstants = (
  defines: Record<string, ShaderDefine>
) => string;

export type RewriteUsingAST = (
  code: string,
  tree: Tree,
  rename: Map<string, string>,
  shake?: number[] | null,
) => string;

// Link a source module with static modules and dynamic links.
export const makeLinkCode = (
  loadModuleWithCache: LoadModuleWithCache,
  linkModule: LinkModule,
  defaultCache: ParsedModuleCache,
) => timed('linkCode', (
  code: string,
  libraries: Record<string, string> = {},
  links: Record<string, string> = {},
  defines: Record<string, ShaderDefine> | null | undefined,
  cache: ParsedModuleCache | null = defaultCache,
) => {
  const main = loadModuleWithCache(code, 'main', undefined, cache);

  const parsedLibraries = mapValues(libraries, (code: string, name: string) => loadModuleWithCache(code, name, undefined, cache));
  const parsedLinkDefs = mapValues(links, (code: string, name: string) => loadModuleWithCache(code, name.split(':')[0], undefined, cache));

  return linkModule(main, parsedLibraries, parsedLinkDefs, defines);
});

// Link a bundle of parsed module + libs, dynamic links
export const makeLinkBundle = (
  linkModule: LinkModule,
) => timed('linkBundle', (
  bundle: ParsedBundle,
  links: Record<string, ParsedBundle | ParsedModule> = {},
  defines: Record<string, ShaderDefine> | null | undefined,
) => {
  let [main, libs] = parseBundle(bundle);

  const linkDefs = mapValues(links, (bundle: ParsedBundle | ParsedModule, name: string) => {
    if ('table' in bundle) return bundle as any as ParsedModule;

    const [link, linkLibs] = parseBundle(bundle as any as ParsedBundle);
    libs = {...libs, ...linkLibs};
    return link;
  });

  return linkModule(main, libs, linkDefs, defines);
});

// Link a parsed module with static modules, dynamic links
export const makeLinkModule = (
  getPreambles: GetPreambles,
	getRenames: GetRenames,
  defineConstants: DefineConstants,
  rewriteUsingAST: RewriteUsingAST,
) => timed('linkModule', (
  main: ParsedModule,
  libraries: Record<string, ParsedModule> = {},
  linkDefs: Record<string, ParsedModule> = {},
  defines: Record<string, ShaderDefine> | null | undefined,
) => {
  if (typeof main === 'string') throw new Error("Module is a string instead of an object");

  const [links, aliases] = parseLinkAliases(linkDefs);
  const {modules, exported} = loadModulesInOrder(main, libraries, links, aliases);

  const program = getPreambles();
  if (defines) {
		const def = defineConstants(defines);
		if (def.length) program.push(def);
	}

  const renames = getRenames(defines);

  // Namespace by module name and module hash
  const namespaces = new Map<string, string>();
  const hashes = new Map<string, string>();

  // Track symbols in global namespace 
  const exists = new Set<string>();
  const visible = new Set<string>();
  const fixed = new Map<string, string>();

  for (const module of modules) {
    const {name, code, tree, table, shake, virtual} = module;
    const {hash, globals, symbols, visibles, externals, modules} = table;

    // Multiple links into same module with different name
    if (hashes.has(hash)) {
      namespaces.set(name, hashes.get(hash)!);
      continue;
    }

    // Namespace all non-global symbols outside main module
	  const rename = new Map(renames);
    if (module !== main) {
      const namespace = virtual?.namespace;
      const ns = reserveNamespace(module, namespaces, namespace);
      hashes.set(hash, ns);

      if (symbols) for (const name of symbols) rename.set(name, ns + name);
      if (globals) for (const name of globals) {
        rename.set(name, name);
        fixed.set(ns + name, name);
      }
      if (visibles) for (const name of visibles) visible.add(rename.get(name)!);
      for (const name of rename.values()) exists.add(name);
    }

    // Replace imported symbol names with target
    if (modules) for (const {name: module, imports} of modules) {
      const ns = namespaces.get(module);
      for (const {name, imported} of imports) {
        let imp = ns + imported;
        if (fixed.has(imp)) imp = fixed.get(imp)!;
        if (!exists.has(imp)) {
          console.warn(`Import ${name} from '${module}' does not exist`);
          debugger;
        }
        else if (!visible.has(imp)) console.warn(`Import ${name} from '${module}' is private`);
        rename.set(name, imp);
      }
    }

    // Replace imported function prototype names with target
    if (externals) for (const {flags, func} of externals) if (func) {
      const {name} = func;
      const resolved = aliases?.get(name) ?? name;
      const ns = namespaces.get(name);

      if ((ns === undefined) && (flags & RF.Optional)) continue;

      let imp = ns + resolved;
      if (fixed.has(imp)) imp = fixed.get(imp)!;
      if (!exists.has(imp)) console.warn(`Link ${name}:${resolved} does not exist`);
      else if (!visible.has(imp)) console.warn(`Link ${name}:${resolved} is private`);
      rename.set(name, imp);
    }

    if (virtual) {
      const {uniforms, bindings} = virtual;
      if (uniforms && bindings && (libraries[VIRTUAL_BINDGROUP] == null)) {
        const id = code.replace('#virtual ', '');
        throw new Error(`Virtual module ${id} has unresolved data bindings`);
      }

      // Emit virtual module in target namespace,
      // with dynamically assigned binding slots.
      const ns = hashes.get(hash)!;
      const recode = virtual.render(ns, rename, virtual.base);
      program.push(recode);
    }
    else if (tree) {
      // Shake tree ops based on which symbols were exported
      const keep = exported.get(hash);
      const ops = shake && keep ? resolveShakeOps(shake, keep) : null;

      // Rename symbols using AST while tree shaking
      const recode = rewriteUsingAST(code, tree, rename, ops);
      program.push(recode);
    }
    else {
      // Static include (defs)
      program.push(code);
    }
  }

  const code = program.join("\n");
  return code;
});

// Load all modules references from a piece of code,
// while gathering info about what's exported (for tree shaking).
export const loadModulesInOrder = timed('loadModules', (
  main: ParsedModule,
  libraries: Record<string, ParsedModule>,
  links: Record<string, ParsedModule>,
  aliases: Map<string, string> | null,
) => {
  const graph = new Map<string, string[]>();
  const seen = new Set<string>();
  const hoist = new Set<string>();
  const exported = new Map<string, Set<string>>();

  const out = [] as ParsedModule[];

  // Traverse graph starting from main
  const queue = [{name: main.name, module: main, context: main}];
  seen.add(main.name);

  const getContext = (m: ParsedModule) => {
    const {name, code} = m;
    if (name.match(/^_[A-Z]{2}_/) && code.match(/^#/)) return code.replace(/^#/, '');
    return name;
  }

  while (queue.length) {
    const next = queue.shift()!;
    const {name, module, context} = next;
    if (module == null) throw new Error(`Shader module ${name} undefined in ${getContext(context)}`);

    out.push(module);

    const {table: {modules, externals}} = module;
    const deps = [] as string[];

    // Recurse into imports
    if (modules) for (const {at, name, imports} of modules) {
      const isLink = name.match(/^#/);
      const module = isLink ? links[name] : libraries[name];
      if (!module) throw new Error(`Unknown module '${name}' in ${getContext(context)}`);

      if (!seen.has(name)) queue.push({name, module: {...module, name}, context: module});
      seen.add(name);
      deps.push(name);

      if (at < 0) hoist.add(name);

      const {table: {hash}} = module;
      let list = exported.get(hash);
      if (!list) exported.set(hash, list = new Set());
      imports.forEach((i: ImportRef) => list!.add(module.entry ?? i.name));
    }

    // Recurse into links
    if (externals) for (const {func, flags} of externals) if (func) {
      const {name} = func;
      const module = links[name];
      if (!module) {
        if (flags & RF.Optional) continue;
        throw new Error(`Unlinked function '${name}' in ${getContext(context)}`);
      }

      if (!seen.has(name)) queue.push({name, module: {...module, name}, context: module});
      seen.add(name);
      deps.push(name);

      const {table: {hash}} = module;
      let list = exported.get(hash);
      if (!list) exported.set(hash, list = new Set());
      list.add(module.entry ?? aliases?.get(name) ?? name);
    }

    // Build module-to-module dependency graph
    graph.set(name, deps);
  }

  // Sort by graph depth
  const order = getGraphOrder(graph, main.name);
  for (let [k, v] of order.entries()) if (hoist.has(k)) order.set(k, v + 1e5);
  out.sort((a, b) => order.get(b.name)! - order.get(a.name)! || a.name.localeCompare(b.name));

  return {
    modules: out,
    exported,
  };
});

// Generate a new namespace
export const reserveNamespace = (
  module: ParsedModule,
  namespaces: Map<string, string>,
  force?: string,
): string => {
  const {name, table: {hash}} = module;
  let namespace = force;
  let n = 2;

  if (force == null) {
    namespace = '_' + ('00' + namespaces.size.toString(36)).slice(-2) + '_';
  }

  namespaces.set(name, namespace!);

  return namespace!;
}

// Get depth for each item in a graph, so its dependencies resolve correctly
export const getGraphOrder = (
  graph: Map<string, string[]>,
  name: string,
  depth: number = 0,
) => {
  const queue = [{name, depth: 0, path: [name]}];
  const depths = new Map<string, number>();

  while (queue.length) {
    const {name, depth, path} = queue.shift()!;
    depths.set(name, depth);

    const module = graph.get(name);
    if (!module) continue;

    const deps = module.map(name => {
      const i = path.indexOf(name);
      if (i >= 0) throw new Error("Cycle detected in module dependency graph: " + path.slice(i));
      return {name, depth: depth + 1, path: [...path, name]};
    });

    queue.push(...deps);
  }
  return depths;
}

// Parse run-time specified keys `from:to` into a map of aliases
export const parseLinkAliases = <T>(
  links: Record<string, T>,
): [
  Record<string, T>,
  Map<string, string> | null,
] => {
  const out = {} as Record<string, T>;
  let aliases = null as Map<string, string> | null;

  for (let k in links) {
    const link = links[k] as any;
    if (!link) continue;

    let [name, imported] = k.split(':');
    if (!imported && link.entry != null) imported = link.entry;
    if (!imported && link.module?.entry != null) imported = link.module.entry;

    out[name] = link;
    if (imported) {
      if (!aliases) aliases = new Map<string, string>();
      aliases.set(name, imported);
    }
  }

  return [out, aliases];
}
