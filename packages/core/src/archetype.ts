import type { AggregateBuffer, ArchetypeSchema, UniformType } from './types';
import { toMurmur53, scrambleBits53, mixBits53 } from '@use-gpu/state';
import { makeAggregateBuffer, updateAggregateBuffer, updateAggregateIndex } from './aggregate';

type Item = Record<string, any>;

const NO_OFFSETS: number[] = [];

export const formatToArchetype = (
  formats: Record<string, UniformType>,
  flags?: Record<string, any>,
) => {
  const tokens = [];
  for (const k in formats) tokens.push(k, formats[k]);
  tokens.push(flags);

  return toMurmur53(tokens);
};

export const forSchema = (
  schema: ArchetypeSchema,
  callback: (key: string, format: string, plural?: string, index?: boolean) => void,
): ArchetypeSchema => {
  const out = {};
  for (const k in schema) {
    const s = schema[k];
    
    let format, plural, index;
    if (typeof s === 'string') format = s;
    else ({format, plural, index} = s);

    callback(k, format, plural, index);
  }
  return out;
};

export const schemaToArchetype = (
  schema: ArchetypeSchema,
  props: Record<string, any>,
  flags: Record<string, any>,
) => {
  const tokens = [];
  forSchema(schema, (key, format, plural) => {
    if (!plural) return;
    if (props[plural] != null || props[key] != null) tokens.push(plural, format);
  });
  tokens.push(flags);

  return toMurmur53(tokens);
};

export const schemaToAttributes = (
  schema: ArchetypeSchema,
  props: Record<string, any>,
): Record<string, any> => {
  const out: Record<string, any> = {};
  forSchema(schema, (key, format, plural, index) => {
    if (!plural) return;
    if (props[plural] != null) {
      out[plural] = props[plural];
    }
    else if (props[key] != null) {
      out[key] = props[key];
    }
  });
  return out;
};

export const schemaToAggregate = (
  device: GPUDevice,
  schema: ArchetypeSchema,
  attributes: Record<string, any>,
  count: number,
  indices: number,
): Record<string, AggregateBuffer> => {
  const out: Record<string, any> = {};
  forSchema(schema, (key, format, plural, index) => {
    if (!plural) return;
    if (attributes[plural] != null || attributes[key] != null) {
      out[plural] = makeAggregateBuffer(device, format as any, index ? indices : count);
    }
  });
  return out;
};

export const updateAggregateFromSchema = (
  device: GPUDevice,
  schema: ArchetypeSchema,
  aggregate: Record<string, AggregateBuffer>,
  items: Item[],
  props: Record<string, any>,
  count: number,
  indices: number = 0,
  offsets: number[] = NO_OFFSETS,
) => {
  forSchema(schema, (key, _, plural, index) => {
    if (!plural) return;
    if (aggregate[plural]) {
      if (index) {
        props[plural] = updateAggregateIndex(device, aggregate[plural], items, indices, offsets, key, plural)
      }
      else {
        props[plural] = updateAggregateBuffer(device, aggregate[plural], items, count, key, plural);
      }
    }
  });
};
