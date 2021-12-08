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
  bindBundle,
  bindModule,
  bindingsToLinks,
} from './bind';

import {
  linkBundle,
  linkBundleVirtual,
  linkModule,
  linkModuleVirtual,
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
  bindBundle,
  bindModule,
  bindingsToLinks,
} from './bind';

export {
  linkBundle,
  linkBundleVirtual,
  linkModule,
  linkModuleVirtual,
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

export const GLSLLinker = {
  loadModule,
  loadModuleWithCache,
  loadStaticModule,

  parseShader,
  defineConstants,

  linkBundle,
  linkBundleVirtual,
  linkModule,
  linkModuleVirtual,
  linkCode,
  getPreamble,
  setPreamble,

  bindBundle,
  bindModule,
  bindingsToLinks,

  makeASTParser,
  compressAST,
  decompressAST,
  rewriteUsingAST,

  makeLanguage,
  makeModuleCache,
};

export default GLSLLinker;