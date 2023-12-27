import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { ArrowFunction, TypedArray, StorageSource, DataSchema, DataBounds } from '@use-gpu/core';

import { useDeviceContext } from '../providers/device-provider';
import { useAnimationFrame, useNoAnimationFrame } from '../providers/loop-provider';
import { useAggregator } from '../hooks/useAggregator';
import { useBufferedSize } from '../hooks/useBufferedSize';
import { useRenderProp } from '../hooks/useRenderProp';
import { yeet, signal, useOne, useMemo, useNoMemo } from '@use-gpu/live';
import {
  seq,
  toCPUDims,
  isUniformArrayType,
  getUniformArrayDepth,

  makeDataArray,
  copyRecursiveNumberArray,
  getBoundingBox,
  toDataBounds,

  schemaToArchetype,
  schemaToEmitters,
  getAggregateSummary,
} from '@use-gpu/core';
import { toMultiCompositeChunks } from '@use-gpu/parse';

type BooleanList = boolean | boolean[] | (<T>(i: number) => boolean);

export type SegmentsInfo = {
  positions: TypedArray,
  chunks: number[] | TypedArray,
  groups: number[] | TypedArray,
  loops: boolean[] | boolean,
  starts: boolean[] | boolean,
  ends: boolean[] | boolean,
};

export type CompositeDataProps = {
  /** WGSL schema of input data + accessors */
  schema: DataSchema,
  /** Input data, array of structs of values/arrays, or 1 struct, if data is not virtualized */
  data?: Record<string, any> | (Record<string, any>)[],
  /** Input data accessors, if data is virtualized */
  virtual?: Record<string, (i: number) => any>,
  /** Input length, if data is virtualized */
  count?: number,
  /** Input version, if data is virtualized. Controls re-upload if set. */
  version?: number,
  /** Resample data on every animation frame. */
  live?: boolean,

  /** Global flag or per item `isLoop` accessor */
  loop?: BooleanList,
  /** Global flag or per item `hasStart` accessor */
  start?: BooleanList,
  /** Global flag or per item `hasEnd` accessor */
  end?: BooleanList,

  /** Segment decorator(s) */
  segments?: (args: SegmentsInfo) => Record<string, any>,

  /** Receive 1 source per field, in virtual struct-of-array format. Leave empty to yeet sources instead. */
  render?: (sources: Record<string, StorageSource>) => LiveElement,
  children?: (sources: Record<string, StorageSource>) => LiveElement,
};

const NO_SCHEMA = {} as DataSchema;
const NO_BOUNDS = {center: [], radius: 0, min: [], max: []} as DataBounds;

