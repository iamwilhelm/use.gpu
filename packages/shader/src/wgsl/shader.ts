import { Tree } from '@lezer/common';
import { ParsedModule, ParsedModuleCache, ShaderDefine } from './types';

import { makeLoadModule, makeLoadModuleWithCache } from '../util/shader';
import { makeBundleToAttribute, makeBundleToAttributes } from '../util/bundle';
import { decompressAST } from '../util/tree';
import { makeTranspile } from '../util/transpile';

import { makeASTParser, compressAST } from './ast';
import { toTypeString, toTypeArgs } from './type';
import { parser } from './grammar/wgsl';
import LRU from 'lru-cache';
import zip from 'lodash/zip';

export { loadStaticModule, loadVirtualModule, bindEntryPoint } from '../util/shader';

// LRU cache for parsed shader code
export const makeModuleCache = (options: Record<string, any> = {}) => new LRU<number, ParsedModule>({
  max: 100,
  ...options,
});

export const DEFAULT_CACHE = makeModuleCache();

// Parse WGSL code into lezer tree
export const parseShader = (code: string): Tree => parser.parse(code);

// Parse a code module into its in-memory representation
// (AST + symbol table)
export const loadModule = makeLoadModule(parseShader, makeASTParser, compressAST);

// Use cache to load modules
export const loadModuleWithCache = makeLoadModuleWithCache(loadModule, DEFAULT_CACHE);

// Make WGSL definitions
export const defineConstants = (defs: Record<string, ShaderDefine>): string => {
  const out = [];
  for (let k in defs) if (k[0] !== '@' && defs[k] != null) out.push(`let ${k} = ${defs[k]};`);
  return out.join("\n");
}

export const bundleToAttribute = makeBundleToAttribute(toTypeString, toTypeArgs);
export const bundleToAttributes = makeBundleToAttributes(toTypeString, toTypeArgs);

// ES/CommonJS Transpiler
export const transpileWGSL = makeTranspile('wgsl', 'wgsl', loadModule, compressAST);

// Templated literal syntax: wgsl`...`
export const wgsl = (literals: TemplateStringsArray, ...tokens: string[]) => {
  const code = zip(literals, tokens).flat();
  return loadModuleWithCache(code.join(''));
};

export const f32 = (x: number) => {
  const s = x.toString();
  return (!s.match(/\./)) ? s + '.0' : s;  
};
export const u32 = (x: number) => Math.round(x).toString() + 'u';
export const i32 = (x: number) => Math.round(x).toString();
