import { Tree, SyntaxNode } from '@lezer/common';
import LRU from 'lru-cache';
import * from '../types';

export * from '../types';

export type ParsedModuleCache = LRU<string, ParsedModule>;

export type ShaderModule = ParsedBundle | ParsedModule;

export type ParsedBundle = {
  module: ParsedModule,
  libs?: Record<string, ShaderModule>,
  entry?: string,
  virtual?: ParsedModule[],
};

export type ParsedModule = {
  name: string,
  code: string,
  table: SymbolTable,
  tree?: Tree,
  //shake?: ShakeTable,
  //virtual?: VirtualTable,
  entry?: string,
};

export type SymbolTable = {
  hash: string,
  //symbols?: SymbolRef[],
  //visibles?: SymbolRef[],
  //globals?: SymbolRef[],
  modules?: ModuleRef[],
  //functions?: FunctionRef[],
  //declarations?: DeclarationRef[],
  //externals?: DeclarationRef[],
};

export type SymbolRef = string;

export type ImportRef = {
  name: string,
  imported: string,
}

export type SymbolsRef = {
  at: number,
  symbols: SymbolRef[],
}

export type ModuleRef = SymbolsRef & {
  name: string,
  imports: ImportRef[],
}
