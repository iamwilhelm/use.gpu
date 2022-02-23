import {
  loadModule,
  loadModuleWithCache,
  loadStaticModule,
  defineConstants,
  makeLanguage,
  makeModuleCache,
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
  bundleToAttribute,
} from './cast';

import {
  linkBundle,
  linkModule,
  linkCode,
} from './link';

import {
  makeASTParser,
  compressAST,
  decompressAST,
  rewriteUsingAST,
} from './ast';

import {
  getProgramHash
} from '../util/hash';

export {
  loadModule,
  loadModuleWithCache,
  loadStaticModule,
  defineConstants,
  makeLanguage,
  makeModuleCache,
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
  bundleToAttribute,
} from './cast';

export {
  linkBundle,
  linkModule,
  linkCode,
} from './link';

export {
  makeASTParser,
  compressAST,
  decompressAST,
  rewriteUsingAST,
} from './ast';

export {
  getProgramHash
} from '../util/hash';

export const WGSLLinker = {
  loadModule,
  loadModuleWithCache,
  loadStaticModule,

  defineConstants,

  linkBundle,
  linkModule,
  linkCode,

  bindBundle,
  bindModule,
  bindingsToLinks,
  bindingToModule,
  resolveBindings,

  castTo,
  bundleToAttribute,

  makeASTParser,
  compressAST,
  decompressAST,
  rewriteUsingAST,

  makeLanguage,
  makeModuleCache,

  getProgramHash,
};

export default WGSLLinker;