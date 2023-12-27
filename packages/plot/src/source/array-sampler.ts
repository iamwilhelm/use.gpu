import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { DataBounds, TensorArray, TypedArray, StorageSource, UniformType, Emit, Emitter } from '@use-gpu/core';

import { provide, yeet, signal, useOne, useMemo, useNoMemo } from '@use-gpu/live';
import { makeTensorArray, copyNumberArray, emitIntoMultiNumberArray, toCPUDims, updateTensor } from '@use-gpu/core';

import {
  useTimeContext, useNoTimeContext,
  useAnimationFrame, useNoAnimationFrame,
  useBufferedSize, getRenderFunc,
} from '@use-gpu/workbench';
import { useRangeContext, useNoRangeContext } from '../providers/range-provider';
import { useDataContext, DataContext } from '../providers/data-provider';

export type ArraySamplerProps = {
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
  /** Emit 0 or N items per `expr` call. Output size is `[emitted]` or `[items, emitted]`. */
  sparse?: boolean,
  /** Add current `TimeContext` to the `expr` arguments. */
  time?: boolean,
  /** Resample `data` or `expr` on every animation frame. */
  live?: boolean,

  /** Inject into DataContext under this key */
  as?: string,

  /** Omit to provide data context instead. */
  render?: (data: TensorArray) => LiveElement,
  children?: (data: TensorArray) => LiveElement,
};

const NO_BOUNDS = {center: [], radius: 0, min: [], max: []} as DataBounds;

/** Sample up-to-4D array of a WGSL type. Reads input `data` or samples a given `expr`. */
export const ArraySampler: LiveComponent<ArraySamplerProps> = (props) => {
  const {
    format,
    size,
    data,
    expr,
    children,
    as = 'positions',
    sparse = false,
    live = false,
    time = false,
  } = props;

  const items = Math.max(1, Math.round(props.items) || 0);

  const length = items * size.reduce((a, b) => a * b, 1);
  const alloc = useBufferedSize(length);

  // Make tensor array
  const tensor = useMemo(() => makeTensorArray(format, alloc, size), [format, alloc, size]);

  // Provide time for expr
  const clock = time && expr ? useTimeContext() : useNoTimeContext();

  // Refresh data
  const refresh = () => {
    const {array, dims} = tensor;

    let emitted = 0;
    if (data?.length) copyNumberArray(data, array, toCPUDims(dims), toCPUDims(dims));
    if (expr && size.length) {
      emitted = emitIntoMultiNumberArray(expr, array, dims, size, clock!);
    }

    const length  = !sparse ? length : emitted;
    const size    = !sparse ? (items > 1 ? [items, ...size] : size) : (items > 1 ? [items, emitted / items] : [emitted / items]);
    updateTensor(tensor, length, size);

    return {...tensor};
  };

  let value;
  if (!live) {
    useNoAnimationFrame();
    value = useMemo(refresh, [tensor, expr, items]);
  }
  else {
    useAnimationFrame();
    useNoMemo();
    value = refresh();
  }

  const render = getRenderFunc(props);

  const dataContext = useDataContext();
  const context = !render && children ? useMemo(() => ({...dataContext, [as]: value}), [dataContext, value, as]) : useNoMemo();

  return render ? render(tensor) : children ? provide(DataContext, context, children) : yeet(tensor);
};
