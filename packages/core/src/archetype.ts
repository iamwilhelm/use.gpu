import type {
  CPUAggregate,
  GPUAggregate,
  ArrayAggregate,
  StructAggregate,
  ArchetypeSchema,
  ArchetypeField,
  VectorEmitter,
  VectorRefEmitter,
  UniformType,
} from './types';
import { toMurmur53, scrambleBits53, mixBits53, getObjectKey } from '@use-gpu/state';
import { isTypedArray } from './buffer';
import {
  makeArrayAggregate,
  makeStructAggregate,
  makeStructAggregateFields,

  updateAggregateArray,
  updateAggregateRefs,
  updateAggregateInstances,
  uploadAggregateBuffer,
} from './aggregate';
import { makeStorageBuffer } from './buffer';
import {
  makeCPUArray,
  makeSpreadEmitter,
  makeUnweldEmitter,
} from './data';
import {
  getUniformAlign,
  getUniformDims,
  getUniformArrayDepth,
  isUniformArrayType,
  getUniformElementType,
  toCPUDims,
  toGPUDims,
} from './uniform';

type Item = Record<string, any>;

const NO_OFFSETS: number[] = [];

/** Calculate archetype ID for a struct of attribute formats + flags */
export const formatToArchetype = (
  formats: Record<string, UniformType>,
  flags?: Record<string, any>,
) => {
  const tokens = [];
  for (const k in formats) tokens.push(k, formats[k]);
  tokens.push(flags);

  return toMurmur53(tokens);
};

/** Normalized simplified schema syntax */
export const normalizeSchema = <T>(
  schema: Record<string, string | T>,
) => {
  const out = {};
  for (const k in schema) {
    const f = schema[k];
    out[k] = typeof f === 'string' ? {format: f} : f;
  }
  return out;
};

/** Tweak types in existing schema */
export const adjustSchema = <T>(
  schema: Record<string, string | T>,
  formats?: Record<string, string>,
) => {
  if (!formats) return schema;

  const out = {};
  for (const k in schema) {
    const field = schema[k];
    let format = formats[k];

    if (!format) out[k] = field;
    else {
      const depth = getUniformArrayDepth(field.format);
      for (let i = 0; i < depth; ++i) format = `array<${format}>`;
      out[k] = {...field, format};
    }
  }
  return out;
};

/** Allocate separate field arrays for a schema */
export const allocateSchema = (
  schema: ArchetypeSchema,
  allocInstances: number = 0,
  allocVertices: number = 0,
  allocIndices: number = 0,
  hasSegments?: boolean,
  predicate?: (prop: string) => boolean,
) => {
  const fields: Record<string, FieldArray> = {};
  const attributes: Record<string, TypedArray> = {};

  let hasSingle = false;
  let hasPlural = false;

  for (const k in schema) if (!predicate || predicate(k)) {
    const {format, prop = k, index, unwelded, ref} = schema[k];
    if (ref) throw new Error(`Ref '${k}' not supported as field`);

    const isArray = isUniformArrayType(format);
    const alloc = isArray ? (index || unwelded) ? allocIndices : allocVertices : allocInstances;
    const {array, dims, depth} = makeCPUArray(format, alloc);

    if (isArray) hasPlural = true;
    else hasSingle = true;

    fields[k] = {array, dims, depth, prop};
    attributes[k] = array;
  }

  if (hasSingle && hasPlural && !hasSegments) throw new Error(`Cannot mix array and non-array data without 'segment' handler`);
  
  const archetype = schemaToArchetype(schema, attributes);
  if (attributes.instances) throw new Error(`Reserved attribute name 'instances'.`);

  return [fields, attributes, archetype];
};

/** Extract attributes from props using schema */
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

