import { UniformType, TypedArray } from '@use-gpu/core/types';

import { useContext, useOne, useNoOne, incrementVersion } from '@use-gpu/live';
import { makeStorageBuffer, uploadBuffer, UNIFORM_DIMS } from '@use-gpu/core';
import { DeviceContext } from '../providers/device-provider';

export const useRawStorage = (array: TypedArray, format: UniformType, live: boolean = false) => {
  const device = useContext(DeviceContext);

  const size = array.byteLength;

  const ref = useOne(() => ({alloc: 0}));

  let {alloc} = ref;

  while (size < alloc * 0.25) alloc = Math.floor(alloc / 2);
  if (size > alloc) alloc = Math.max(size, Math.round(alloc * 1.2));

  ref.alloc = alloc;

  const buffer = useOne(() => makeStorageBuffer(device, alloc), alloc);
  const source = useOne(() => ({
    buffer,
    format,
    length: 0,
    version: 0,
  }), buffer);

  if (live) {
    useNoOne();
    uploadBuffer(device, buffer, array.buffer);

    source.length = array.length / UNIFORM_DIMS[format];
    source.version = incrementVersion(source.version);
  }
  else {
    useOne(() => {
      uploadBuffer(device, buffer, array.buffer);

      source.length = array.length / UNIFORM_DIMS[format];
      source.version = incrementVersion(source.version);
    }, array);
  }

  return source;
}
