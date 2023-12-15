import type { AggregateBuffer, ArchetypeSchema, ArchetypeField, UniformType } from './types';
import type { NumberEmitter, NumberRefEmitter } from './data2';
import { toMurmur53, scrambleBits53, mixBits53 } from '@use-gpu/state';
import {
  makeAggregateBuffer,
  updateAggregateBuffer,
  updateAggregateRefs,
  updateAggregateIndex,
} from './aggregate';
import {
  getUniformDims2,
  makeCopyEmitter2,
  makeExpandEmitter2,
  makeRefEmitter2,
  makePartialRefEmitter2,
  makeUnweldEmitter2,
} from './data2';

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
  refs?: Record<string, any>,
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
  if (refs) for (const key in refs) tokens.push(key);

  return toMurmur53(tokens);
};

export const schemaToAttributes = (
  schema: ArchetypeSchema,
  props: Record<string, any>,
): Record<string, any> => {
  const attributes: Record<string, any> = {};
  for (const key in schema) {
    const {single, unweld, composite, ref} = schema[key];
    if (ref) continue;
    if (unweld || composite) throw new Error("Can't make attributes from composite schema. Use schemaToEmitters.");
    if (props[key] != null) {
      attributes[key] = props[key];
    }
    else if (single != null && props[single] != null) {
      attributes[single] = props[single];
    }
  }
  return attributes;
};

export const schemaToEmitters = (
  schema: ArchetypeSchema,
  props: Record<string, any>,
  refs?: Record<string, RefObject<any>>,
): Record<string, TypedArray | NumberEmitter> => {
  const attributes: Record<string, any> = {};
  const {unwelds, slices} = props;
  for (const key in schema) {
    const {format, segment, single, unweld, composite, ref} = schema[key];
    if (unweld) continue;

    if (ref) {
      if (!refs) continue;

      const value = refs[single];
      if (value != null) {
        attributes[single] = value;
      }
      continue;
    }

    const values = props[key];
    if (values != null) {
      const dims = getUniformDims2(format);
      
      if (!segment && unwelds) {
        attributes[key] = makeUnweldEmitter2(values, unwelds, dims);
      }
      else {
        attributes[key] = values;
      }
      continue;
    }

    if (single != null && props[single] != null) {
      const dims = getUniformDims2(format);
      const value = props[single];

      if (composite) {
        if (unwelds) {
          attributes[single] = makeUnweldEmitter2(value, unwelds, dims);
        }
        else {
          attributes[single] = makeCopyEmitter2(value, dims);
        }
      }
      else if (value.length > dims) {
        attributes[single] = makeExpandEmitter2(value, slices, dims);
      }
      else {
        attributes[single] = value;
      }
    }
  }
  return attributes;
};

export const schemaToAggregate = (
  device: GPUDevice,
  schema: ArchetypeSchema,
  props: Record<string, any>,
  refs?: Record<string, RefObject<any>>,
  allocItems: number = 0,
  allocCount: number = 0,
  allocIndices: number = 0,
): Record<string, AggregateBuffer> => {
  const aggregate: Record<string, any> = {};
  for (const key in schema) {
    const {ref, single, format, index} = schema[key];
    if (
      props[key] != null || 
      (
        (single != null) && (
          (props[single] != null) ||
          (ref && refs && refs[single] != null)
        )
      )
    ) {

      if (ref && single) {
        if (!aggregate.instances) {
          aggregate.instances = makeAggregateBuffer(device, format as any, allocCount);
        };
        aggregate[single] = [];
      }

      const size = (
        ref ? allocItems :
        index ? allocIndices :
        allocCount
      );
      aggregate[key] = makeAggregateBuffer(device, format as any, size);
    }
  }
  return aggregate;
};

export const filterSchema = (
  schema: ArchetypeSchema,
  callback: (field: ArchetypeField) => boolean,
): ArchetypeSchema => {
  const out: Record<string, any> = {};
  for (const key in schema) {
    const field = schema[key];
    if (callback(field)) out[key] = schema[key];
  }
  return out;
};

export const updateAggregateFromSchema = (
  device: GPUDevice,
  schema: ArchetypeSchema,
  aggregate: Record<string, AggregateBuffer>,
  props: Record<string, any>,
  items: Item[],
  count: number,
  indices: number = 0,
  offsets: number[] = NO_OFFSETS,
) => {
  for (const key in schema) {
    const {single, index, segment, composite, ref} = schema[key];

    if (ref && single && aggregate[single]) {
      aggregate[single] = items.map(item => item.refs?.[single]);
      props[key] = aggregate[key].source;
      continue;
    }

    if (aggregate[key]) {
      const k = single ?? '';
      if (index) {
        props[key] = updateAggregateIndex(device, aggregate[key], items, indices, offsets, k, key);
      }
      else {
        props[key] = updateAggregateBuffer(device, aggregate[key], items, count, k, key);
      }
    }
  }
};

export const updateAggregateFromSchemaRefs = (
  device: GPUDevice,
  schema: ArchetypeSchema,
  aggregate: Record<string, AggregateBuffer>,
) => {
  for (const key in schema) {
    const {single, index, segment, composite, ref} = schema[key];
    if (!ref || !single) continue;
    if (aggregate[key]) {
      const k = single;
      updateAggregateRefs(device, aggregate[key], aggregate[single], 1);
    }
  }
};
