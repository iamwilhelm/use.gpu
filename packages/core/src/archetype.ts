import type { AggregateBuffer, ArchetypeSchema, ArchetypeField, UniformType } from './types';
import type { VectorEmitter, VectorRefEmitter } from './data2';
import { toMurmur53, scrambleBits53, mixBits53 } from '@use-gpu/state';
import {
  makeAggregateBuffer,
  makeMultiAggregateBuffer,
  makeMultiAggregateFields,
  updateAggregateBuffer,
  updateMultiAggregateBuffer,
  updateAggregateRefs,
  updateAggregateIndex,
  updateAggregateInstances,
  uploadSource,
} from './aggregate';
import {
  getUniformDims2,
  expandNumberArray2,
  makeCopyEmitter2,
  makeExpandEmitter2,
  makeRefEmitter2,
  makePartialRefEmitter2,
  makeUnweldEmitter2,
} from './data2';
import {
  getUniformAttributeAlign
} from './uniform';

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
    if (props[key] != null) {
      tokens.push(key, format);
    }
    else if (single != null && props[single] != null) {
      tokens.push(single, format);
    }
  }
  tokens.push(flags);
  if (refs) for (const key in refs) tokens.push(key);

  return toMurmur53(tokens);
};

export const schemaToUniform = (
  schema: ArchetypeSchema,
  key: string,
) => {
  const {format} = schema[key];
  return {name: key, format, args: ['u32']};
};

export const schemaToAttributes = (
  schema: ArchetypeSchema,
  props: Record<string, any>,
): Record<string, any> => {
  const attributes: Record<string, any> = {};
  for (const key in schema) {
    const {single, composite, ref} = schema[key];
    if (ref) continue;
    if (composite) throw new Error("Can't make attributes from composite schema. Use schemaToEmitters.");
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
): Record<string, TypedArray | VectorEmitter> => {
  const attributes: Record<string, any> = {};
  const {unwelds, slices} = props;
  for (const key in schema) {
    const {format, unwelded, single, composite, ref} = schema[key];

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
      
      if (!unwelded && unwelds) {
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
  allocVertices: number = 0,
  allocIndices: number = 0,
): Aggregate => {
  const byRef: string[] = [];
  const byItem: string[] = [];
  const byVertex: string[] = [];
  const byIndex: string[] = [];
  const bySelf: [string, number][] = [];

  const aggregateBuffers: Record<string, any> = {};
  const refBuffers: Record<string, any> = {};

  for (const key in schema) {
    const {composite, ref, single, format, index} = schema[key];
    
    const hasSingle = single && props[single] != null;
    const hasValues = props[key] != null;
    const hasRef = ref && refs && single && refs[single] != null;
    
    if (hasValues || hasSingle || hasRef) {
      const alloc = (
        ref   ? allocItems :
        index ? allocIndices :
        allocVertices
      );
      const attr = [key, alloc];

      const align = getUniformAttributeAlign(format);
      const dims = getUniformDims2(format);

      let uniform = false;
      
      if (hasRef) {
        refBuffers[key] = refs;
      }
      else if (hasSingle && !composite) {
        uniform = typeof props[single] !== 'function';
      }

      const separate = getUniformAttributeAlign(format) === 0;
      if (separate) bySelf.push([key, alloc]);
      else {
        const list = (
          uniform ? byItem :
          ref   ? byRef :
          index ? byIndex :
          byVertex
        );
        list.push(key);
      }
    }
  }

  const bySelfs = {};

  const buildOne = (k: string, alloc: number) => {
    const f = schema[k].format as any;
    const ab = aggregateBuffers[k] = makeAggregateBuffer(device, f, alloc);
    bySelfs[k] = ab.source;
  };

  const buildGroup = (keys: string[], alloc: number) => {
    if (keys.length === 0) return;
    if (keys.length === 1) {
      buildOne(keys[0], alloc);
      return;
    }
    else {
      const uniforms = keys.map(k => ({name: k, format: schema[k].format as ay}));
      uniforms.sort((a, b) => getUniformAttributeAlign(b.format) - getUniformAttributeAlign(a.format));

      const aggregateBuffer = makeMultiAggregateBuffer(device, uniforms, alloc);
      const fields = makeMultiAggregateFields(aggregateBuffer);
      for (const k in fields) aggregateBuffers[k] = fields[k];

      return aggregateBuffer;
    }
  };

  for (const desc of bySelf) buildOne(...desc);

  let byRefs = buildGroup(byRef, allocItems);
  let byItems = buildGroup(byItem, allocItems);
  let byVertices = buildGroup(byVertex, allocVertices);
  let byIndices = buildGroup(byIndex, allocIndices);

  if (byItems && !byRefs && !byVertices && !byIndices) {
    byVertices = byItems;
    byItems = undefined;
  }

  if (byItems || byRefs) aggregateBuffers.instances = makeAggregateBuffer(device, 'u32', allocVertices);

  const aggregate = {aggregateBuffers, refBuffers, bySelfs, byRefs, byItems, byVertices, byIndices};

  console.warn('aggregate', aggregate);

  return aggregate;
};

export const mapSchema = <T>(
  schema: ArchetypeSchema,
  callback: (field: ArchetypeField) => T,
): ArchetypeSchema => {
  const out: T[] = [];
  for (const key in schema) {
    const field = schema[key];
    const v = callback(field, key);
    if (v !== undefined) out.push(v);
  }
  return out;
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
  aggregate: Aggregate,
  items: Item[],
  count: number,
  indices: number = 0,
  offsets: number[] = NO_OFFSETS,
) => {
  const {aggregateBuffers, refBuffers, byRefs, byItems, byVertices, byIndices} = aggregate;

  for (const key in schema) {
    const {single, index, ref} = schema[key];

    if (aggregateBuffers[key]) {
      const aggregateBuffer = aggregateBuffers[key];

      const k = single ?? '';
      if (index) {
        throw new Error("TODO");
        updateAggregateIndex(device, aggregateBuffer, items, indices, offsets, k, key);
      }
      else {
        updateAggregateBuffer(device, aggregateBuffer, items, count, k, key);
      }
    }

    if (ref && single && refBuffers[key]) {
      refBuffers[key] = items.map(item => item.refs?.[single]);
      continue;
    }
  }
  
  const {instances} = aggregateBuffers;
  if ((byRefs || byItems) && instances) {
    updateAggregateInstances(device, instances, items, count);
  }

  if (byItems) updateMultiAggregateBuffer(device, byItems, count);
  if (byVertices) updateMultiAggregateBuffer(device, byVertices, count);
  if (byIndices) updateMultiAggregateBuffer(device, byIndices, indices);
};

export const updateAggregateFromSchemaRefs = (
  device: GPUDevice,
  schema: ArchetypeSchema,
  aggregate: Aggregate,
  count: number,
) => {
  const {aggregateBuffers, refBuffers, byRefs} = aggregate;
  for (const key in schema) {
    const {single, ref} = schema[key];
    if (!ref || !single) continue;
    if (aggregateBuffers[key]) {
      const k = single;
      updateAggregateRefs(device, aggregateBuffers[key], refBuffers[key], 1);
    }
  }

  if (byRefs) updateMultiAggregateBuffer(device, byRefs, count);
};
