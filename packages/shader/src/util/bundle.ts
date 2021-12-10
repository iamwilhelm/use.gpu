import  { ParsedBundle, ParsedModule } from '../types';

const NO_LIBS = {};

// Accept direct module or bundle, with entry point on either.
export const toBundle = (bundle: ParsedBundle | ParsedModule): ParsedBundle => {
  if (typeof bundle === 'string') throw new Error("Bundle is a string instead of an object");

  if ('table' in bundle) return {
    module: bundle as ParsedModule,
    libs: NO_LIBS,
  } as ParsedBundle;

  let {module, libs, entry} = bundle;
  if (entry != null) {
    module = {...module, entry};
    return {module, libs} as ParsedBundle;
  }
  return bundle;
}

// Parse bundle of imports into main + libs
export const parseBundle = (bundle: ParsedBundle | ParsedModule): [ParsedModule, Record<string, ParsedModule>] => {
  let {module, libs} = toBundle(bundle);

  const out = {} as Record<string, ParsedModule>;
  const traverse = (libs: Record<string, ParsedBundle | ParsedModule>) => {
    for (let k in libs) {
      const {module, libs: subs} = toBundle(libs[k]);
      out[k] = module;
      if (subs) traverse(subs);
    }
  };
  if (libs) traverse(libs);

  return [module, out];
}

// Visit every module in a bundle
export const forBundleModules = (
  bundle: ParsedBundle | ParsedModule,
  callback: (m: ParsedModule) => void,
) => {
  const traverse = (lib: ParsedBundle | ParsedModule) => {
    if ('table' in lib) {
      callback(lib);
      return;
    }

    let {module, libs} = lib;
    callback(module);

    if (libs) for (let k in libs) traverse(libs[k]);
  }

  traverse(bundle);
}

// Parse escaped C-style string
export const parseString = (s: string) => s.slice(1, -1).replace(/\\(.)/g, '$1');

// Parse run-time specified keys `from:to` into a map of aliases
export const parseLinkAliases = <T>(
  links: Record<string, T>,
): [
  Record<string, T>,
  Map<string, string> | null,
] => {
  const out = {} as Record<string, T>;
  let aliases = null as Map<string, string> | null;

  for (let k in links) {
    const link = links[k] as any;
    if (!link) continue;

    let [name, imported] = k.split(':');
    if (!imported && link.entry != null) imported = link.entry;
    out[name] = link;
    if (imported) {
      if (!aliases) aliases = new Map<string, string>();
      aliases.set(name, imported);
    }
  }

  return [out, aliases];
}
