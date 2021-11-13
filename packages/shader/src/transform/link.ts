import { Tree } from '@lezer/common';
import { SymbolTable } from '../types';
import { parseGLSL } from './shader';
import { makeASTParser } from './ast';
import * as T from '../grammar/glsl.terms';

type Program = {
  entry: null,
  code: string[],
};

type Module = {
  name: string,
  code: string,
  tree: Tree,
  table: SymbolTable,
};

export const makeProgram = () => ({});

export const linkModule = (code: string, library: Record<string, string>) => {

  const modules = loadModules(code, library);
  const namespaces = new Map<string, string>();
  const program = [] as string[];

  for (const module of modules) {
    const {name, code, tree, table} = module;
    const {hash, symbols, modules} = table;

    const namespace = '_' + table.hash.slice(0, 4) + '_';
    namespaces.set(name, namespace);

    const rename = new Map<string, string>();
    if (name !== 'main') {
      for (const {name} of symbols) {
        rename.set(name, namespace + name);
      }
    }
    
    for (const {name, imports} of modules) {
      const namespace = namespaces.get(name);
      for (const {name, imported} of imports) {
        rename.set(name, namespace + imported);
      }
    }
    
    program.push(rewriteAST(code, tree, rename));
  }

  return program.join("\n");
}

export const rewriteAST = (code: string, tree: Tree, rename: Map<string, string>) => {
  let out = '';
  let pos = 0;

  const passthrough = (from: number, to: number, replace?: string) => {
    out = out + code.slice(pos, from);
    pos = to;

    if (replace != null) out = out + replace;
  }

  let cursor = tree.cursor();
  do {
    const {type, from, to} = cursor;
    if (type.id === T.Identifier) {
      const name = code.slice(from, to);
      const replace = rename.get(name);

      if (replace) passthrough(from, to, replace);      
    }
  } while (cursor.next());

  const n = code.length;
  passthrough(n, n);

  return out;
}

export const loadModules = (code: string, library: Record<string, string>) => {
  const seen = new Map<string, number>();
  const out = [];

  const queue = [{name: 'main', code, depth: 0}];
  seen.set('main', 0);

  while (queue.length) {
    const {name, code, depth} = queue.shift()!;

    const tree = parseGLSL(code);
    const table = makeASTParser(code, tree).extractSymbolTable();

    out.push({name, code, tree, table});

    const {modules} = table;
    for (const {name} of modules) {      
      const code = library[name];
      if (!code) throw new Error(`Unknown module '${name}'`);
      
      if (!seen.has(name)) queue.push({name, code, depth: depth + 1});
      seen.set(name, depth + 1);
    }
  }

  out.sort((a, b) => seen.get(b.name)! - seen.get(a.name)! || a.name.localeCompare(b.name));

  return out;
}
