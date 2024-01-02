import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { DataSchema, MultiAggregateBuffer, TypedArray, StorageSource, UniformType } from '@use-gpu/core';
import { capture, yeet, useCapture, useNoCapture, useMemo, useOne, useRef, useResource, useNoResource, incrementVersion, makeCapture } from '@use-gpu/live';
import {
  makeIdAllocator,
  makeGPUArray, copyNumberArray,

  normalizeSchema,
  makeAggregateBuffer,
  makeMultiAggregateBuffer,
  makeMultiAggregateFields,
  uploadStorage,
  getBoundingBox, toDataBounds,
  isUniformArrayType,

  makeStorageBuffer, uploadBuffer, uploadBufferRange, UNIFORM_ARRAY_DIMS,
  toCPUDims, toGPUDims,
} from '@use-gpu/core';

import { useDeviceContext } from '../providers/device-provider';
import { QueueReconciler } from '../reconcilers';
import { useBufferedSize } from '../hooks/useBufferedSize';
import { getStructAggregate } from '../hooks/useStructSources';
import { getInstancedAggregate } from '../hooks/useInstancedSources';

const {signal} = QueueReconciler;

type Queued = {instance: number, data: Record<string, any>};
type FieldBuffer = {
  buffer: GPUBuffer,
  array: TypedArray,
  source: StorageSource,
  dims: number,
  accessor: string,
};

export type InstanceDataProps = {
  format?: 'u16' | 'u32',
  schema: DataSchema,
  reserve?: number,

  render?: (useInstance: () => (data: Record<string, any>) => void) => LiveElement,
  then?: (indices: StorageSource, data: StorageSource[]) => LiveElement,
};

export const useNoInstance = () => {
  useNoResource();
  useNoCapture();
  useNoOne();
};

export const InstanceData: LiveComponent<InstanceDataProps> = (props) => {
  const {
    schema: propSchema,
    format = 'u16',
    reserve = 64,
    then,
    render,
    children,
  } = props;

  const device = useDeviceContext();
  const versionRef = useRef(0);

  const schema = useOne(() => normalizeSchema(propSchema), propSchema);
  const uniforms = useMemo(
    () => {
      const out = [];
      for (const k in schema) {
        const {format, index, unwelded, ref} = schema[k];
        if (ref) throw new Error(`Ref '${k}' not supported in <InstanceData>. Use <Data>.`);
        if (index || unwelded) throw new Error(`Indexed and unwelded data not supported in <InstanceData>. Use <Data>.`);
        if (isUniformArrayType(format)) throw new Error(`Array data not supported in <InstanceData>. Use <Data>.`);
        out.push({name: k, format});
      }
      return out;
    },
    [schema]
  );

  const [ids, queue, InstanceCapture] = useOne(() => [
    makeIdAllocator(0),
    [] as Queued[],
    makeCapture('InstanceCapture'),
  ]);

  // Provide hook to reserve and update an instance
  const useInstance = useMemo(() => {

    const makeUpdateInstance = (instance: number) => (data: Record<string, any>) => {
      queue.push({instance, data});
    };

    const useInstance = () => {
      const instance = useResource((dispose) => {
        const id = ids.obtain();
        dispose(() => ids.release(id));
        return id;
      });

      useCapture(InstanceCapture, null);

      return useOne(() => makeUpdateInstance(instance), makeUpdateInstance);
    };

    return useInstance;
  }, [device, uniforms]);

  // Produce instance sources
  const Resume = () => {
    const size = Math.max(reserve, ids.max());
    const alloc = useBufferedSize(size);

    const prevBufferRef = useRef(null as MultiAggregateBuffer | null);

    // Make/resize data buffers + index buffer
    const [aggregateBuffer, indexBuffer, fields, sources] = useMemo(() => {
      const aggregateBuffer = makeMultiAggregateBuffer(device, uniforms, alloc);
      const {current: prevBuffer} = prevBufferRef;

      if (prevBuffer) {
        const from = new Uint32Array(prevBuffer.raw);
        const to = new Uint32Array(aggregateBuffer.raw);
        copyNumberArray(from, to, 1, 1, 0, 0, Math.min(from.length, to.length));
      }

      if (format !== 'u16' && format !== 'u32') throw new Error(`Unknown index format "${format}"`);
      const indexBuffer = makeAggregateBuffer(device, format, alloc);

      const fields = makeMultiAggregateFields(aggregateBuffer);
      const sources = getInstancedAggregate(aggregateBuffer);

      return [aggregateBuffer, indexBuffer, fields, sources];
    }, [device, uniforms, alloc]);

    let needsRefresh = prevBufferRef.current !== aggregateBuffer;
    prevBufferRef.current = aggregateBuffer;

    // Update data sparsely while calculating upload ranges
    let ranges = [];
    let range = null;
    for (const {instance, data} of queue) {
      if (!range) ranges.push(range = [instance, instance + 1]);
      else if (range[1] === instance) range[1]++;
      else ranges.push(range = [instance, instance + 1]);

      for (const k in fields) {
        const {prop = k} = schema[k];
        const {array, base, stride, dims} = fields[k];
        const v = data[prop];

        if (v != null) {
          const fromDims = toCPUDims(dims);
          const toDims = toGPUDims(dims);
          copyNumberArray(v, array, fromDims, toDims, 0, base + instance * stride, 1, stride);
        }
      }
    }
    if (needsRefresh) ranges = [[0, size]];

    // Upload changed ranges
    if (ranges.length) {
      const {buffer, raw, layout} = aggregateBuffer;
      const {length: stride} = layout;
      for (const [from, to] of ranges) {
        uploadBufferRange(device, buffer, raw, from * stride, (to - from) * stride);
      }
    }
    if ((window.TT = (window.TT||0)+1) < 10) console.log(aggregateBuffer, fields, indexBuffer)
    queue.length = 0;

    // Update instance ID buffer
    const version = ids.version();
    useOne(() => {
      const {buffer, array, source} = indexBuffer;

      let i = 0;
      for (const id of ids.all()) array[i++] = id;
      uploadBuffer(device, buffer, array.buffer);

      source.length = i;
      source.size[0] = i;
      source.version = version;
    }, version);

    const trigger = useOne(() => signal(), version);
    return then ? [trigger, then(sources)] : trigger;
  };

  return render ? capture(InstanceCapture, render(useInstance), Resume) : null;
};
