import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { DataBounds, TypedArray, StorageSource, UniformType, Emit, Emitter } from '@use-gpu/core';

import { provide, yeet, signal, useOne, useMemo, useNoMemo, useContext, useNoContext, useHooks, incrementVersion } from '@use-gpu/live';
import {
  makeAggregateBuffer, copyNumberArray, emitIntoMultiNumberArray, uploadStorage,
  getBoundingBox, toDataBounds,
  toCPUDims, toGPUDims,
} from '@use-gpu/core';

import { DeviceContext } from '../providers/device-provider';
import { useTimeContext, useNoTimeContext } from '../providers/time-provider';
import { useAnimationFrame, useNoAnimationFrame } from '../providers/loop-provider';
import { useBufferedSize } from '../hooks/useBufferedSize';
import { useRenderProp } from '../hooks/useRenderProp';

export type ArrayDataProps = {
  /** Input size up to [width, height, depth, layers] */
  size: number[],

  /** WGSL type per sample */
  format?: string,

  /** Input data */
  data?: number[] | TypedArray,
  /** Input emitter expression */
  expr?: Emitter,
  /** Emit N items per `expr` call. Output size is `[items, ...size]` if > 1. */
  items?: number,
  /** Emit 0 or N items per `expr` call. Output size is `[N]` or `[items, N]`. */
  sparse?: boolean,
  /** Add current `TimeContext` to the `expr` arguments. */
  time?: boolean,
  /** Resample `data` or `expr` on every animation frame. */
  live?: boolean,

  /** Leave empty to yeet source instead. */
  render?: (source: StorageSource) => LiveElement,
  children?: (source: StorageSource) => LiveElement,
};

const NO_BOUNDS = {center: [], radius: 0, min: [], max: []} as DataBounds;

/** Up-to-4D array of a WGSL type. Reads input `data` or samples a given `expr`. */
export const ArrayData: LiveComponent<ArrayDataProps> = (props) => {
  const device = useContext(DeviceContext);

  const {
    format,
    size,
    data,
    expr,
    items = 1,
    sparse = false,
    live = false,
    time = false,
  } = props;

  const t = Math.max(1, Math.round(items) || 0);

  const length = t * (size.length ? size.reduce((a, b) => a * b, 1) : (data?.length || 0));
  const alloc = useBufferedSize(length);

  // Make data buffer
  const {buffer, array, source, dims} = useMemo(() => makeAggregateBuffer(device, format, alloc), [device, format, alloc]);

  // Provide time for expr
  const clock = time && expr ? useTimeContext() : useNoTimeContext();

  // Refresh and upload data
  const refresh = () => {
    let emitted = 0;
    if (data?.length) copyNumberArray(data, array, toCPUDims(dims), toGPUDims(dims));
    if (expr && size.length) {
      emitted = emitIntoMultiNumberArray(expr, array, dims, size, clock!);
    }

    const length  = !sparse ? length : emitted;
    const size    = !sparse ? (items > 1 ? [items, ...size] : size) : [items, emitted / items];

    uploadStorage(device, source, length, size);

    const {bounds} = source;
    const b = toDataBounds(getBoundingBox(array, toCPUDims(dims)));
    for (const k in b) bounds![k] = b[k];
  };

  if (!live) {
    useNoAnimationFrame();
    useMemo(refresh, [device, buffer, array, data, expr, dims, length, items]);
  }
  else {
    useAnimationFrame();
    useNoMemo();
    refresh();
  }

  const trigger = useOne(() => signal(), source.version);
  const view = useRenderProp(props, source);
  return [trigger, view];
};
