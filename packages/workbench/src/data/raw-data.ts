import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { StorageSource, LambdaSource, TypedArray, UniformType, Emit, Emitter, Time, DataBounds } from '@use-gpu/core';
import type { ShaderSource } from '@use-gpu/shader';

import { provide, yeet, useMemo, useNoMemo, useOne, useNoOne, useContext, useNoContext, useHooks, incrementVersion } from '@use-gpu/live';
import {
  makeGPUArray, copyNumberArray, emitArray, makeNumberWriter,
  makeStorageBuffer, uploadBuffer, UNIFORM_ARRAY_DIMS,
  getBoundingBox, toDataBounds,
  toCPUDims, toGPUDims,
  seq,
} from '@use-gpu/core';

import { DeviceContext } from '../providers/device-provider';
import { useAnimationFrame, useNoAnimationFrame } from '../providers/loop-provider';
import { useTimeContext, useNoTimeContext } from '../providers/time-provider';
import { QueueReconciler } from '../reconcilers';
import { useBufferedSize } from '../hooks/useBufferedSize';
import { useRenderProp } from '../hooks/useRenderProp';
import { useSource, useNoSource } from '../hooks/useSource';
import { getShader } from '../hooks/useShader';

import { chainTo } from '@use-gpu/shader/wgsl';
import { getInterleaveIndex } from '@use-gpu/wgsl/instance/index/interleave.wgsl';

const {signal} = QueueReconciler;

export type RawDataProps = {
  /** Set/override input length */
  length?: number,

  /** WGSL format per sample */
  format?: string,

  /** Input data */
  data?: number[] | TypedArray,
  /** Input emitter expression */
  expr?: Emitter<Time>,
  /** Emit N items per expr call. Output size is `[items, N]` if items > 1. */
  items?: number,
  /** Emit 0 or N items per expr call. Output size is `[N]` or `[items, N]`. */
  sparse?: boolean,
  /** Resample `data` on every animation frame. */
  live?: boolean,
  /** Add current `TimeContext` to the `expr` arguments. */
  time?: boolean,

  /** Leave empty to yeet source(s) instead. */
  render?: (source: ShaderSource) => LiveElement,
  children?: (source: ShaderSource) => LiveElement,
};

const NO_BOUNDS = {center: [], radius: 0, min: [], max: []} as DataBounds;

/** 1D array of a WGSL type. Reads input `data` or samples a given `expr` of WGSL type `format`. */
export const RawData: LiveComponent<RawDataProps> = (props) => {
  const device = useContext(DeviceContext);

  const {
    format,
    data, expr,
    interleaved = false,
    sparse = false,
    live = false,
    time = false,
  } = props;

  const items = Math.max(1, Math.round(props.items) || 0);
  const count = (props.length ?? (data?.length || 0));
  const length = items * count;
  const alloc = useBufferedSize(count);

  // Make data buffer
  const [buffer, array, source, dims] = useMemo(() => {
    const f = (format && (format in UNIFORM_ARRAY_DIMS)) ? format as UniformType : 'f32';

    const {array, dims} = makeGPUArray(f, alloc || 1);

    const buffer = makeStorageBuffer(device, array.byteLength);
    const source = {
      buffer,
      format: f,
      length: 0,
      size: [0],
      version: 0,
      bounds: {...NO_BOUNDS},
    };

    return [buffer, array, source, dims] as [GPUBuffer, TypedArray, StorageSource, number];
  }, [device, format, alloc]);

  // Make de-interleaving shader
  let sources: LambdaSource[] | undefined;
  if (interleaved) {
    const binding = useOne(() => ({name: 'getData', format: format as any as UniformType}), format);
    const getData = useSource(binding, source);
    sources = useMemo(() => (
      seq(t).map(i => ({
        shader: chainTo(getShader(getInterleaveIndex, [i, t]), getData),
        length: 0,
        size: [0],
        version: 0,
        bounds: source.bounds,
      }))
    ), [t, getData]);
  }
  else {
    useNoOne();
    useNoSource();
    useNoMemo();
  }

  // Provide time for expr
  const clock = time && expr ? useTimeContext() : useNoTimeContext();

  // Refresh and upload data
  const refresh = () => {
    let emitted = 0;

    if (data) copyNumberArray(data, array, toCPUDims(dims), toGPUDims(dims));
    if (expr) {
      emitArray(expr, makeNumberWriter(array, dims), count, clock!);
    }
    if (data || expr) {
      uploadBuffer(device, buffer, array.buffer);
    }

    source.length  = !sparse ? count : emitted;
    source.size    = !sparse ? (items > 1 ? [items, count] : [count]) : [items, emitted / items];
    source.version = incrementVersion(source.version);

    const {bounds} = source;
    const {center, radius, min, max} = toDataBounds(getBoundingBox(array, Math.ceil(dims)));
    bounds!.center = center;
    bounds!.radius = radius;
    bounds!.min = min;
    bounds!.max = max;

    if (sources) {
      for (const s of sources) {
        s.length  = source.length / items;
        s.size    = source.size.slice(1);
        s.version = source.version;
      }
    }
  };

  if (!live) {
    useNoAnimationFrame();
    useMemo(refresh, [device, buffer, array, data, expr, count, dims]);
  }
  else {
    useAnimationFrame();
    useNoMemo();
    refresh();
  }

  const trigger = useOne(() => signal(), source.version);
  const view = useRenderProp(props, sources ?? source);
  return [trigger, view];
};
