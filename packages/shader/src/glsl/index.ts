import {
  loadModule,
  loadModuleWithCache,
  loadStaticModule,
  bindEntryPoint,
  defineConstants,
  makeModuleCache,

  bundleToAttribute,
  bundleToAttributes,

  glsl, float, int, uint,
} from './shader';

import {
  bindBundle,
  bindModule,
  bindingsToLinks,
  bindingToModule,
  resolveBindings,
} from './bind';

import {
  castTo,
  swizzleTo,
} from './cast';

import {
  chainTo,
} from './chain';

import {
  diffBy,
} from './diff';

import {
  linkBundle,
  linkModule,
  linkCode,
  getPreamble,
  setPreamble,
} from './link';

import {
  makeASTParser,
  compressAST,
  decompressAST,
  rewriteUsingAST,
} from './ast';

import {
  getHash
} from '../util/hash';

import {
  getBundleHash,
  getBundleKey,
} from '../util/bundle';

export {
  loadModule,
  loadModuleWithCache,
  loadStaticModule,
  bindEntryPoint,
  defineConstants,
  makeModuleCache,

  bundleToAttribute,
  bundleToAttributes,

  glsl, float, int, uint,
} from './shader';

export {
  bindBundle,
  bindModule,
  bindingsToLinks,
  bindingToModule,
  resolveBindings,
} from './bind';

export {
  castTo,
  swizzleTo,
} from './cast';

export {
  chainTo,
} from './chain';

export {
  diffBy,
} from './diff';

export {
  linkBundle,
  linkModule,
  linkCode,
  getPreamble,
  setPreamble,
} from './link';

export {
  makeASTParser,
  compressAST,
  decompressAST,
  rewriteUsingAST,
} from './ast';

export {
  getHash
} from '../util/hash';

export {
  getBundleHash,
  getBundleKey,
} from '../util/bundle';

export const GLSLLinker = {
  loadModule,
  loadModuleWithCache,
  loadStaticModule,
  bindEntryPoint,
  bundleToAttribute,
  bundleToAttributes,
  glsl, float, int, uint,

  defineConstants,

  linkBundle,
  linkModule,
  linkCode,
  getPreamble,
  setPreamble,

  bindBundle,
  bindModule,
  bindingsToLinks,
  bindingToModule,
  resolveBindings,

  castTo,
  chainTo,
  diffBy,
  swizzleTo,

  makeASTParser,
  compressAST,
  decompressAST,
  rewriteUsingAST,

  makeModuleCache,

  getHash,
  getBundleHash,
  getBundleKey,
};

export default GLSLLinker;