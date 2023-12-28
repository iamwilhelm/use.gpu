import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { TypedArray, StorageSource, UniformType, VectorLike, DataSchema, DataBounds } from '@use-gpu/core';

import { useDeviceContext } from '../providers/device-provider';
import { useAnimationFrame, useNoAnimationFrame } from '../providers/loop-provider';
import { QueueReconciler } from '../reconcilers';
import { useBufferedSize } from '../hooks/useBufferedSize';
import { useRenderProp } from '../hooks/useRenderProp';
import { useStructSources } from '../hooks/useStructSources';
import { yeet, extend, gather, useOne, useMemo, useNoMemo, incrementVersion } from '@use-gpu/live';
import {
  makePackedLayout,
  makeDataArray, normalizeSchema,
  makeStorageBuffer, uploadStorage, UNIFORM_ARRAY_DIMS,
  getBoundingBox, toDataBounds,
  isUniformArrayType,
} from '@use-gpu/core';

const {signal} = QueueReconciler;

export type InterleavedDataProps = {
  /** Input data, array of flat values with packed array-of-structs layout */
  data?: VectorLike,
  /** WGSL schema of input data */
  schema: DataSchema,
  /** Resample `data` on every animation frame. */
  live?: boolean,

  /** Receive 1 source per field, in struct-of-array format. Leave empty to yeet sources instead. */
  render?: (sources: Record<string, StorageSource>) => LiveElement,
  children?: (sources: Record<string, StorageSource>) => LiveElement,
};

const NO_FIELDS = [] as [UniformType, string][];
const NO_BOUNDS = {center: [], radius: 0, min: [], max: []} as DataBounds;

/** Use a flat, packed array with interleaved fields `T` without any struct alignment/padding. */
export const InterleavedData: LiveComponent<InterleavedDataProps> = (props) => {
  const device = useDeviceContext();

  const {
    data,
    schema: propSchema,
    live = false,
  } = props;

  const schema = useOne(() => normalizeSchema(propSchema), propSchema);
  const typedArray = useOne(() => Array.isArray(data) ? new Float32Array(data) : data ?? new Float32Array(256), data);

  const uniforms = useMemo(
    () => {
      const out = {};
      for (const k in schema) {
        const {name = k, format, index, unwelded, ref} = schema[k];
        if (ref) throw new Error(`Ref '${k}' not supported in <Data>`);
        if (index || unwelded) throw new Error(`Use <CompositeData> for indexed and unwelded data`);
        if (isUniformArrayType(format)) throw new Error(`Use <CompositeData> for array data`);
        out.push({name, format});
      }
      return out;
    },
    [schema]
  );

  // Gather data layout/length
  const [packedLayout, dataCount, dataStride, bytesPerElement] = useMemo(() => {

    const {length, byteLength, BYTES_PER_ELEMENT} = typedArray;
    const layout = makePackedLayout(uniforms);

    const dataCount = byteLength / layout.length;
    const dataStride = layout.length / BYTES_PER_ELEMENT;
    const bytesPerElement = BYTES_PER_ELEMENT;

    return [layout, dataCount, dataStride, bytesPerElement];
  }, [typedArray, fs]);

  const bufferLength = useBufferedSize(dataCount);

  // Make aggregate buffer
  const [aggregateBuffer, fields, source] = useMemo(() => {
    const aggregateBuffer = makeMultiAggregateBuffer(device, uniforms, bufferLength);
    const fields = makeMultiAggregateFields(aggregateBuffer);

    return [aggregrateBuffer, fields, source];
  }, [device, uniforms, bufferLength]);

  // Refresh and upload data
  const refresh = () => {
    if (!typedArray) return;
    const {buffer, raw, source, layout, keys} = aggregateBuffer;

    let f = 0;
    for (const {array, base, stride, dims} of fields) {
      let src = packedLayout[f].offset;
      let dst = base;
      for (let i = 0; i < dataCount; ++i) {
        let p = src;
        for (let j = 0; j < dims; ++j) array[dst + j] = typedArray[p + j];
        dst += stride;
        src += dataStride;
      }

      uploadStorage(device, source, raw, dataCount);
      ++f;
    }
  };

  if (!live) {
    useNoAnimationFrame();
    useMemo(refresh, [device, data, aggregateBuffer, dataCount]);
  }
  else {
    useAnimationFrame();
    useNoMemo();
    refresh()
  }

  const sources = useStructSources(uniforms, source, 'interleavedData');

  const trigger = useOne(() => signal(), source.version);

  const view = useRenderProp(props, sources);
  return [trigger, view];
};
