import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { ArrowFunction, TypedArray, StorageSource, UniformType, Accessor, DataSchema, DataField, DataBounds } from '@use-gpu/core';

import { useDeviceContext } from '../providers/device-provider';
import { useAnimationFrame, useNoAnimationFrame } from '../providers/loop-provider';
import { useAggregator } from '../hooks/useAggregator';
import { useBufferedSize } from '../hooks/useBufferedSize';
import { yeet, extend, signal, gather, useOne, useMemo, useNoMemo, useCallback, useYolo, useNoYolo, incrementVersion } from '@use-gpu/live';
import {
  pick,
  seq,
  isUniformArrayType,
  getUniformArrayDepth,
  makeDataArray2,
  copyRecursiveNumberArray2,

  schemaToArchetype,
  schemaToEmitters,
  getAggregateSummary,
} from '@use-gpu/core';
import { parseMultiChunks } from '@use-gpu/parse';

type BooleanList = boolean | boolean[] | (<T>(i: number) => boolean);

export type DataSegmentsArgs = {
  positions: TypedArray,
  chunks: number[] | TypedArray,
  groups: number[] | TypedArray,
  loops: boolean[] | boolean,
  starts: boolean[] | boolean,
  ends: boolean[] | boolean,
};

export type Data2Props = {
  /** WGSL schema of input data + accessors */
  schema?: DataSchema,
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
  segments?: (args: DataSegmentsArgs) => Record<string, any>,

  /** Receive 1 source per field, in virtual struct-of-array format. Leave empty to yeet sources instead. */
  render?: (sources: Record<string, StorageSource>) => LiveElement,
};

const NO_SCHEMA = {} as DataSchema;
const NO_BOUNDS = {center: [], radius: 0, min: [], max: []} as DataBounds;

/** Aggregate array-of-structs with fields `T | T[]` into grouped storage sources. */
export const Data2: LiveComponent<Data2Props> = (props) => {
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
    render,
    segments,
    live = false,
  } = props;

  const data = propData ? Array.isArray(propData) ? propData : [propData] : null;

  // Identify an array and index field (if any)
  const [countKey, indexedKey, isArray, isIndexed] = useMemo(() => {
    const keys = Object.keys(schema);
    const countKey = keys.find(k => isUniformArrayType(schema[k].format as any));
    const indexedKey = keys.find(k => schema[k].index);

    const isArray = !!countKey;
    const isIndexed = !!indexedKey;

    return [
      countKey ?? keys[0],
      indexedKey,
      isArray,
      isIndexed,
    ];
  }, [schema]);
  
  // Resolve segment flags
  const itemCount = Math.max(0, (count ?? data?.length) - skip);
  
  const [loops, starts, ends] = useMemo(() => {
    const loops  = resolveSegmentFlag(itemCount, loop, skip);
    const starts = resolveSegmentFlag(itemCount, start, skip);
    const ends   = resolveSegmentFlag(itemCount, end, skip);

    return [loops, starts, ends];
  }, [itemCount, loop, start, end]);

  // Resolve counts
  const [chunks, groups, vertexCount, indexCount] = useMemo(() => {
    let chunks = null;
    let groups = null;
    let vertexCount = itemCount
    let indexCount = itemCount;

    if (isArray && !segments) {
      const countAccessor = virtual?.[countKey];

      if (countAccessor) chunks = seq(itemCount).map(i => countAccessor(i + skip).length ?? 1);
      else chunks = seq(itemCount).map(i => data[i + skip][countKey].length ?? 1);

      vertexCount = chunks.reduce((a, b) => a + b, 0);

      if (indexedKey) {
        const indexAccessor = virtual?.[indexedKey];

        if (countAccessor) chunks = seq(itemCount).map(i => indexAccessor(i + skip).length ?? 1);
        else chunks = seq(itemCount).map(i => data[i + skip][indexKey].length ?? 1);

        indexCount = chunks.reduce((a, b) => a + b, 0);
      }
    }

    return [chunks, groups, vertexCount, indexedKey ? indexCount : vertexCount];
  }, [isArray, segments, itemCount, countKey, indexedKey, virtual, data]);

  console.log({data, countKey, indexedKey, itemCount, vertexCount, indexCount})

  // Make arrays for merged attributes
  const [fields, attributes, archetype] = useMemo(() => {
    const nv = vertexCount;
    const ni = indexCount;

    const fields = {};
    const attributes = {};

    for (const k in schema) {
      const {format, prop = k, index, unwelded, ref} = schema[k];
      if (ref) throw new Error(`Ref '${k}' not supported in <Data>`);

      const {array, dims} = makeDataArray2(format, (index || unwelded) ? ni : nv);
      const depth = getUniformArrayDepth(format);

      fields[k] = {array, dims, depth, prop};
      attributes[k] = array;
    }

    const archetype = schemaToArchetype(schema, attributes);

    return [fields, attributes, archetype];
  }, [schema, vertexCount, indexCount]);

  // Blit all data into merged arrays
  const update = useCallback((
    data?: Record<string, any> | (Record<string, any>)[],
    virtual?: Record<string, (i: number) => any>,
  ) => {
    for (const k in fields) {
      const {array, dims, depth, prop} = fields[k];
      const accessor = virtual?.[k];

      let o = 0;
      if (accessor) {
        for (let i = 0; i < itemCount; ++i) {
          o += copyRecursiveNumberArray2(accessor(i), array, dims, depth, 0, o, 1);
        }
      }
      else if (data) {
        for (let i = 0; i < itemCount; ++i) {
          const values = data[i][prop];
          o += copyRecursiveNumberArray2(values, array, dims, depth, 0, o, 1);
        }
      }
    }
  }, [fields]);

  // Get emitters for data + segment data
  const [emitters, total, indexed, sparse] = useMemo(() => {
    if (!segments) return [schemaToEmitters(schema, attributes), vertexCount, indexCount, 0];

    const positions = fields[countKey].array;

    const segmentData = segments({
        chunks: chunks!,
        groups: groups!,
        positions,
        loops,
        starts,
        ends,
    });

    const {count: total, indexed, sparse, ...rest} = segmentData;
    const emitters = schemaToEmitters(schema, {...attributes, ...rest});

    return [emitters, total, indexed, sparse];
  }, [schema, fields, countKey, attributes, segments, chunks, groups, loops, starts, ends]);

  // Refresh data set to aggregate
  const items = useMemo(() => [{
    count: total,
    indexed,
    archetype,
    attributes: emitters,
  }], [total, indexed, archetype, emitters, data, virtual ? (version ?? NaN) : null]);
  useOne(() => update(data, virtual), items);

  const {count: aggregated, sources, uploadRefs} = useAggregator(schema, items);
  console.log('item', {item: items[0], emitters, total, indexed})

  if (live) useAnimationFrame();
  else useNoAnimationFrame();

  const trigger = useOne(() => signal(), items);

  const view = useYolo(() => render ? render(sources) : yeet(sources), [render, sources]);
  return [trigger, view];
};

const resolveSegmentFlag = (count: number, flag: Boolean, skip: number = 0) => {
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

