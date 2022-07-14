import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { StorageSource, LambdaSource, TypedArray, UniformType, Emit } from '@use-gpu/core/types';
import { ShaderSource } from '@use-gpu/shader/types';

import { provide, yeet, useMemo, useNoMemo, useOne, useNoOne, useContext, useNoContext, incrementVersion } from '@use-gpu/live';
import {
  makeDataArray, copyNumberArray, emitIntoNumberArray, 
  makeStorageBuffer, uploadBuffer, UNIFORM_ARRAY_DIMS,
} from '@use-gpu/core';

import { DeviceContext } from '../providers/device-provider';
import { usePerFrame, useNoPerFrame } from '../providers/frame-provider';
import { useAnimationFrame, useNoAnimationFrame } from '../providers/loop-provider';
import { useTimeContext } from '../providers/time-provider';
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
  expr?: (emit: Emit, i: number, n: number) => void,
  items?: number,
  split?: boolean,

  format?: string,
  live?: boolean,

  render?: (...source: ShaderSource[]) => LiveElement<any>,
  children?: LiveElement<any>,
};

export const RawData: LiveComponent<RawDataProps> = (props) => {
  const device = useContext(DeviceContext);
  const time = useTimeContext();

  const {
    format, length,
    data, expr,
    render,
    items = 1,
    split = false,
    sparse = false,
    live = false,
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
  if (split) {
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

  // Refresh and upload data
  const refresh = () => {
    let emitted = 0;

    if (data) copyNumberArray(data, array, dims);
    if (expr) emitted = emitIntoNumberArray(expr, array, dims, time);
    if (data || expr) {
      uploadBuffer(device, buffer, array.buffer);
    }

    source.length  = !sparse ? count : emitted;
    source.size    = !sparse ? (items > 1 ? [items, count] : count) : [items, emitted / items];
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
    useNoPerFrame();
    useNoAnimationFrame();
    useMemo(refresh, [device, buffer, array, data, expr, count, dims]);
  }
  else {
    usePerFrame();
    useAnimationFrame();
    useNoMemo();
    refresh();
  }

  if (sources) return useMemo(() => render ? render(...sources!) : yeet(sources!), [render, sources]);
  return useMemo(() => render ? render(source) : yeet(source), [render, source]);
};
