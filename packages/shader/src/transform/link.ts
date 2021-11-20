import { Tree } from '@lezer/common';
import { SymbolTable, ParsedModule, ParsedModuleCache } from '../types';
import { parseGLSL, defineGLSL } from './shader';
import { makeASTParser, rewriteUsingAST, compressAST, decompressAST, getProgramHash } from './ast';
import { GLSL_VERSION } from '../constants';
import * as T from '../grammar/glsl.terms';
import LRU from 'lru-cache';

const TIMED = false;

const timed = (name: string, f: any) => {
  if (!TIMED) return f;
  return (...args: any[]) => {
    const t = +new Date();
    const v = f(...args);
    console.log(name, (+new Date() - t).toFixed(2), 'ms');
    return v;
  }
}

export const makeModuleCache = (options: Record<string, any> = {}) => new LRU({
  max: 100,
  ...options,
});

export const parseLinkAliases = (links: Record<string, string>) => {
  const out = {} as Record<string, string>;
  const aliases = new Map<string, string>();
  for (let k in links) {
    const [name, imported] = k.split(':');
    out[name] = links[k];
    aliases.set(name, imported);
  }
  return [out, aliases];
}

export const linkModule = timed('linkModule', (
  code: string,
  libraries: Record<string, string> = {},
  linkDefs: Record<string, string> = {},
  defines: Record<string, string> = {},
  cache: ParsedModuleCache | null = null,
) => {
  const [links, aliases] = parseLinkAliases(linkDefs)
  const modules = loadModules(code, libraries, links, cache);

  const program = [`#version ${GLSL_VERSION}`, defineGLSL(defines)] as string[];

  const namespaces = new Map<string, string>();
  const used = new Set<string>();
  const exists = new Set<string>();
  const visible = new Set<string>();

  const unlinked = [];
  for (const module of modules) {
    const {name, code, tree, table} = module;
    const {symbols, visibles, externals, modules} = table;

    const namespace = reserveNamespace(module, namespaces, used);

    const rename = new Map<string, string>();
    if (name !== 'main') {
      for (const name of symbols) {
        rename.set(name, namespace + name);
        exists.add(namespace + name);
      }
      for (const name of visibles) {
        visible.add(namespace + name);
      }
    }

    for (const {name: module, imports} of modules) {
      const namespace = namespaces.get(module);
      for (const {name, imported} of imports) {
        const imp = namespace + imported;
        if (!exists.has(imp)) console.warn(`Import ${name} from '${module}' does not exist`);
        else if (!visible.has(imp)) console.warn(`Import ${name} from '${module}' is private`);
        rename.set(name, imp);
      }
    }

    for (const {prototype} of externals) if (prototype) {
      const {name} = prototype;
      const resolved = aliases.get(name) ?? name;
      const namespace = namespaces.get(name);
      const imp = namespace + resolved;

      if (!exists.has(imp)) console.warn(`Link ${name}:${resolved} does not exist`);
      else if (!visible.has(imp)) console.warn(`Link ${name}:${resolved} is private`);
      rename.set(name, imp);
    }

    program.push(rewriteUsingAST(code, tree, rename));
    unlinked.push(...externals);
  }

  for (const {prototype} of unlinked) if (prototype) {
    const {name} = prototype;
    const target = links[name];
    if (!target) throw new Error(`Unlinked function ${name}`);
  }

  const result = program.join("\n");
  return result;
})

export const loadModules = timed('loadModules', (
  code: string,
  libraries: Record<string, string>,
  links: Record<string, string>,
  cache: ParsedModuleCache | null = null,
) => {
  const graph = new Map<string, string[]>();
  const seen = new Set<string>();
  const out = [];

  const queue = [{name: 'main', code}];
  seen.add('main');

  while (queue.length) {
    const {name, code} = queue.shift()!;

    let tree, table;
    if (cache) {
      const hash = getProgramHash(code);
      const entry = cache.get(hash);
      if (entry) ({tree, table} = entry);
    }
    if (!tree || !table) {
      tree = parseGLSL(code);
      table = makeASTParser(code, tree).extractSymbolTable();
      if (cache) {
        tree = decompressAST(compressAST(tree));
        cache.set(table.hash, { tree, table });
      }
    }
    out.push({name, code, tree, table});

    const {modules, externals} = table;
    const deps = [] as string[];

    for (const {name} of modules) {
      const code = name.match(/^#/) ? links[name.slice(1)] : libraries[name];
      if (!code) throw new Error(`Unknown module '${name}'`);
      
      if (!seen.has(name)) queue.push({name, code});
      seen.add(name);
      deps.push(name);
    }

    for (const {prototype} of externals) if (prototype) {
      const {name} = prototype;
      const code = links[name];
      if (!code) throw new Error(`Unlinked function '${name}'`);
      
      if (!seen.has(name)) queue.push({name, code});
      seen.add(name);
      deps.push(name);
    }

    graph.set(name, deps);
  }

  const order = getGraphOrder(graph, 'main');
  out.sort((a, b) => order.get(b.name)! - order.get(a.name)! || a.name.localeCompare(b.name));

  return out;
});

export const getGraphOrder = (
  graph: Map<string, string[]>,
  name: string,
  depth: number = 0,
) => {
  const queue = [{name, depth: 0}] as string[];
  const depths = new Map<string, number>(); 
  while (queue.length) {
    const {name, depth} = queue.shift()!;
    depths.set(name, depth);

    const deps = graph.get(name).map(name => ({name, depth: depth + 1}));
    queue.push(...deps);
  }
  return depths;
}

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
