import { Tree } from '@lezer/common';
import { ParsedModule, ParsedModuleCache, ShaderDefine } from './types';

import { makeLoadModule, makeLoadModuleWithCache } from '../util/shader';
import { makeBundleToAttribute, makeBundleToAttributes } from '../util/bundle';
import { decompressAST } from '../util/tree';
import { makeTranspile } from '../util/transpile';

import { makeASTParser, compressAST } from './ast';
import { toTypeString, toTypeArgs } from './type';
import { parser } from './grammar/glsl';
import LRU from 'lru-cache';
import zip from 'lodash/zip';

export { loadStaticModule, loadVirtualModule, bindEntryPoint } from '../util/shader';

// LRU cache for parsed shader code
export const makeModuleCache = (options: Record<string, any> = {}) => new LRU<number, ParsedModule>({
  max: 100,
  ...options,
});

export const DEFAULT_CACHE = makeModuleCache();

// Parse GLSL code into lezer tree
export const parseShader = (code: string): Tree => parser.parse(code);

// Parse a code module into its in-memory representation
// (AST + symbol table)
export const loadModule = makeLoadModule(parseShader, makeASTParser, compressAST);

// Use cache to load modules
export const loadModuleWithCache = makeLoadModuleWithCache(loadModule, DEFAULT_CACHE);

// Make GLSL definitions
export const defineConstants = (defs: Record<string, ShaderDefine>): string => {
  const out = [];
  for (let k in defs) if (defs[k] !== false && defs[k] !== null) out.push(`#define ${k} ${defs[k]}`);
  return out.join("\n");
}

export const bundleToAttribute = makeBundleToAttribute(toTypeString, toTypeArgs);
export const bundleToAttributes = makeBundleToAttributes(toTypeString, toTypeArgs);

// ES/CommonJS Transpiler
export const transpileGLSL = makeTranspile('glsl', 'glsl', loadModule, compressAST);

// Templated literal syntax: glsl`...`
export const glsl = (literals: TemplateStringsArray, ...tokens: string[]) => {
  const code = zip(literals, tokens).flat();
  return loadModuleWithCache(code.join(''));
};

export const float = (x: number) => {
  const s = x.toString();
  return (!s.match(/\./)) ? s + '.0' : 0;  
};
export const uint = (x: number) => Math.round(x).toString();
export const int = (x: number) => Math.round(x).toString();
