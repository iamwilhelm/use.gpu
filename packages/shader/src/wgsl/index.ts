import {
  loadModule,
  loadModuleWithCache,
  loadStaticModule,
  defineConstants,
  makeModuleCache,

  bundleToAttribute,
  bundleToAttributes,

  wgsl,
} from './shader';

import {
  bindBundle,
  bindModule,
  bindingsToLinks,
  bindingToModule,
  sourceToModule,
  resolveBindings,
} from './bind';

import {
  castTo,
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
  defineConstants,
  makeModuleCache,

  bundleToAttribute,
  bundleToAttributes,

  wgsl,
} from './shader';

export {
  bindBundle,
  bindModule,
  bindingsToLinks,
  bindingToModule,
  sourceToModule,
  resolveBindings,
} from './bind';

export {
  castTo,
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

export const WGSLLinker = {
  loadModule,
  loadModuleWithCache,
  loadStaticModule,
  bundleToAttribute,
  bundleToAttributes,
  wgsl,

  defineConstants,

  linkBundle,
  linkModule,
  linkCode,

  bindBundle,
  bindModule,
  bindingsToLinks,
  bindingToModule,
  sourceToModule,
  resolveBindings,

  castTo,
  chainTo,
  diffBy,

  makeASTParser,
  compressAST,
  decompressAST,
  rewriteUsingAST,

  makeModuleCache,

  getHash,
  getBundleHash,
  getBundleKey,
};

export default WGSLLinker;