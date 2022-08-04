import type { LambdaSource, StorageSource, UniformType, Task } from '@use-gpu/core';
import type { ShaderModule } from '@use-gpu/shader';
import type { ArrowFunction } from '@use-gpu/live';

import { useMemo, useOne, incrementVersion } from '@use-gpu/live';
import { resolve, makeDataBuffer, getDataArrayByteLength, UNIFORM_ARRAY_DIMS } from '@use-gpu/core';

import { adjustSize } from './useBufferedSize';
import { useDeviceContext } from '../providers/device-provider';

const NO_OPTIONS: ScratchSourceOptions = {};

type InputSource = LambdaSource | StorageSource;

type ScratchSourceOptions = {
  flags?: GPUFlagsConstant,
  readWrite?: boolean,
  reserve?: number,
};

export const useScratchSource = (
  inputSource: InputSource,
  format: UniformType,
  stride: number = 1,
  options: RawSourceOptions = NO_OPTIONS,
) => {
  const {
    readWrite = false,
    reserve = 16,
    flags = GPUBufferUsage.STORAGE,
  } = options;

  const device = useDeviceContext();

  return useMemo(() => {
    const f = (format && (format in UNIFORM_ARRAY_DIMS)) ? format as UniformType : 'f32';
    let alloc = reserve;

    const allocate = () => {
      const s = resolve(inputSource.size);
      const l = s.reduce((a, b) => a * b, 1);

      const newAlloc = adjustSize(l, alloc);

      if (alloc !== newAlloc) {
        alloc = newAlloc;

        const byteLength = getDataArrayByteLength(f, newAlloc || 1);
        source.buffer = makeDataBuffer(device, byteLength, flags);
      }

      source.length = l;
      source.size = s;
      source.version = incrementVersion(source.version);
    };

    const source = {
      buffer: null as any,
      format: f,
      length: inputSource.length ?? 0,
      size: inputSource.size ?? [0],
      version: 0,
      readWrite,
    } as StorageSource;

    allocate(reserve);

    return [source, allocate] as [StorageSource, Task];
  }, [device, inputSource, format, readWrite, flags]);
};