/** Extract emitters from props/refs using schema */
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
          attributes[key] = makeUnweldEmitter(values, unwelds, toCPUDims(dims), toGPUDims(dims));
        }
        else {
          // Direct attribute
          attributes[key] = values;
        }
      }
      else {
        // Single per slice
        if (spread && values.length > dims) {
          attributes[spread] = makeSpreadEmitter(values, slices, toCPUDims(dims), toGPUDims(dims));
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

/** Run attribute emitters to reify data early */
export const emitAttributes = (
  schema: ArchetypeSchema,
  props: Record<string, TypedArray | VectorEmitter>,
  allocInstances: number = 0,
  allocVertices: number = 0,
  allocIndices: number = 0,
): Record<string, TypedArray> => {
  const attributes: Record<string, any> = {};

  for (const key in schema) if (props[key] != null) {
    const {format, ref, unwelded, index} = schema[key];
    if (ref) continue;

    const values = props[key];
    if (isTypedArray(values)) {
      attributes[key] = values;
    }
    else {
      const isArray = isUniformArrayType(format);
      const count = (
        !isArray ? allocInstances :
        unwelded || index ? allocIndices :
        allocVertices
      );
      const {array, dims} = makeCPUArray(format, count);
      values(array, 0, count);

      attributes[key] = array;
    }
  }
  return attributes;
};

/** Calculate archetype ID for a schema and its attributes, flags, refs and extra sources */
export const schemaToArchetype = (
  schema: ArchetypeSchema,
  attributes: Record<string, TypedArray | VectorEmitter>,
  flags: Record<string, any>,
  refs?: Record<string, any>,
  sources?: Record<string, any>,
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
  if (sources) for (const key in sources) tokens.push(key, getObjectKey(sources[key]));

  return toMurmur53(tokens);
};

/** Create an aggregate for a schema and its attributes / refs */
export const schemaToAggregate = (
  schema: ArchetypeSchema,
  attributes: Record<string, TypedArray | VectorEmitter>,
  refs?: Record<string, RefObject<TypedArray | number>>,
  allocInstances: number = 0,
  allocVertices: number = 0,
  allocIndices: number = 0,
): CPUAggregate => {
  let byRef: string[] = [];
  let byInstance: string[] = [];
  let byVertex: string[] = [];
  let byIndex: string[] = [];
  let byUnwelded: string[] = [];
  let bySelf: [string, number][] = [];

  const aggregateBuffers: Record<string, any> = {};
  const refBuffers: Record<string, any> = {};

  for (const key in schema) {
    const {format, name, unwelded, index, ref, separate} = schema[key];

    const hasValues = attributes[key] != null;
    const hasRef = ref && refs && refs[key] != null;

    if (hasValues || hasRef) {
      const isArray = isUniformArrayType(format);

      // Allocation size per spread type
      const alloc = (
        ref || !isArray ? allocInstances :
        unwelded || index ? allocIndices :
        allocVertices
      );
      const attr = [key, alloc];

      // Separate emulated types like u8/u16
      const isEmulated = getUniformAlign(format) === 0;
      const isSeparate = separate || isEmulated;

      if (hasRef) {
        if (isEmulated) throw new Error(`Cannot use emulated type '${format}' as ref attribute`);
        refBuffers[key] = [];
      }

      if (isSeparate) {
        bySelf.push([key, alloc]);
      }
      else {
        const list = (
          // Uniform with lazy ref
          hasRef ? byRef :
          // Uniform per item
          !isArray ? byInstance :
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

  const bySelfs: { keys: string[] } = { keys: [] };

  // Build stand-alone attribute
  const buildOne = (k: string, alloc: number) => {
    const {format, name} = schema[k];
    const f = getUniformElementType(format) as UniformType;
    const n = name ?? k;
    const ab = aggregateBuffers[n] = makeArrayAggregate(f, alloc);

    bySelfs.keys.push([k, n]);
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
      keys.sort((a, b) => getUniformAlign(schema[b].format) - getUniformAlign(schema[a].format));

      const uniforms = keys.map(k => ({
        format: getUniformElementType(schema[k].format) as UniformType,
        name: schema[k].name ?? k,
      }));

      // Make multi-aggregate
      const aggregateBuffer = makeStructAggregate(uniforms, alloc, keys);
      const fields = makeStructAggregateFields(aggregateBuffer);
      for (const name in fields) aggregateBuffers[name] = fields[name];

      return aggregateBuffer;
    }
  };

  for (const desc of bySelf) buildOne(...desc);

  // Add unwelded attributes to indices if they exist
  if (byIndex.length) byIndex.push(...byUnwelded);
  else byVertex.push(...byUnwelded);

  // If only per instance indices, simplify to per vertex
  if (byInstance.length && !byRef.length && !byVertex.length && !byIndex.length && !bySelf.length) {
    byVertex = byInstance;
    byInstance = [];
  }

  let byRefs = buildGroup(byRef, allocInstances, true);
  let byInstances = buildGroup(byInstance, allocInstances, true);
  let byVertices = buildGroup(byVertex, allocVertices);
  let byIndices = buildGroup(byIndex, allocIndices);

  // Add instances buffer for lookup per item/ref
  if (byInstances || byRefs) {
    aggregateBuffers.instances = makeArrayAggregate('u32', allocIndices);
  }

  const aggregate = {aggregateBuffers, refBuffers, bySelfs, byRefs, byInstances, byVertices, byIndices};

  return aggregate;
};

/** Convert CPU aggregate to GPU aggregate with storage buffers */
export const toGPUAggregate = (
  device: GPUDevice,
  aggregate: CPUAggregate,
): GPUAggregate => {
  const {aggregateBuffers, refBuffers, bySelfs, byRefs, byInstances, byVertices, byIndices} = aggregate;
  
  const buildOne = (aggregate: ArrayAggregate) => {
    const {array, format, length} = aggregate;
    const buffer = makeStorageBuffer(device, array.byteLength);
    const source = {
      buffer,
      format,
      length,
      size: [length],
      version: 0,
    };
    return {...aggregate, buffer, source};
  };

  const buildGroup = (aggregate?: StructAggregate) => {
    if (!aggregate) return;

    const {raw, layout, length} = aggregate;
    const buffer = makeStorageBuffer(device, raw);
    const source = {
      buffer,
      format: layout.attributes,
      length,
      size: [length],
      version: 0,
    };
    return {...aggregate, buffer, source};
  };
  
  const ab = {...aggregateBuffers};
  const sources = {};

  for (const [, n] of bySelfs.keys) {
    ab[n] = buildOne(ab[n]);
    sources[n] = ab[n].source;
  }
  if (ab.instances) {
    ab.instances = buildOne(ab.instances);
  }

  const bs = {...bySelfs, sources};

  return {
    aggregateBuffers: ab,
    refBuffers,
    bySelfs: bs,
    byRefs: buildGroup(byRefs),
    byInstances: buildGroup(byInstances),
    byVertices: buildGroup(byVertices),
    byIndices: buildGroup(byIndices),
  };
};

/** Update the data inside a CPU/GPU aggregate */
export const updateAggregateFromSchema = (
  schema: ArchetypeSchema,
  aggregate: CPUAggregate | GPUAggregate,
  items: Item[],
  count: number,
  indexed: number = 0,
  instanced: number = items.length,
  indexOffsets: number[] = NO_OFFSETS,
) => {
  const {aggregateBuffers, refBuffers, byRefs, byInstances, byVertices, byIndices, bySelfs} = aggregate;

  if (byInstances) for (const k of byInstances.keys) {
    const name = schema[k].name ?? k;
    updateAggregateArray(aggregateBuffers[name], items, k, false, true);
  }

  if (byVertices) for (const k of byVertices.keys) {
    const name = schema[k].name ?? k;
    updateAggregateArray(aggregateBuffers[name], items, k);
  }

  if (byIndices) for (const k of byIndices.keys) {
    const {name: n, index, unwelded} = schema[k];
    const name = n ?? k;
    const o = index ? indexOffsets : undefined;
    updateAggregateArray(aggregateBuffers[name], items, k, index || unwelded, false, o);
  }

  for (const [k] of bySelfs.keys) {
    const {name: n, index, unwelded} = schema[k];
    const name = n ?? k;
    const o = index ? indexOffsets : undefined;
    updateAggregateArray(aggregateBuffers[name], items, k, index || unwelded, false, o);
  }

  for (const k in refBuffers) {
    refBuffers[k] = items.map(item => item.refs?.[k]);
  }

  const {instances} = aggregateBuffers;
  if ((byRefs || byInstances) && instances) {
    updateAggregateInstances(instances, items, indexed);
  }

  if (byInstances) byInstances.length = instanced;
  if (byVertices) byVertices.length = count;
  if (byIndices) byIndices.length = indexed;
}

/** Upload the data inside a GPU aggregate to the GPU */
export const uploadAggregateFromSchema = (
  device: GPUDevice,
  schema: ArchetypeSchema,
  aggregate: GPUAggregate,
) => {
  const {aggregateBuffers, byInstances, byVertices, byIndices, bySelfs} = aggregate;

  for (const [, name] of bySelfs.keys) {
    uploadAggregateBuffer(device, aggregateBuffers[name]);
  }

  const {instances} = aggregateBuffers;
  if (instances) {
    uploadAggregateBuffer(device, instances);
  }

  if (byInstances) uploadAggregateBuffer(device, byInstances);
  if (byVertices) uploadAggregateBuffer(device, byVertices);
  if (byIndices) uploadAggregateBuffer(device, byIndices);
};

/** Update/upload the refs inside a GPU aggregate to the GPU */
export const uploadAggregateFromSchemaRefs = (
  device: GPUDevice,
  schema: ArchetypeSchema,
  aggregate: GPUAggregate,
  count: number,
) => {
  const {aggregateBuffers, refBuffers, byRefs} = aggregate;

  for (const k in refBuffers) {
    const {name: n} = schema[k];
    const name = n ?? k;
    if (!aggregateBuffers[name]) continue;
    updateAggregateRefs(aggregateBuffers[name], refBuffers[k], 1);
  }

  if (byRefs) uploadAggregateBuffer(device, byRefs, count);
};
