import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { DataBounds, TypedArray, StorageSource, VectorLike, UniformType, Emit, Emitter } from '@use-gpu/core';

import { provide, yeet, signal, useOne, useMemo, useNoMemo } from '@use-gpu/live';
import {
  makeTensorArray, emitMultiArray, makeNumberWriter, updateTensor,
  getBoundingBox, toDataBounds,
  toCPUDims, toGPUDims,
} from '@use-gpu/core';
import { parseAxis, parseVec4 } from '@use-gpu/parse';
import { optional, useProp } from '@use-gpu/traits/live';
import {
  useTimeContext, useNoTimeContext,
  useAnimationFrame, useNoAnimationFrame,
  useBufferedSize, getRenderFunc,
} from '@use-gpu/workbench';
import { useRangeContext, useNoRangeContext } from '../providers/range-provider';
import { useDataContext, DataContext } from '../providers/data-provider';

export type SamplerProps = {
  /** Sample count up to [width, height, depth, layers] */
  size?: number[],
  /** Shorthand for size=[length] */
  length?: number,

  /** Axis to sample on (1D) */
  axis?: string,
  /** Axes to sample on (2D+) */
  axes?: string,
  /** Sample origin to maintain alignment to */
  origin?: VectorLike,

  /** WGSL type per sample */
  format?: string,

  /** Input emitter expression */
  expr?: Emitter,
  /** Input range to sample on each axis. Use RangeContext if omitted. */
  range?: [number, number][],
  /** Extra padding samples to add outside the input range. */
  padding?: number,
  /** Emit N items per `expr` call. Output size is `[items, ...size]` if > 1. */
  items?: number,
  /** Emit 0 or N items per `expr` call. Output size is `[N]` or `[items, N]`. */
  sparse?: boolean,
  /** Use centered samples (0.5, 1.5, ..., N-0.5) instead of edge-to-edge samples (0, 1, ..., N). */
  centered?: boolean[] | boolean,
  /** Add current indices `i`, `j`, `k`, `l` to the `expr` arguments. */
  index?: boolean,
  /** Add current `TimeContext` to the `expr` arguments. */
  time?: boolean,
  /** Resample `data` or `expr` on every animation frame. */
  live?: boolean,

  /** Inject into DataContext under this key(s) */
  as?: string | string[],

  /** Leave empty to yeet source instead. */
  render?: (source: StorageSource) => LiveElement,
  children?: (source: StorageSource) => LiveElement,
};

const NO_BOUNDS = {center: [], radius: 0, min: [], max: []} as DataBounds;

