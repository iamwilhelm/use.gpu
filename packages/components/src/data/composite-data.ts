import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { TypedArray, StorageSource, UniformType, Accessor, DataField } from '@use-gpu/core/types';
import { RenderContext, FrameContext } from '@use-gpu/components';
import { yeet, useMemo, useSomeMemo, useNoMemo, useContext, useSomeContext, useNoContext } from '@use-gpu/live';
import {
  makeDataArray, makeDataAccessor,
  copyDataArray, copyNumberArray,
  copyDataArrays, copyNumberArrays,
  copyDataArrayChunked, copyNumberArrayChunked,
  makeStorageBuffer, uploadBuffer, UNIFORM_DIMS,
} from '@use-gpu/core';

export type DataProps = {
  length?: number,
  data?: any[],
  fields?: DataField[],
  live?: boolean,

  render?: (sources: StorageSource[]) => LiveElement<any>,
};

const NO_FIELDS = [] as DataField[];

const isComposite = (format: string) => !!format.match(/\[\]$/);
const toSimple = (format: string) => format.replace(/\[\]$/, '');

export const CompositeData: LiveComponent<DataProps> = (fiber) => (props) => {
  const {device} = useContext(RenderContext);

  const {
    data,
    fields,
    render,
    live = false,
  } = props;

  const fs = fields ?? NO_FIELDS;

  // Gather data length
  const [chunks, length] = useMemo(() => {

    // Count simple array lengths as fallback
    // in case of no composite field.
    let l = fs.reduce((l, [, accessor]) => {
      if (l != null) return l;
      if (typeof accessor === 'object') return accessor?.length;
      return null;
    });

    // Look for first composite field
    const composites = fs.filter(([format]) => isComposite(format));
    const [composite] = composites;
    if (!composite) return [data?.length || l || 0];

    // Read out chunk lengths
    const [f, accessor] = composite;
    const chunks = [] as number[];
    let {raw, length: l, fn} = makeDataAccessor(f, accessor);

    if (raw && l != null) for (let i = 0; i < l; ++i) {
      chunks.push(raw[i]?.length || 0);
    }
    else if (fn) for (const v of data) {
      const list = fn(v);
      chunks.push(list?.length || 0);
    }

    const length = chunks.reduce((a, b) => a + b) || 0;
    return [chunks, length];
  }, [data, fs]);

  // Make data buffers
  const [fieldBuffers, fieldSources] = useMemo(() => {
    const l = length;

    const fieldBuffers = fs.map(([format, accessor]) => {
      const composite = isComposite(format);
      format = toSimple(format);

      if (!(format in UNIFORM_DIMS)) throw new Error(`Unknown data format "${format}"`);
      const f = format as any as UniformType;

      let {raw, length, fn} = makeDataAccessor(f, accessor);
      if (length == null) length = l;

      const {array, dims} = makeDataArray(f, length);
      if (dims === 3) throw new Error("Dims must be 1, 2, or 4");

      const buffer = makeStorageBuffer(device, array.byteLength);
      const source = {
        buffer,
        format,
        length,
        live,
        chunks,
      };

      return {buffer, array, source, dims, accessor: fn, raw, composite};
    });
    const fieldSources = fieldBuffers.map(f => f.source);
    return [fieldBuffers, fieldSources];
  }, [device, fs, chunks, length]);
  
  const refresh = () => {
    for (const {buffer, array, dims, accessor, raw, composite} of fieldBuffers) if (raw || data) {
      if (composite) {
        if (raw) copyNumberArrays(raw, array);
        else if (data) copyDataArrays(data, array, dims, accessor as Accessor);
      }
      else {
        if (raw) copyNumberArrayChunked(raw, array, dims, chunks);
        else if (data) copyDataArrayChunked(data, array, dims, chunks, accessor as Accessor);
      }
      uploadBuffer(device, buffer, array.buffer);
    }
  };
  
  if (!live) {
    useNoContext(FrameContext);
    useSomeMemo(refresh, [device, data, fieldBuffers]);
  }
  else {
    useSomeContext(FrameContext);
    useNoMemo();
    refresh()
  }

  return useMemo(() => render ? render(fieldSources) : yeet(fieldSources), [render, fieldSources]);
};
