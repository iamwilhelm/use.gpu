import type { ArchetypeSchema, UniformType } from './types';
import { toMurmur53, scrambleBits53, mixBits53 } from '@use-gpu/state';

export const getFormatArchetype = (
  formats: Record<string, UniformType>,
  flags?: Record<string, any>,
) => {
  const tokens = [];
  for (const k in formats) tokens.push(k, formats[k]);
  tokens.push(flags);

  return toMurmur53(tokens);
};

export const getPluralArchetype = (
  schema: ArchetypeSchema,
  props: Record<string, any>,
  flags: Record<string, any>,
) => {
  const tokens = [];
  for (const k in schema) {
    const s = schema[k];
    
    let format, plural;
    if (typeof s === 'string') format = s;
    else ({format, plural} = s);

    if (plural && props[plural] != null) tokens.push(plural, format);
    else if (props[k] != null) tokens.push(k, format);
  }
  tokens.push(flags);

  return toMurmur53(tokens);
};
