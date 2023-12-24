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
  uploadStorage,
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
    const {single, format, composite} = schema[key];

    const hasSingle = single && props[single] != null;
    const hasValues = props[key] != null;

    if (hasValues || (hasSingle && composite)) {
      // Per vertex (multiple or composite single)
      tokens.push(key, format);
    }
    else if (hasSingle) {
      const dims = getUniformDims2(format);
      const value = props[single];

      // Single per slice
      if (value.length > dims) tokens.push(key, format);

      // Single per item
      else tokens.push(single, format);
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
    const {single, composite, ref, format} = schema[key];
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
    const {format, unwelded, index, single, composite, ref} = schema[key];

    if (ref) {
      if (!refs) continue;

      // Single ref
      const value = refs[single];
      if (value != null) {
        attributes[single] = value;
      }
      continue;
    }

    const values = props[key];
    if (values != null) {
      const dims = getUniformDims2(format);

      if (!(unwelded || index) && unwelds) {
        // Unweld welded attribute
        attributes[key] = makeUnweldEmitter2(values, unwelds, dims);
      }
      else {
        // Direct attribute
        attributes[key] = values;
      }
      continue;
    }

    if (single != null && props[single] != null) {
      const dims = getUniformDims2(format);
      const value = props[single];

      if (composite) {
        // Unweld welded attribute
        if (!(unwelded || index) && unwelds) {
          attributes[key] = makeUnweldEmitter2(value, unwelds, dims);
        }
        // Direct attribute
        else {
          attributes[key] = value;
        }
      }
      // Single per slice
      else if (value.length > dims) {
        attributes[key] = makeExpandEmitter2(value, slices, dims);
      }
      // Single per item
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
  attributes: Record<string, TypedArray | VectorEmitter>,
  refs?: Record<string, RefObject<TypedArray | number>>,
  allocItems: number = 0,
  allocVertices: number = 0,
  allocIndices: number = 0,
): Aggregate => {
  let byRef: string[] = [];
  let byItem: string[] = [];
  let byVertex: string[] = [];
  let byIndex: string[] = [];
  let byUnwelded: string[] = [];
  let bySelf: [string, number][] = [];

  const aggregateBuffers: Record<string, any> = {};
  const refBuffers: Record<string, any> = {};

  for (const key in schema) {
    const {format, unwelded, index, single, composite, ref} = schema[key];
  
    const hasValues = attributes[key] != null;
    const hasSingle = single && attributes[single] != null;
    const hasRef = ref && refs && single && refs[single] != null;

    if (hasValues || hasSingle || hasRef) {
      // Allocation size per spread type
      const alloc = (
        ref   ? allocItems :
        unwelded || index ? allocIndices :
        allocVertices
      );
      const attr = [key, alloc];

      if (hasRef) {
        refBuffers[key] = [];
      }

      // Separate emulated types like u8/u16
      const align = getUniformAttributeAlign(format);
      const separate = !hasRef && (align === 0);

      if (separate) bySelf.push([key, alloc]);
      else {
        const list = (
          // Uniform with lazy ref
          hasRef ? byRef :
          // Uniform per item
          hasSingle ? byItem :
          // Per index
          index ? byIndex :
          // Per unwelded vertex
          unwelded ? byUnwelded :
          // Per vertex
          byVertex
        );
        list.push(key);
      }
    }
  }

  const bySelfs = {};

  // Build stand-alone attribute
  const buildOne = (k: string, alloc: number) => {
    const f = schema[k].format as any;
    const ab = aggregateBuffers[k] = makeAggregateBuffer(device, f, alloc);
    bySelfs[k] = ab.source;
  };

  // Build grouped attribute struct
  const buildGroup = (keys: string[], alloc: number, force: boolean) => {
    if (keys.length === 0) return;
    if (keys.length === 1 && !force) {
      buildOne(keys[0], alloc);
      return;
    }
    else {
      // Sort by descending alignment
      const uniforms = keys.map(k => ({name: k, format: schema[k].format as ay}));
      uniforms.sort((a, b) => getUniformAttributeAlign(b.format) - getUniformAttributeAlign(a.format));

      // Make multi-aggregate
      const aggregateBuffer = makeMultiAggregateBuffer(device, uniforms, alloc);
      const fields = makeMultiAggregateFields(aggregateBuffer);
      for (const k in fields) aggregateBuffers[k] = fields[k];

      return aggregateBuffer;
    }
  };

  for (const desc of bySelf) buildOne(...desc);

  // Add unwelded attributes to indices if they exist
  if (byIndex.length) byIndex.push(...byUnwelded);
  else byVertex.push(...byUnwelded);

  // If only per item indices, simplify to per vertex
  if (byItem.length && !byRef.length && !byVertex.length && !byIndex.length && !bySelf.length) {
    byVertex = byItem;
    byItem = [];
  }

  let byRefs = buildGroup(byRef, allocItems, true);
  let byItems = buildGroup(byItem, allocItems, true);
  let byVertices = buildGroup(byVertex, allocVertices);
  let byIndices = buildGroup(byIndex, allocIndices);

  // Add instances buffer for lookup per item/ref
  if (byItems || byRefs) aggregateBuffers.instances = makeAggregateBuffer(device, 'u16', allocIndices);

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
  indexed: number = 0,
  offsets: number[] = NO_OFFSETS,
) => {
  const {aggregateBuffers, refBuffers, byRefs, byItems, byVertices, byIndices, bySelfs} = aggregate;

  if (byItems) for (const {name} of byItems.layout.attributes) {
    const {single} = schema[name];
    updateAggregateBuffer(device, aggregateBuffers[name], items, 1, single, name);
  }

  if (byVertices) for (const {name} of byVertices.layout.attributes) {
    const {single} = schema[name];
    updateAggregateBuffer(device, aggregateBuffers[name], items, null, single, name);
  }

  if (byIndices) for (const {name} of byIndices.layout.attributes) {
    const {single, index, unwelded} = schema[name];
    const o = index ? offsets : undefined;
    updateAggregateBuffer(device, aggregateBuffers[name], items, null, single, name, index || unwelded, o);
  }

  for (const name in bySelfs) {
    const {single, index, unwelded} = schema[name];
    const o = index ? offsets : undefined;
    updateAggregateBuffer(device, aggregateBuffers[name], items, null, single, name, index || unwelded, o);
  }

  for (const name in refBuffers) {
    const {single} = schema[name];
    refBuffers[name] = items.map(item => item.refs?.[single]);
  }

  const {instances} = aggregateBuffers;
  if ((byRefs || byItems) && instances) {
    updateAggregateInstances(device, instances, items, indexed);
  }

  if (byItems) updateMultiAggregateBuffer(device, byItems, items.length);
  if (byVertices) updateMultiAggregateBuffer(device, byVertices, count);
  if (byIndices) updateMultiAggregateBuffer(device, byIndices, indexed);
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
