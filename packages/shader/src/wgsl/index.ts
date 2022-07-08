import {
  loadModule,
  loadModuleWithCache,
  loadStaticModule,
  bindEntryPoint,
  defineConstants,
  makeModuleCache,

  bundleToAttribute,
  bundleToAttributes,

  wgsl, f32, i32, u32,
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

  wgsl, f32, i32, u32,
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
  bindEntryPoint,
  bundleToAttribute,
  bundleToAttributes,
  wgsl, f32, i32, u32,

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

export default WGSLLinker;