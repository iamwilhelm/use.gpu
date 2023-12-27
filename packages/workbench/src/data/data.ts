import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { ArrowFunction, TypedArray, StorageSource, UniformType, Accessor, DataSchema, DataField, DataBounds } from '@use-gpu/core';

import { useDeviceContext } from '../providers/device-provider';
import { useAnimationFrame, useNoAnimationFrame } from '../providers/loop-provider';
import { useAggregator } from '../hooks/useAggregator';
import { useBufferedSize } from '../hooks/useBufferedSize';
import { useRenderProp } from '../hooks/useRenderProp';
import { yeet, extend, signal, gather, useOne, useMemo, useNoMemo, useCallback, incrementVersion } from '@use-gpu/live';
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

export type DataProps = {
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

  /** Receive 1 source per field, in virtual struct-of-array format. Leave empty to yeet sources instead. */
  render?: (sources: Record<string, StorageSource>) => LiveElement,
  children?: (sources: Record<string, StorageSource>) => LiveElement,
};

const NO_FIELDS = [] as DataField[];
const NO_BOUNDS = {center: [], radius: 0, min: [], max: []} as DataBounds;

/** Compose array-of-structs with singular fields `T` into WGSL storage. Returns a struct of virtual storage sources. */
export const Data: LiveComponent<DataProps> = (props) => {
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
  const allocItems = useBufferedSize(itemCount);

  // Make arrays for merged attributes
  const [fields, attributes, archetype] = useMemo(() => {
    const fields = {};
    const attributes = {};

    for (const k in schema) {
      const {format, prop = k, index, unwelded, ref} = schema[k];
      if (ref) throw new Error(`Ref '${k}' not supported in <Data>`);
      if (index || unwelded) throw new Error(`Use <CompositeData> for indexed and unwelded data`);
      if (isUniformArrayType(format)) throw new Error(`Use <CompositeData> for array data`);

      const {array, dims} = makeDataArray(format, allocItems);

      fields[k] = {array, dims, prop};
      attributes[k] = array;
    }

    const archetype = schemaToArchetype(schema, attributes);
    return [fields, attributes, archetype];
  }, [schema, allocItems]);

  // Blit all data into merged arrays
  const items = useMemo(() => {
    for (const k in fields) {
      const accessor = virtual?.[k];
      if (!accessor && !data) continue;

      const {array, dims, depth, prop} = fields[k];

      // Keep CPU-only layout, as useAggregator will widen for us
      const dimsIn = toCPUDims(dims);

      let b = 0;
      let o = 0;
      for (let i = 0; i < itemCount; ++i) {
        o += copyNumberArray(accessor ? accessor(i + skip) : data[i + skip][prop], array, dimsIn, dimsIn, 0, o, 1);
      }
    }

    return [{
      count: itemCount,
      archetype,
      attributes,
    }];
  }, [
    live ? NaN : virtual ? (version ?? NaN) : null, data,
    itemCount, skip,
    archetype, attributes,
  ]);

  // Aggregate into struct buffer
  const {sources} = useAggregator(schema, items);
  console.log('item', {item: items[0], emitters, total, indexed, sources})

  // Tag positions with bounds
  useMemo(() => {
    if (!fields.positions) return null;

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
