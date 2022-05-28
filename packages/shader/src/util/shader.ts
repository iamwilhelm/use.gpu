import { Tree } from '@lezer/common';
import { ASTParser, VirtualTable, SymbolTable, ParsedModule, ParsedModuleCache, CompressedNode } from '../types';
import { getHash, makeKey } from './hash';
import { decompressAST } from './tree';
import { PREFIX_VIRTUAL } from '../constants';

const EMPTY_LIST = [] as any[];
const EMPTY_TABLE = {} as any;

// Parse a code module into its in-memory representation
// (AST + symbol table)
export const makeLoadModule = <T extends SymbolTable = any>(
  parseShader: (code: string) => Tree,
  makeASTParser: (code: string, tree: Tree, name?: string) => ASTParser<T>,
  compressAST: (code: string, tree: Tree) => CompressedNode[],
) => (
  code: string,
  name: string = 'main',
  entry?: string,
  compressed: boolean = false,
): ParsedModule => {
  if (code == null) throw new Error(`Shader code ${name} undefined`);
  if (typeof code !== 'string') throw new Error(`Shader code ${name} is not a string`);
  let tree = parseShader(code);

  const astParser = makeASTParser(code, tree, name);
  const table = astParser.getSymbolTable();
  const shake = astParser.getShakeTable(table);

  if (entry == null && table.symbols?.includes('main')) entry = 'main';

  if (compressed) tree = decompressAST(compressAST(code, tree));

  const hash = getHash(code);

  return {name, code, hash, table, entry, shake, tree};
}

// Use cache to load modules
export const makeLoadModuleWithCache = (
  loadModule: (code: string, name: string, entry?: string, compressed?: boolean) => ParsedModule,
  defaultCache: ParsedModuleCache,
) => (
  code: string,
  name: string,
  entry?: string,
  cache: ParsedModuleCache | null = defaultCache,
): ParsedModule => {
  if (!cache) return loadModule(code, name, entry, true);

  const hash = getHash(code);
  const cached = cache.get(hash);
  if (cached) return {...cached, entry};
  
  const module = loadModule(code, name, entry, true);
  cache.set(hash, module);
  return {...module, entry};
}

// Load a static (inert) module
export const loadStaticModule = (code: string, name: string, entry?: string) => {
  const hash = getHash(code);
  return { name, code, hash, entry, table: EMPTY_TABLE };
}

// Load a virtual (generated) module
export const loadVirtualModule = <T extends SymbolTable = any>(
  virtual: VirtualTable,
  initTable: Partial<T> = EMPTY_TABLE,
  entry?: string,
  hash?: string,
  code?: string,
  key?: string,
) => {
  let symbols = initTable.symbols ?? EMPTY_LIST;

  code = code ?? `@virtual [${symbols.join(' ')}]`;
  hash = hash ?? getHash(code);
  key  = key  ?? hash;

  const name = `${PREFIX_VIRTUAL}${key.slice(0, 6)}`;

  const table = {
    symbols,
    visibles: symbols,
    ...initTable,
  };
  return { name, code, hash, table, entry, virtual, key };
}
