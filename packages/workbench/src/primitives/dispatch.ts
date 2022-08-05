import type { LiveComponent } from '@use-gpu/live';
import type {
  TypedArray, ViewUniforms, UniformPipe, UniformAttribute, UniformAttributeValue, UniformType,
  VertexData, StorageSource, RenderPassMode, DeepPartial, Lazy, UseRenderingContextGPU,
} from '@use-gpu/core';
import type { ShaderModule, ParsedBundle, ParsedModule } from '@use-gpu/shader';
import { yeet, memo, suspend, useContext, useNoContext, useMemo, useOne, useState, useResource } from '@use-gpu/live';

import { DeviceContext } from '../providers/device-provider';
import { ViewContext } from '../providers/view-provider';

import {
  makeMultiUniforms, makeBoundUniforms, makeVolatileUniforms,
  uploadBuffer,
  resolve,
} from '@use-gpu/core';
import { useLinkedShader } from '../hooks/useLinkedShader';
import { useComputePipelineAsync } from '../hooks/useRenderPipeline';
import { useInspectable } from '../hooks/useInspectable'

import keyBy from 'lodash/keyBy';
import mapValues from 'lodash/mapValues';

export type DispatchProps = {
  size: Lazy<number[] | TypedArray>,
  shader: ParsedBundle,
  defines: Record<string, any>,
};

// Inlined into <Component>
export const dispatch = (props: RenderProps) => {
  const {
    size,
    shader: computeShader,
    defines: propDefines,
  } = props;

  const inspect = useInspectable();

  // Dispatch set up
  const device = useContext(DeviceContext);
  const defines = useOne(() => (propDefines ? {
    '@group(VIRTUAL)': '@group(0)',
    '@group(VOLATILE)': '@group(1)',
    ...propDefines,
  } : DEFAULT_DEFINES), propDefines);

  // Shader
  const {
    shader,
    uniforms,
    bindings,
    constants,
    volatiles,
  } = useLinkedShader(
    [computeShader],
    defines,
  );
  
  // Rendering pipeline
  const [pipeline, stale] = useComputePipelineAsync(
    renderContext,
    shader as any,
    propPipeline,
  );

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
    },
  });

  // Return a lambda back to parent(s)
  return yeet({
    compute: (passEncoder: GPUComputePassEncoder, countDispatch: (d: number) => void) => {
      const s = resolve(size);
      const d = size.reduce((a, b) => a * (b || 1), 1);

      inspected.render.dispatchCount = d;
      countDispatch(d);

      if (storage.pipe && storage.buffer) {
        storage.pipe.fill(constants);
        uploadBuffer(device, storage.buffer, storage.pipe.data);
      }

      passEncoder.setPipeline(pipeline);
      if (storage.bindGroup) passEncoder.setBindGroup(0, storage.bindGroup);
      if (volatile.bindGroup) passEncoder.setBindGroup(1, volatile.bindGroup());

      passEncoder.dispatchWorkgroups(s[0], s[1] || 1, s[2] || 1);
    },
  });
};
