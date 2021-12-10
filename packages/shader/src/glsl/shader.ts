import { ParsedModule, ParsedModuleCache, ShaderDefine, ShaderCompiler, VirtualTable } from '../types';
import { Tree, SyntaxNode } from '@lezer/common';

import { makeASTParser, compressAST, decompressAST } from './ast';
import { getProgramHash, makeKey } from '../util/hash';
import { parser } from '../grammar/glsl';
import { PREFIX_VIRTUAL } from '../constants';
import LRU from 'lru-cache';

const EMPTY_LIST = [] as any[];

// Parse a code module into its in-memory representation
// (AST + symbol table)
export const loadModule = (
  code: string,
  name: string,
  entry?: string,
  compressed: boolean = false,
): ParsedModule => {
  if (code == null) throw new Error(`Shader code ${name} undefined`);
  if (typeof code !== 'string') throw new Error(`Shader code ${name} is not a string`);
  let tree = parseShader(code);

  const parser = makeASTParser(code, tree);
  const table = parser.getSymbolTable();
  const shake = parser.getShakeTable(table);

  if (compressed) tree = decompressAST(compressAST(tree));

  return {name, code, table, entry, shake, tree};
}

// Use cache to load modules
export const loadModuleWithCache = (
  code: string,
  name: string,
  entry?: string,
  cache: ParsedModuleCache | null = DEFAULT_CACHE,
): ParsedModule => {
  if (!cache) return loadModule(code, name, entry, true);

  const hash = getProgramHash(code);
  const cached = cache.get(hash);
  if (cached) return {...cached, entry};
  
  const module = loadModule(code, name, entry, true);
  cache.set(hash, module);
  return {...module, entry};
}

// Load a static (inert) module
export const loadStaticModule = (code: string, name: string, entry?: string) => {
  const table = {
    hash: getProgramHash(code),
    symbols: EMPTY_LIST,
    visibles: EMPTY_LIST,
    globals: EMPTY_LIST,
    externals: EMPTY_LIST,
    modules: EMPTY_LIST,
    functions: EMPTY_LIST,
    declarations: EMPTY_LIST,
  };
  const tree = decompressAST(EMPTY_LIST);
  return { name, code, tree, table, entry };
}

// Load a virtual (generated) module
export const loadVirtualModule = (
  virtual: VirtualTable,
  symbols: string[],
  key: string | number = makeKey(),
) => {
  const code = `#virtual ${symbols.join(' ')} ${key}`;

  const hash = getProgramHash(code);
  const name = `${PREFIX_VIRTUAL}${hash.slice(0, 6)}_`;
  const namespace = `${PREFIX_VIRTUAL}${hash.slice(0, 2)}_`;

  const table = {
    hash,
    symbols,
    visibles: symbols,
    globals: EMPTY_LIST,
    externals: EMPTY_LIST,
    modules: EMPTY_LIST,
    functions: EMPTY_LIST,
    declarations: EMPTY_LIST,
  };
  const tree = decompressAST(EMPTY_LIST);
  return { name, code, tree, table, virtual, namespace };
}

// Parse GLSL using lezer grammar
export const parseShader = (code: string): Tree => parser.parse(code);

// Make GLSL definitions
export const defineConstants = (defs: Record<string, ShaderDefine>): string => {
  const out = [];
  for (let k in defs) if (defs[k] !== false && defs[k] !== null) out.push(`#define ${k} ${defs[k]}`);
  return out.join("\n");
}

// Make shader languages interface
export const makeLanguage = (compile: any, cache?: any) => ({
  compile: (code: string, stage: any) => (compile as any)(code, stage, false),
  cache: cache ?? makeModuleCache(),
});

// LRU cache for parsed shader code
export const makeModuleCache = (options: Record<string, any> = {}) => new LRU<string, ParsedModule>({
  max: 100,
  ...options,
});

export const DEFAULT_CACHE = makeModuleCache();
