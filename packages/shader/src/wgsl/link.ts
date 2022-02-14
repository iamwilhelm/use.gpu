import { Tree } from '@lezer/common';

import { defineConstants, loadModule, loadModuleWithCache, DEFAULT_CACHE } from './shader';
import { rewriteUsingAST } from './ast';
import { makeLinkCode, makeLinkBundle, makeLinkModule } from '../util/link';
import { timed } from '../util/timed';

const getPreambles = () => [];

// Link a parsed module with static modules, dynamic links
export const linkModule = makeLinkModule(getPreambles, defineConstants, rewriteUsingAST);

// Link a source module with static modules and dynamic links.
export const linkCode = makeLinkCode(loadModuleWithCache, linkModule, DEFAULT_CACHE);

// Link a bundle of parsed module + libs, dynamic links
export const linkBundle = makeLinkBundle(linkModule);