/** Aggregate array-of-structs with fields `T | T[] | T[][]` into grouped storage sources. */
export const CompositeData: LiveComponent<CompositeDataProps> = (props) => {
  const {
    skip = 0,
    count,
    version,
    data: propData,
    virtual,
    schema = NO_SCHEMA,
    loop,
    start,
    end,
    segments,
    live = false,
  } = props;

  const data = propData ? Array.isArray(propData) ? propData : [propData] : null;
  const itemCount = Math.max(0, (count ?? data?.length) - skip);

  // Identify an array and index field (if any)
  const [countKey, indexedKey, isArray, isIndexed] = useMemo(() => {
    const keys = Object.keys(schema);
    const countKey = keys.find(k => isUniformArrayType(schema[k].format as any));
    const indexedKey = keys.find(k => schema[k].index);

    const isArray = !!countKey;
    const isIndexed = !!indexedKey;

    return [countKey ?? keys[0], indexedKey, isArray, isIndexed];
  }, [schema]);

  // Resolve segment flags
  const [loops, starts, ends] = useMemo(() => {
    const loops  = resolveSegmentFlag(itemCount, loop, skip);
    const starts = resolveSegmentFlag(itemCount, start, skip);
    const ends   = resolveSegmentFlag(itemCount, end, skip);

    return [loops, starts, ends];
  }, [itemCount, loop, start, end, skip]);

  // Resolve chunk/group counts
  const [chunks, groups, vertexCount, indexCount] = useMemo(() => {
    let chunks = null;
    let groups = null;
    let vertexCount = itemCount
    let indexCount = itemCount;

    if (isArray && segments) {
      [vertexCount, chunks, groups] = getChunkCount(schema, countKey, itemCount, data, virtual, skip);
      if (indexedKey) [indexCount] = getChunkCount(schema, indexKey, itemCount, data, virtual, skip);
    }

    return [chunks, groups, vertexCount, indexedKey ? indexCount : vertexCount];
  }, [isArray, segments, itemCount, countKey, indexedKey, data, virtual, skip]);

  const allocItems = useBufferedSize(itemCount);
  const allocVertices = useBufferedSize(vertexCount);
  const allocIndices = useBufferedSize(indexCount);

  // Make arrays for merged attributes
  const [fields, attributes, archetype] = useMemo(() => {
    const fields = {};
    const attributes = {};

    for (const k in schema) {
      const {format, prop = k, index, unwelded, ref} = schema[k];
      if (ref) throw new Error(`Ref '${k}' not supported in <CompositeData>`);

      const isArray = isUniformArrayType(format);
      const {array, dims} = makeDataArray(format, isArray ? (index || unwelded) ? allocIndices : allocVertices : allocItems);
      const depth = getUniformArrayDepth(format);

      fields[k] = {array, dims, depth, prop};
      attributes[k] = array;
    }

    const archetype = schemaToArchetype(schema, attributes);
    if (attributes.instances) throw new Error(`Reserved attribute name 'instances'.`);

    return [fields, attributes, archetype];
  }, [schema, allocItems, allocVertices, allocIndices]);

  // Get emitters for data + segment data
  const [mergedSchema, emitters, total, indexed, sparse] = useMemo(() => {
    if (!isArray || !segments) return [schema, schemaToEmitters(schema, attributes), vertexCount, indexCount, 0];

    const positions = fields[countKey].array;

    const segmentData = segments({
        chunks: chunks!,
        groups: groups!,
        positions,
        loops,
        starts,
        ends,
    });

    const {count: total, indexed, sparse, schema: segmentSchema, ...rest} = segmentData;
    for (const k in rest) if (attributes[k]) throw new Error(`Attribute name '${k}' reserved for segment data.`);

    const mergedSchema = {...schema, ...segmentSchema};
    const emitters = schemaToEmitters(mergedSchema, {...attributes, ...rest});

    return [mergedSchema, emitters, total, indexed, sparse];
  }, [schema, fields, countKey, attributes, segments, chunks, groups, loops, starts, ends]);

  // Blit all data into merged arrays
  const items = useMemo(() => {
    const slices = [];

    for (const k in fields) {
      const accessor = virtual?.[k];
      if (!accessor && !data) continue;

      const {array, dims, depth, prop} = fields[k];
      const slice = k === countKey;

      // Keep CPU-only layout, as useAggregator will widen for us
      const dimsIn = toCPUDims(dims);

      let b = 0;
      let o = 0;
      for (let i = 0; i < itemCount; ++i) {
        o += copyRecursiveNumberArray(accessor ? accessor(i + skip) : data[i + skip][prop], array, dimsIn, dimsIn, depth, o, 1);
        if (slice) slices.push((o - b) / dimsIn + ((loops === true || loops?.[i]) ? 3 : 0));
        b = o;
      }
    }

    return [{
      count: total,
      indexed,
      instanced: itemCount,
      slices,
      archetype,
      attributes: emitters,
    }];
  }, [
    live ? NaN : virtual ? (version ?? NaN) : null, data,
    itemCount, skip, total, indexed,
    archetype, emitters,
  ]);

  // Aggregate into struct buffers by access policy
  const {sources} = useAggregator(mergedSchema, items);
  console.log('item', {item: items[0], emitters, total, indexed, sources})

  // Tag positions with bounds
  useMemo(() => {
    if (!fields.positions) return NO_BOUNDS;

    const {array, dims} = fields.positions;
    const bounds = toDataBounds(getBoundingBox(array, toCPUDims(dims)));

    if (sources.positions && bounds) sources.positions.bounds = bounds;
  }, [fields, items, sources]);

  if (live) useAnimationFrame();
  else useNoAnimationFrame();

  const trigger = useOne(() => signal(), items);

  const view = useRenderProp(props, sources);
  return [trigger, view];
};

// Resolve loop/start/end flags into array
const resolveSegmentFlag = (count: number, flag?: Boolean, skip: number = 0) => {
  if (typeof flag === 'function') {
    let flags = [];
    for (let i = 0; i < count; ++i) flags.push((flag as ArrowFunction)(i + skip));
    return flags;
  }
  if (Array.isArray(flag)) {
    if (skip) return flag(skip, skip + count);
    else if (flag.length > count) return flag.slice(0, count);
    return flag;
  }
  return flag;
};

// Get list of inner ragged chunk lengths plus outer ragged groupings
const getChunkCount = (
  schema: DataSchema,
  key: string,
  itemCount: number,
  data?: Record<string, any> | (Record<string, any>)[],
  virtual?: Record<string, (i: number) => any>,
  skip: number = 0
) => {
  const {format, prop} = schema[key];
  const accessor = virtual?.[key];

  let i = 0;
  const get = (accessor
    ? (i: number) => accessor(i).length ?? 1
    : (i: number) => data[i][prop] ?? 1
  );

  const chunks = [];
  const groups = [];

  for (let i = 0; i < itemCount; ++i) {
    const [c, g] = toMultiCompositeChunks(get(i + skip));
    chunks.push(...c);
    groups.push(...g);
  }

  const count = chunks.reduce((a, b) => a + b, 0);
  return [count, chunks, groups];
};
