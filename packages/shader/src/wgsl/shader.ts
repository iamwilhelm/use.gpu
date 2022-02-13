import { Tree, SyntaxNode } from '@lezer/common';
import { ParsedModule, ParsedModuleCache, ShaderDefine, SymbolTable, VirtualTable } from './types';

import { makeASTParser, compressAST } from './ast';
import { decompressAST } from '../util/tree';
import { getProgramHash } from '../util/hash';
import { parser } from './grammar/wgsl';
import LRU from 'lru-cache';

export { loadStaticModule, loadVirtualModule } from '../util/shader';

const EMPTY_LIST = [] as any[];
const EMPTY_TABLE = {} as any;

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

  const astParser = makeASTParser(code, tree);
  const table = astParser.getSymbolTable();
  const shake = astParser.getShakeTable(table);

  if (compressed) tree = decompressAST(compressAST(code, tree));

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

// Parse WGSL using lezer grammar
export const parseShader = (code: string): Tree => parser.parse(code);

// Make WGSL definitions
export const defineConstants = (defs: Record<string, ShaderDefine>): string => {
  const out = [];
  for (let k in defs) if (defs[k] !== false && defs[k] !== null) out.push(`let ${k} = ${defs[k]};`);
  return out.join("\n");
}

// Make shader languages interface
export const makeLanguage = (cache?: any) => ({
  compile: (code: string) => code,
  cache: cache ?? makeModuleCache(),
});

// LRU cache for parsed shader code
export const makeModuleCache = (options: Record<string, any> = {}) => new LRU<string, ParsedModule>({
  max: 100,
  ...options,
});

export const DEFAULT_CACHE = makeModuleCache();
