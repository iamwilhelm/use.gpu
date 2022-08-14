import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { StorageSource, LambdaSource, TypedArray, UniformType, Emit, Emitter, Time } from '@use-gpu/core';
import type { ShaderSource } from '@use-gpu/shader';

import { provide, yeet, quote, useMemo, useNoMemo, useOne, useNoOne, useContext, useNoContext, incrementVersion } from '@use-gpu/live';
import {
  makeDataArray, copyNumberArray, emitIntoNumberArray, 
  makeStorageBuffer, uploadBuffer, UNIFORM_ARRAY_DIMS,
} from '@use-gpu/core';

import { DeviceContext } from '../providers/device-provider';
import { useAnimationFrame, useNoAnimationFrame } from '../providers/loop-provider';
import { useTimeContext, useNoTimeContext } from '../providers/time-provider';
import { useBufferedSize } from '../hooks/useBufferedSize';
import { useBoundSource, useNoBoundSource } from '../hooks/useBoundSource';
import { getBoundShader } from '../hooks/useBoundShader';

import { bundleToAttributes, chainTo } from '@use-gpu/shader/wgsl';
import { getIndex } from '@use-gpu/wgsl/instance/interleave.wgsl';

const INTERLEAVE_BINDINGS = bundleToAttributes(getIndex);

const seq = (n: number, start: number = 0, step: number = 1) => Array.from({length: n}).map((_, i) => start + i * step);

export type RawDataProps = {
  length?: number,
  data?: number[] | TypedArray,

  sparse?: boolean,
  expr?: Emitter<Time>,
  items?: number,
  interleaved?: boolean,

  format?: string,
  live?: boolean,
  time?: boolean,

  render?: (...source: ShaderSource[]) => LiveElement,
  children?: LiveElement,
};

export const RawData: LiveComponent<RawDataProps> = (props) => {
  const device = useContext(DeviceContext);

  const {
    format, length,
    data, expr,
    render,
    items = 1,
    interleaved = false,
    sparse = false,
    live = false,
    time = false,
  } = props;

  const t = Math.max(1, Math.round(items) || 0);
  const count = t * (length ?? (data?.length || 0));
  const l = useBufferedSize(count);

  // Make data buffer
  const [buffer, array, source, dims] = useMemo(() => {
    const f = (format && (format in UNIFORM_ARRAY_DIMS)) ? format as UniformType : 'f32';

    const {array, dims} = makeDataArray(f, l || 1);

    const buffer = makeStorageBuffer(device, array.byteLength);
    const source = {
      buffer,
      format: f,
      length: 0,
      size: [0],
      version: 0,
    };

    return [buffer, array, source, dims] as [GPUBuffer, TypedArray, StorageSource, number];
  }, [device, format, l]);

  // Make de-interleaving shader
  let sources: LambdaSource[] | undefined;
  if (interleaved) {
    const binding = useOne(() => ({name: 'getData', format: format as any as UniformType}), format);
    const getData = useBoundSource(binding, source);
    sources = useMemo(() => (
      seq(t).map(i => ({
        shader: chainTo(getBoundShader(getIndex, INTERLEAVE_BINDINGS, [i, t]), getData),
        length: 0,
        size: [0],
        version: 0,
      }))
    ), [t, getData]);
  }
  else {
    useNoOne();
    useNoBoundSource();
    useNoMemo();
  }

  // Provide time for expr
  const clock = time && expr ? useTimeContext() : useNoTimeContext();

  // Refresh and upload data
  const refresh = () => {
    let emitted = 0;

    if (data) copyNumberArray(data, array, dims);
    if (expr) emitted = emitIntoNumberArray(expr, array, dims, clock!);
    if (data || expr) {
      uploadBuffer(device, buffer, array.buffer);
    }

    source.length  = !sparse ? count : emitted;
    source.size    = !sparse ? (items > 1 ? [items, count] : [count]) : [items, emitted / items];
    source.version = incrementVersion(source.version);

    if (sources) {
      for (const s of sources) {
        s.length  = source.length / t;
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

  const signal = useOne(() => quote(yeet()), source.version);
  const view = sources
    ? useMemo(() => render ? render(...sources!) : yeet(sources!), [render, sources])
    : useMemo(() => render ? render(source) : yeet(source), [render, source]);
  return [signal, view];
};
