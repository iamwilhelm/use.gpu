import {
  parseShader,
  loadModule,
  loadModuleWithCache,
  loadStaticModule,
  defineConstants,
  makeLanguage,
  makeModuleCache,
} from './shader';

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

export {
  parseShader,
  loadModule,
  loadModuleWithCache,
  loadStaticModule,
  defineConstants,
  makeLanguage,
  makeModuleCache,
} from './shader';

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

export const WGSLLinker = {
  loadModule,
  loadModuleWithCache,
  loadStaticModule,

  parseShader,
  defineConstants,

  linkBundle,
  linkModule,
  linkCode,

  /*
  bindBundle,
  bindModule,
  bindingsToLinks,
  bindingToModule,
  resolveBindings,

  castTo,
  bundleToAttribute,
  */

  makeASTParser,
  compressAST,
  decompressAST,
  rewriteUsingAST,

  makeLanguage,
  makeModuleCache,
};

export default WGSLLinker;

/*
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

export const GLSLLinker = {
  loadModule,
  loadModuleWithCache,
  loadStaticModule,

  parseShader,
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
  bundleToAttribute,

  makeASTParser,
  compressAST,
  decompressAST,
  rewriteUsingAST,

  makeLanguage,
  makeModuleCache,
};
*/