/** Up-to-4D array of a WGSL type. Samples a given `expr` on the given `range`. */
export const Sampler: LiveComponent<SamplerProps> = (props) => {
  const {
    axis,
    axes = 'xyzw',
    format,
    length: l = 0,
    size = [l],
    expr,
    children,
    as = 'positions',
    padding = 0,
    sparse = false,
    centered = false,
    live = false,
    index = false,
    time = false,
  } = props;

  const parentRange = props.range ? (useNoRangeContext(), props.range) : useRangeContext();
  const items = Math.max(1, Math.round(props.items) || 0);
  const origin = useProp(props.origin, optional(parseVec4));

  const a = axis ?? axes;
  const range = useMemo(() => {
    const basis = a.split('').map(parseAxis);
    return basis.map(i => parentRange[i]);
  }, [parentRange, a]);

  const border = padding + +!!origin;
  const padded = size.map(n => n + border * 2);

  const count = padded.reduce((a, b) => a * b, 1);
  const alloc = useBufferedSize(count);
  const length = items * count;

  // Make tensor array
  const tensor = useMemo(() => makeTensorArray(format, items * alloc, size), [format, items, alloc]);
  tensor.size = size;
  tensor.length = length;

  const clock = time ? useTimeContext() : useNoTimeContext();

  // Refresh and upload data
  const refresh = () => {
    const {array, dims} = tensor;
    let emitted = 0;

    if (expr && size.length) {
      const n = size.length;
      let sampled: Emitter<any>;
      if (n === 1) {
        const c = +!!(centered === true || (centered as any)[0]);
        let [min, max] = range[0];
        let step = (max - min) / (size[0] - 1 + c);
        let align = origin ? (min - origin[0]) % step : 0;
        if (c) min += step / 2;
        min -= step * border + align;

        if (index) {
          sampled = (<T>(emit: Emit, i: number, t: T) =>
            expr(emit, min + i * step, i - border, t)) as any;
        }
        else {
          sampled = (<T>(emit: Emit, i: number, t: T) =>
            expr(emit, min + i * step, i - border, t)) as any;
        }
      }
      else if (n === 2) {
        const cx = +!!(centered === true || (centered as any)[0]);
        const cy = +!!(centered === true || (centered as any)[1]);

        let [minX, maxX] = range[0];
        let [minY, maxY] = range[1];
        let stepX = (maxX - minX) / (size[0] - 1 + cx);
        let stepY = (maxY - minY) / (size[1] - 1 + cy);
        let alignX = origin ? (minX - origin[0]) % stepX : 0;
        let alignY = origin ? (minY - origin[1]) % stepY : 0;
        if (cx) minX += stepX / 2;
        if (cy) minY += stepY / 2;
        minX -= stepX * border + alignX;
        minY -= stepY * border + alignY;

        if (index) {
          sampled = (<T>(emit: Emit, i: number, j: number, t: T) =>
            expr(
              emit,
              minX + i * stepX,
              minY + j * stepY,
              i - border,
              j - border,
              t,
            )) as any;
        }
        else {
          sampled = (<T>(emit: Emit, i: number, j: number, t: T) =>
            expr(
              emit,
              minX + i * stepX,
              minY + j * stepY,
              t,
            )) as any;
        }
      }
      else if (n === 3) {
        const cx = +!!(centered === true || (centered as any)[0]);
        const cy = +!!(centered === true || (centered as any)[1]);
        const cz = +!!(centered === true || (centered as any)[2]);

        let [minX, maxX] = range[0];
        let [minY, maxY] = range[1];
        let [minZ, maxZ] = range[2];
        let stepX = (maxX - minX) / (size[0] - 1 + cx);
        let stepY = (maxY - minY) / (size[1] - 1 + cy);
        let stepZ = (maxZ - minZ) / (size[2] - 1 + cz);
        if (cx) minX += stepX / 2;
        if (cy) minY += stepY / 2;
        if (cz) minZ += stepZ / 2;
        minX -= stepX * border;
        minY -= stepY * border;
        minZ -= stepZ * border;

        if (index) {
          sampled = (<T>(emit: Emit, i: number, j: number, k: number, t: T) =>
            expr(
              emit,
              minX + i * stepX,
              minY + j * stepY,
              minZ + k * stepZ,
              i - border,
              j - border,
              k - border,
              t,
            )) as any;
        }
        else {
          sampled = (<T>(emit: Emit, i: number, j: number, k: number, t: T) =>
            expr(
              emit,
              minX + i * stepX,
              minY + j * stepY,
              minZ + k * stepZ,
              t,
            )) as any;
        }
      }
      else if (n === 4) {
        const cx = +!!(centered === true || (centered as any)[0]);
        const cy = +!!(centered === true || (centered as any)[1]);
        const cz = +!!(centered === true || (centered as any)[2]);
        const cw = +!!(centered === true || (centered as any)[3]);

        let [minX, maxX] = range[0];
        let [minY, maxY] = range[1];
        let [minZ, maxZ] = range[2];
        let [minW, maxW] = range[3];
        let stepX = (maxX - minX) / (size[0] - 1 + cx);
        let stepY = (maxY - minY) / (size[1] - 1 + cy);
        let stepZ = (maxZ - minZ) / (size[2] - 1 + cz);
        let stepW = (maxW - minW) / (size[3] - 1 + cw);
        if (cx) minX += stepX / 2;
        if (cy) minY += stepY / 2;
        if (cz) minZ += stepZ / 2;
        if (cw) minW += stepW / 2;
        minX -= stepX * border;
        minY -= stepY * border;
        minZ -= stepZ * border;
        minW -= stepW * border;

        if (index) {
          sampled = (<T>(emit: Emit, i: number, j: number, k: number, l: number, t: T) =>
            expr(
              emit,
              minX + i * stepX,
              minY + j * stepY,
              minZ + k * stepZ,
              minW + l * stepW,
              i - border,
              j - border,
              k - border,
              l - border,
              t,
            )) as any;
        }
        else {
          sampled = (<T>(emit: Emit, i: number, j: number, k: number, l: number, t: T) =>
            expr(
              emit,
              minX + i * stepX,
              minY + j * stepY,
              minZ + k * stepZ,
              minW + l * stepW,
              t,
            )) as any;
        }
      }
      else {
        throw new Error("Cannot sample across more than 4 dimensions");
      }

      if (sampled) {
        const emit = makeNumberWriter(tensor, dims);
        emitted = emitMultiArray(sampled, emit, count, padded, clock!);
      }
    }

    const l = !sparse ? length : emitted;
    const s = !sparse ? (items > 1 ? [items, ...padded] : padded) : (items > 1  ? [items, emitted / items] : [emitter / items]);
    updateTensor(tensor, l, s);

    return {...tensor};
  };

  let value;
  if (!live) {
    useNoAnimationFrame();
    value = useMemo(refresh, [tensor, expr, items, range]);
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
