import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { TypedArray, StorageSource, UniformType } from '@use-gpu/core/types';
import { RenderContext, FrameContext } from '@use-gpu/components';
import { yeet, useMemo, useSomeMemo, useNoMemo, useContext, useSomeContext, useNoContext } from '@use-gpu/live';
import {
  makeDataEmitter, makeDataArray, copyNumberArray, emitIntoNumberArray, 
  makeStorageBuffer, uploadBuffer, UNIFORM_DIMS,
} from '@use-gpu/core';

export type RawDataProps = {
  length?: number,
  data?: number[] | TypedArray,
  expr?: (emit: Emitter, i: number, n: number) => void,
  type?: string,
  live: boolean,

  render?: (source: StorageSource) => LiveElement<any>,
};

export const RawData: LiveComponent<RawDataProps> = (fiber) => (props) => {
  const {device} = useContext(RenderContext);

  const {
    type, length,
    data, expr,
    live,
    render,
  } = props;

  const t = type in UNIFORM_DIMS ? type as UniformType : 'float';
  const l = length ?? data.length;

  // Make data buffer
  const [buffer, array, source, dims] = useMemo(() => {
    const {array, dims} = makeDataArray(type, l);
    if (dims === 3) throw new Error("Dims must be 1, 2, or 4");

    const buffer = makeStorageBuffer(device, array.byteLength);
    const source = {
      buffer,
      type: t,
      length: l,
    };

    return [buffer, array, source, dims] as [GPUBuffer];
  }, [device, t, l]);

  if (!live) {
    useNoContext(FrameContext);
    useSomeMemo(() => {
      if (data) copyNumberArray(data, array);
      if (expr) emitIntoNumberArray(expr, array, dims);
      uploadBuffer(device, buffer, array.buffer);
    }, [device, buffer, array, data, expr, dims]);
  }
  else {
    useSomeContext(FrameContext);
    useNoMemo();
    if (data) copyNumberArray(data, array);
    if (expr) emitIntoNumberArray(expr, array, dims);
    uploadBuffer(device, buffer, array.buffer);
  }

  return render ? render(source) : null;
};
