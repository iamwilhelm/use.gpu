import { ParsedBundle, ParsedModule } from '../types';

const NO_LIBS = {};

export const getBundleKey = (bundle: ParsedBundle | ParsedModule) => {
  return (('module' in bundle) ? bundle.key ?? bundle.module.key : bundle.key) ?? getBundleHash(bundle);
};

export const getBundleHash = (bundle: ParsedBundle | ParsedModule) => {
  return ('module' in bundle) ? bundle.hash ?? bundle.module.hash : bundle.hash;
};

// Force module/bundle to bundle
export const toBundle = (bundle: ParsedBundle | ParsedModule): ParsedBundle => {
  if (typeof bundle === 'string') throw new Error("Bundle is a string instead of an object");

  if ('table' in bundle) return {
    module: bundle as ParsedModule,
  } as ParsedBundle;

  return bundle;
}

// Force module/bundle to module
export const toModule = (bundle: ParsedBundle | ParsedModule) => {
  if (typeof bundle === 'string') throw new Error("Bundle is a string instead of an object");

  if ('table' in bundle) return bundle as ParsedModule;
  return bundle.module;
}

// Parse escaped C-style string
export const parseString = (s: string) => s.slice(1, -1).replace(/\\(.)/g, '$1');
