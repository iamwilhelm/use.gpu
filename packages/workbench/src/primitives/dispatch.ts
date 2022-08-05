import type { LiveComponent } from '@use-gpu/live';
import type { TypedArray, StorageSource, RenderPassMode, DeepPartial, Lazy } from '@use-gpu/core';
import type { ShaderModule, ParsedBundle, ParsedModule } from '@use-gpu/shader';
import { yeet, memo, suspend, useContext, useNoContext, useMemo, useOne, useState, useResource } from '@use-gpu/live';

import { DeviceContext } from '../providers/device-provider';

import {
  makeBoundUniforms, makeVolatileUniforms,
  uploadBuffer,
  resolve,
} from '@use-gpu/core';
import { useLinkedShader } from '../hooks/useLinkedShader';
import { useComputePipelineAsync } from '../hooks/useComputePipeline';
import { useInspectable } from '../hooks/useInspectable'

import keyBy from 'lodash/keyBy';
import mapValues from 'lodash/mapValues';

export type DispatchProps = {
  size?: Lazy<number[] | TypedArray>,
  shader: ParsedBundle,
  defines: Record<string, any>,
  indirect?: StorageSource,
  shouldDispatch?: () => boolean | number,
  onDispatch?: () => void,
};

const NO_SIZE = [0];

const DEFAULT_DEFINES = {
  '@group(VIRTUAL)': '@group(0)',
  '@group(VOLATILE)': '@group(1)',
};

export const Dispatch = (props: RenderProps) => {
  return dispatch(props);
};

// Inlined into <Component>
export const dispatch = (props: RenderProps) => {
  const {
    size,
    indirect,
    shader: computeShader,
    defines: propDefines,
    shouldDispatch,
    onDispatch,
  } = props;

  const inspect = useInspectable();

  // Dispatch set up
  const device = useContext(DeviceContext);
  const defines = useOne(() => (propDefines ? {
    ...DEFAULT_DEFINES,
    ...propDefines,
  } : DEFAULT_DEFINES), propDefines);

  // Shader
  const {
    shader: [module],
    uniforms,
    bindings,
    constants,
    volatiles,
  } = useLinkedShader(
    [computeShader],
    defines,
  );
  
  // Rendering pipeline
  const [pipeline, stale] = useComputePipelineAsync(module);

  if (!pipeline) return;
  if (stale) return suspend();

  // Bound storage
  const force = !!volatiles.length;
  const storage = useMemo(() =>
    makeBoundUniforms(device, pipeline, uniforms, bindings, 0, force),
    [device, pipeline, uniforms, bindings]);

  // Volatile storage
  const volatile = useMemo(() =>
    makeVolatileUniforms(device, pipeline, volatiles, 1),
    [device, pipeline, uniforms, volatiles]
  );

  const inspected = inspect({
    render: {
      dispatchCount: 0,
      dispatchVersion: null,
    },
  });
  
  let dispatchVersion = null;

  // Return a lambda back to parent(s)
  return yeet({
    compute: (passEncoder: GPUComputePassEncoder, countDispatch: (d: number) => void) => {
      if (shouldDispatch) {
        const d = shouldDispatch();
        if (d === false) return;
        if (typeof d === 'number') {
          if (dispatchVersion === d) return;
          dispatchVersion = d;
        }
      }
      onDispatch && onDispatch();

      const s = resolve(size ?? NO_SIZE);
      const d = s.reduce((a, b) => a * (b || 1), 1);

      inspected.render.dispatchCount = d;
      inspected.render.dispatchVersion = dispatchVersion;
      countDispatch(d);

      if (storage.pipe && storage.buffer) {
        storage.pipe.fill(constants);
        uploadBuffer(device, storage.buffer, storage.pipe.data);
      }

      passEncoder.setPipeline(pipeline);
      if (storage.bindGroup) passEncoder.setBindGroup(0, storage.bindGroup);
      if (volatile.bindGroup) passEncoder.setBindGroup(1, volatile.bindGroup());

      if (indirect) passEncoder.dispatchWorkgroupsIndirect(indirect.buffer, indirect.byteOffset ?? 0);
      else passEncoder.dispatchWorkgroups(s[0], s[1] || 1, s[2] || 1);
    },
  });
};
