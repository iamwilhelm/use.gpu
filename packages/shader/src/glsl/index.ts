import {
  loadModule,
  loadModuleWithCache,
  loadStaticModule,
  transpileGLSL,
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
  sourceToModule,
  resolveBindings,
} from './bind';

import {
  castTo,
  swizzleTo,
} from './operators/cast';

import {
  chainTo,
} from './operators/chain';

import {
  diffBy,
} from './operators/diff';

import {
  explode,
} from './operators/explode';

import {
  structType,
} from './operators/struct';

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
  getBundleEntry,
  getBundleHash,
  getBundleKey,
  getBundleLabel,
} from '../util/bundle';

import { parser } from './grammar/glsl';

export {
  loadModule,
  loadModuleWithCache,
  loadStaticModule,
  transpileGLSL,
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
  sourceToModule,
  resolveBindings,
} from './bind';

export {
  castTo,
  swizzleTo,
} from './operators/cast';

export {
  chainTo,
} from './operators/chain';

export {
  diffBy,
} from './operators/diff';

export {
  explode,
} from './operators/explode';

export {
  structType,
} from './operators/struct';

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
  getBundleEntry,
  getBundleHash,
  getBundleKey,
  getBundleLabel,
} from '../util/bundle';

export const GLSLLinker = {
  loadModule,
  loadModuleWithCache,
  loadStaticModule,
  transpileGLSL,
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
  sourceToModule,
  resolveBindings,

  castTo,
  chainTo,
  diffBy,
  swizzleTo,
  structType,

  makeASTParser,
  compressAST,
  decompressAST,
  rewriteUsingAST,

  makeModuleCache,

  getBundleEntry,
  getBundleHash,
  getBundleKey,
  getBundleLabel,

  parser,
};

export { parser } from './grammar/glsl';


export default GLSLLinker;