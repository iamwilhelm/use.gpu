import type { AggregateBuffer, ArchetypeSchema, UniformType } from './types';
import { toMurmur53, scrambleBits53, mixBits53 } from '@use-gpu/state';
import { makeAggregateBuffer, updateAggregateBuffer, updateAggregateIndex } from './aggregate';
import { getUniformDims2, makeCopyEmitter2, makeUnweldEmitter2 } from './data2';

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

export const schemaToArchetype = (
  schema: ArchetypeSchema,
  props: Record<string, any>,
  flags: Record<string, any>,
) => {
  const tokens = [];
  for (const key in schema) {
    const {single, format} = schema[key];
    if (
      props[key] != null || 
      (single != null && props[single] != null)
    ) {
      tokens.push(key, format);
    }
  }
  tokens.push(flags);

  return toMurmur53(tokens);
};

export const schemaToAttributes = (
  schema: ArchetypeSchema,
  props: Record<string, any>,
): Record<string, any> => {
  const out: Record<string, any> = {};
  for (const key in schema) {
    const {single, unweld, composite} = schema[key];
    if (unweld || composite) throw new Error("Can't make attributes from composite schema. Use schemaToEmitters.");
    if (props[key] != null) {
      out[key] = props[key];
    }
    else if (single != null && props[single] != null) {
      out[single] = props[single];
    }
  }
  return out;
};

export const schemaToEmitters = (
  schema: ArchetypeSchema,
  props: Record<string, any>,
): Record<string, any> => {
  const out: Record<string, any> = {};
  const {unwelds, lookups} = props;
  for (const key in schema) {
    const {format, segment, single, unweld, composite} = schema[key];
    if (unweld) continue;

    const values = props[key];
    if (values != null) {
      const dims = getUniformDims2(format);

      if (!segment && unwelds) {
        out[key] = makeUnweldEmitter2(values, unwelds, dims);
      }
      else {
        out[key] = values;
      }
    }
    else if (single != null && props[single] != null) {
      const dims = getUniformDims2(format);
      const value = props[single];

      if (composite) {
        if (unwelds) {
          out[single] = makeUnweldEmitter2(values, unwelds, dims);
        }
        else {
          out[single] = makeCopyEmitter2(value, dims);
        }
      }
      else if (value.length > dims) {
        out[single] = makeUnweldEmitter2(value, lookups, dims);
      }
      else {
        out[single] = value;
      }
    }
  }
  return out;
};

export const schemaToAggregate = (
  device: GPUDevice,
  schema: ArchetypeSchema,
  props: Record<string, any>,
  count: number,
  indices: number = 0,
): Record<string, AggregateBuffer> => {
  const out: Record<string, any> = {};
  for (const key in schema) {
    const {single, format, index} = schema[key];
    if (
      props[key] != null || 
      (single != null && props[single] != null)
    ) {
      out[key] = makeAggregateBuffer(device, format as any, index ? indices : count);
    }
  }
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
  for (const key in schema) {
    const {single, index, segment, composite} = schema[key];
    if (aggregate[key]) {
      const k = single ?? '';
      if (index) {
        props[key] = updateAggregateIndex(device, aggregate[key], items, indices, offsets, k, key, segment, composite);
      }
      else {
        props[key] = updateAggregateBuffer(device, aggregate[key], items, count, k, key, segment, composite);
      }
    }
  }
};
