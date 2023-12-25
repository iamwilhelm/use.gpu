import type { AggregateBuffer, ArchetypeSchema, ArchetypeField, UniformType } from './types';
import type { VectorEmitter, VectorRefEmitter } from './data2';
import { toMurmur53, scrambleBits53, mixBits53 } from '@use-gpu/state';
import { isTypedArray } from './buffer';
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
  spreadNumberArray2,
  makeCopyEmitter2,
  makeSpreadEmitter2,
  makeRefEmitter2,
  makePartialRefEmitter2,
  makeUnweldEmitter2,
} from './data2';
import {
  getUniformAlign,
  getUniformDims,
  isUniformArrayType,
  getUniformElementType,
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

export const schemaToAttributes = (
  schema: ArchetypeSchema,
  props: Record<string, any>,
): Record<string, any> => {
  const attributes: Record<string, any> = {};
  for (const key in schema) {
    const {format, ref, unwelded} = schema[key];
    if (ref) continue;

    if (unwelded) throw new Error("Can't make attributes from composite schema. Use schemaToEmitters.");
    if (props[key] != null) {
      attributes[key] = props[key];
    }
  }
  return attributes;
};

export const schemaToEmitters = (
  schema: ArchetypeSchema,
  props: Record<string, number | TypedArray>,
  refs?: Record<string, RefObject<any>>,
): Record<string, TypedArray | VectorEmitter> => {
  const attributes: Record<string, any> = {};
  const {unwelds, slices} = props;
  for (const key in schema) {
    const {format, unwelded, index, ref, spread} = schema[key];

    if (ref) {
      if (!refs) continue;

      // Single ref
      const value = refs[key];
      if (value != null) {
        attributes[key] = value;
      }
      continue;
    }

    const values = props[key];
    if (values != null) {
      const dims = getUniformDims(format);
      const isArray = isUniformArrayType(format);

      if (isArray) {
        if (!(unwelded || index) && unwelds) {
          // Unweld welded attribute
          attributes[key] = makeUnweldEmitter2(values, unwelds, dims);
        }
        else {
          // Direct attribute
          attributes[key] = values;
        }
      }
      else {
        // Single per slice
        if (spread && values.length > dims) {
          attributes[spread] = makeSpreadEmitter2(values, slices, dims);
        }
        // Single per item
        else {
          attributes[key] = values;
        }
      }
    }
  }
  return attributes;
};

export const schemaToArchetype = (
  schema: ArchetypeSchema,
  attributes: Record<string, TypedArray | VectorEmitter>,
  flags: Record<string, any>,
  refs?: Record<string, any>,
) => {
  const tokens = [];
  for (const key in schema) {
    const {format, spread} = schema[key];
    const values = attributes[key];

    if (values != null) {
      // Providing an array to a non-array attribute triggers spread
      const dims = getUniformDims(format);
      const isSpread = spread && !isUniformArrayType(format) && values.length > dims;

      tokens.push(isSpread ? spread : key, format);
    }
  }
  tokens.push(flags);
  if (refs) for (const key in refs) tokens.push(key);

  return toMurmur53(tokens);
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
    const {format, name, unwelded, index, ref} = schema[key];
  
    const hasValues = attributes[key] != null;
    const hasRef = ref && refs && refs[key] != null;

    if (hasValues || hasRef) {
      const isArray = isUniformArrayType(format);

      // Allocation size per spread type
      const alloc = (
        ref || !isArray ? allocItems :
        unwelded || index ? allocIndices :
        allocVertices
      );
      const attr = [key, alloc];

      // Separate emulated types like u8/u16
      const align = getUniformAlign(format);
      const separate = !hasRef && (align === 0);

      if (hasRef) {
        if (separate) throw new Error(`Cannot use emulated type '${format}' as ref attribute`);
        refBuffers[key] = [];
      }

      if (separate) bySelf.push([key, alloc]);
      else {
        const list = (
          // Uniform with lazy ref
          hasRef ? byRef :
          // Uniform per item
          !isArray ? byItem :
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

  const bySelfs = {
    keys: [],
    sources: {},
  } as ArchetypeSchema['bySelfs'];

  // Build stand-alone attribute
  const buildOne = (k: string, alloc: number) => {
    const {format, name} = schema[k];
    const f = getUniformElementType(format) as UniformType;
    const n = name ?? k;
    const ab = aggregateBuffers[n] = makeAggregateBuffer(device, f, alloc);

    bySelfs.keys.push(k);
    bySelfs.sources[n] = ab.source;
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
      const uniforms = keys.map(k => ({
        format: getUniformElementType(schema[k].format) as UniformType,
        name: schema[k].name ?? k,
      }));
      uniforms.sort((a, b) => getUniformAlign(b.format) - getUniformAlign(a.format));

      // Make multi-aggregate
      const aggregateBuffer = makeMultiAggregateBuffer(device, uniforms, alloc, keys);
      const fields = makeMultiAggregateFields(aggregateBuffer);
      for (const name in fields) aggregateBuffers[name] = fields[name];

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

  if (byItems) for (const k of byItems.keys) {
    const name = schema[k].name ?? k;
    updateAggregateBuffer(device, aggregateBuffers[name], items, 1, k);
  }

  if (byVertices) for (const k of byVertices.keys) {
    const name = schema[k].name ?? k;
    updateAggregateBuffer(device, aggregateBuffers[name], items, null, k);
  }

  if (byIndices) for (const k of byIndices.keys) {
    const {name: n, index, unwelded} = schema[k];
    const name = n ?? k;
    const o = index ? offsets : undefined;
    updateAggregateBuffer(device, aggregateBuffers[name], items, null, k, index || unwelded, o);
  }

  for (const k of bySelfs.keys) {
    const {name: n, index, unwelded} = schema[k];
    const name = n ?? k;
    const o = index ? offsets : undefined;
    updateAggregateBuffer(device, aggregateBuffers[name], items, null, k, index || unwelded, o);
  }

  for (const k in refBuffers) {
    refBuffers[k] = items.map(item => item.refs?.[k]);
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

  for (const k in refBuffers) {
    const {name: n} = schema[k];
    const name = n ?? k;
    if (!aggregateBuffers[name]) continue;
    updateAggregateRefs(device, aggregateBuffers[name], refBuffers[k], 1);
  }

  if (byRefs) updateMultiAggregateBuffer(device, byRefs, count);
};
