import { Tree } from '@lezer/common';
import { SymbolTable, ParsedModule, ParsedModuleCache, ParsedBundle } from '../types';
import { parseGLSL, defineGLSL, loadModule, loadModuleWithCache } from './shader';
import { rewriteUsingAST, resolveShakeOps } from './ast';
import { GLSL_VERSION } from '../constants';
import * as T from '../grammar/glsl.terms';
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

// Link a source module with static modules and dynamic links.
export const linkCode = timed('linkCode', (
  code: string,
  libraries: Record<string, string> = {},
  linkDefs: Record<string, string> = {},
  defines: Record<string, string> = {},
  cache: ParsedModuleCache | null = null,
) => {
  const main = loadModuleWithCache(code, 'main', cache);

  const parsedLibraries = mapValues(libraries, (code: string, name: string) => loadModuleWithCache(code, name, cache));
  const parsedLinkDefs = mapValues(linkDefs, (code: string, name: string) => loadModuleWithCache(code, name.split(':')[0], cache));

  return linkModule(main, parsedLibraries, parsedLinkDefs, defines);
});

// Link a bundle of parsed module + libs and dynamic links.
export const linkBundle = timed('linkBundle', (
  bundle: ParsedBundle,
  links: Record<string, ParsedBundle | ParsedModule> = {},
  defines: Record<string, string> = {},
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

// Link a parsed module with static modules and dynamic links.
export const linkModule = timed('linkModule', (
  main: ParsedModule,
  libraries: Record<string, ParsedModule> = {},
  linkDefs: Record<string, ParsedModule> = {},
  defines: Record<string, string> = {},
) => {
  const [links, aliases] = parseLinkAliases(linkDefs);
  const {modules, exported} = loadModules(main, libraries, links);

  const program = [`#version ${GLSL_VERSION}`, defineGLSL(defines)] as string[];

  const namespaces = new Map<string, string>();
  const used = new Set<string>();
  const exists = new Set<string>();
  const visible = new Set<string>();

  for (const module of modules) {
    const {name, code, tree, table, shake} = module;
    const {symbols, visibles, externals, modules} = table;

    // Namespace all global symbols
    const namespace = reserveNamespace(module, namespaces, used);
    const rename = new Map<string, string>();
    if (module !== main) {
      for (const name of symbols) {
        rename.set(name, namespace + name);
        exists.add(namespace + name);
      }
      for (const name of visibles) {
        visible.add(namespace + name);
      }
    }

    // Replace imported symbols with target
    for (const {name: module, imports} of modules) {
      const namespace = namespaces.get(module);
      for (const {name, imported} of imports) {
        const imp = namespace + imported;
        if (!exists.has(imp)) console.warn(`Import ${name} from '${module}' does not exist`);
        else if (!visible.has(imp)) console.warn(`Import ${name} from '${module}' is private`);
        rename.set(name, imp);
      }
    }

    // Replace imported function prototypes with target
    for (const {optional, prototype} of externals) if (prototype) {
      const {name} = prototype;
      const resolved = aliases.get(name) ?? name;
      const namespace = namespaces.get(name);
      if (namespace === undefined && optional) continue;

      const imp = namespace + resolved;

      if (!exists.has(imp)) console.warn(`Link ${name}:${resolved} does not exist`);
      else if (!visible.has(imp)) console.warn(`Link ${name}:${resolved} is private`);
      rename.set(name, imp);
    }

    // Shake tree based on which symbols were exported
    const keep = exported.get(name);
    const ops = shake && keep ? resolveShakeOps(shake, keep) : null;

    program.push(rewriteUsingAST(code, tree, rename, ops));
  }

  const result = program.join("\n");
  return result;
});

// Load all modules references from a piece of code
export const loadModules = timed('loadModules', (
  main: ParsedModule,
  libraries: Record<string, ParsedModule>,
  links: Record<string, ParsedModule>,
) => {
  const graph = new Map<string, string[]>();
  const seen = new Set<string>();
  const exported = new Map<string, Set<string>>();

  const out = [] as ParsedModule[];

  // Traverse graph starting from main
  const queue = [{name: main.name, module: main}];
  seen.add(main.name);

  while (queue.length) {
    const next = queue.shift()!;
    const {name, module} = next;
    if (module == null) throw new Error(`Shader module ${name} undefined`);

    out.push(module);

    const {table: {modules, externals}} = module;
    const deps = [] as string[];

    // Recurse into imports
    for (const {name, imports} of modules) {
      const isLink = name.match(/^#/);
      const module = isLink ? links[name] : libraries[name];
      if (!module) throw new Error(`Unknown module '${name}'`);

      if (!seen.has(name)) queue.push({name, module: {...module, name}});
      seen.add(name);
      deps.push(name);

      let list = exported.get(name);
      if (!list) exported.set(name, list = new Set());
      imports.forEach(i => list!.add(i.name));
    }

    // Recurse into links
    for (const {prototype, optional} of externals) if (prototype) {
      const {name} = prototype;
      const module = links[name];
      if (!module) {
        if (optional) continue;
        throw new Error(`Unlinked function '${name}'`);
      }

      if (!seen.has(name)) queue.push({name, module: {...module, name}});
      seen.add(name);
      deps.push(name);

      let list = exported.get(name);
      if (!list) exported.set(name, list = new Set());
      list.add(module.entry ?? name);
    }

    // Build module-to-module dependency graph
    graph.set(name, deps);
  }

  // Sort by graph depth
  const order = getGraphOrder(graph, main.name);
  out.sort((a, b) => order.get(b.name)! - order.get(a.name)! || a.name.localeCompare(b.name));

  return {
    modules: out,
    exported,
  };
});

// Get minimum depth for each module, so its symbols resolve correctly
export const getGraphOrder = (
  graph: Map<string, string[]>,
  name: string,
  depth: number = 0,
) => {
  const queue = [{name, depth: 0}];
  const depths = new Map<string, number>(); 
  while (queue.length) {
    const {name, depth} = queue.shift()!;
    depths.set(name, depth);

    const module = graph.get(name);
    if (!module) continue;

    const deps = module.map(name => ({name, depth: depth + 1}));
    queue.push(...deps);
  }
  return depths;
}

// Parse run-time specified keys `from:to` into a map of aliases
export const parseLinkAliases = (
  links: Record<string, ParsedModule>,
): [
  Record<string, ParsedModule>,
  Map<string, string>
] => {
  const out = {} as Record<string, ParsedModule>;
  const aliases = new Map<string, string>();
  for (let k in links) {
    const link = links[k];

    let [name, imported] = k.split(':');
    if (!imported && link.entry != null) imported = link.entry;
    out[name] = link;
    aliases.set(name, imported);
  }
  return [out, aliases];
}

// Parse bundle of imports into main + libs
export const parseBundle = (bundle: ParsedBundle): [ParsedModule, Record<string, ParsedModule>] => {
  const out = {} as Record<string, ParsedModule>;
  const traverse = (libs: Record<string, ParsedBundle>) => {
    for (let k in libs) {
      const bundle = libs[k];
      out[k] = bundle.module;
      traverse(bundle.libs);
    }
  };
  traverse(bundle.libs);

  let {module, entry} = bundle;
  if (bundle.entry != null) module = {...module, entry};
  return [module, out];
}

// Reserve a unique namespace based on truncated shader hash
export const reserveNamespace = (
  module: ParsedModule,
  namespaces: Map<string, string>,
  used: Set<string>,
) => {
  const {name, table: {hash}} = module;
  let namespace;
  let n = 2;

  do {
    namespace = '_' + hash.slice(0, n++) + '_';
  } while (used.has(namespace));

  namespaces.set(name, namespace);
  used.add(namespace);

  return namespace;
}
