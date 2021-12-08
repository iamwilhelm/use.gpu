import  { ParsedBundle, ParsedModule } from '../types';

const NO_LIBS = {};

export const toBundle = (bundle: ParsedBundle | ParsedModule): ParsedBundle => {
  if (typeof bundle === 'string') throw new Error("Bundle is a string instead of an object");

  if ('table' in bundle) return {
    module: bundle as ParsedModule,
    libs: NO_LIBS,
  } as ParsedBundle;

  let {module, libs, entry} = bundle;
  if (entry != null) module = {...module, entry};
  return {module, libs} as ParsedBundle;
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

// Parse escaped C-style string
export const parseString = (s: string) => s.slice(1, -1).replace(/\\(.)/g, '$1');

// Parse run-time specified keys `from:to` into a map of aliases
export const parseLinkAliases = (
  links: Record<string, ParsedModule | ParsedBundle>,
): [
  Record<string, ParsedModule>,
  Map<string, string> | null,
] => {
  const out = {} as Record<string, ParsedModule>;
  let aliases = null as Map<string, string> | null;

  for (let k in links) {
    const link = links[k];

    let [name, imported] = k.split(':');
    if (!imported && link.entry != null) imported = link.entry;
    out[name] = (link as any).module ?? link;
    if (imported) {
      if (!aliases) aliases = new Map<string, string>();
      aliases.set(name, imported);
    }
  }

  return [out, aliases];
}
