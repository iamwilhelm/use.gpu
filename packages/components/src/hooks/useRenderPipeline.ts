import { UseRenderingContextGPU, ShaderModuleDescriptor, DeepPartial } from '@use-gpu/core/types';

import { makeRenderPipeline, makeRenderPipelineAsync } from '@use-gpu/core';
import { useContext, useMemo, useOne, useState } from '@use-gpu/live';
import { useMemoKey } from './useMemoKey';
import { DeviceContext } from '../providers/device-provider';
import LRU from 'lru-cache';

const DEBUG = false;

const NO_DEPS = [] as any[];
const NO_LIBS = {} as Record<string, any>;

type RenderShader = [ShaderModuleDescriptor, ShaderModuleDescriptor];

export const makePipelineCache = (options: Record<string, any> = {}) => new LRU<string, any>({
  max: 100,
  ...options,
});

const CACHE = new WeakMap<any, LRU<string, any>>();
const PENDING = new WeakMap<any, Map<string, any>>();

export const useRenderPipeline = (
  renderContext: UseRenderingContextGPU,
  shader: RenderShader,
  props: DeepPartial<GPURenderPipelineDescriptor>,
) => {
  const device = useContext(DeviceContext);
  const {colorStates, depthStencilState, samples} = renderContext;

  // Memo key for unique render context
  const memoKey = useMemoKey(
    [device, colorStates, depthStencilState, props]
  );

  return useMemo(() => {
    // Cache by unique render context
    let cache = CACHE.get(memoKey);
    if (!cache) {
      DEBUG && console.log('pipeline cache created', memoKey.__id)
      CACHE.set(memoKey, cache = makePipelineCache());
    }

    // Cache by shader structural hash
    const [vertex, fragment] = shader;
    const key = vertex.hash.toString() + fragment.hash.toString();

    const cached = cache.get(key);
    if (cached) {
      DEBUG && console.log('pipeline cache hit', key)
      return cached;
    }

    // Make new pipeline
    const pipeline = makeRenderPipeline(
      device,
      renderContext,
      vertex,
      fragment,
      props,
    );
    cache.set(key, pipeline);
    DEBUG && console.log('pipeline cache miss', key)
    return pipeline;
  }, [memoKey, shader, samples]);
};

export const useRenderPipelineAsync = (
  renderContext: UseRenderingContextGPU,
  shader: RenderShader,
  props: DeepPartial<GPURenderPipelineDescriptor>,
) => {
  const device = useContext(DeviceContext);
  const {colorStates, depthStencilState, samples} = renderContext;

  // Memo key for unique render context
  const memoKey = useMemoKey(
    [device, colorStates, depthStencilState, props]
  );

  const [resolved, setResolved] = useState<GPURenderPipeline | null>(null);
  const staleRef = useOne(() => ({current: false}));

  const immediate = useMemo(() => {
    // Cache by unique render context
    let cache = CACHE.get(memoKey);
    let pending = PENDING.get(memoKey);
    if (!cache) {
      DEBUG && console.log('pipeline cache created', memoKey.__id)
      CACHE.set(memoKey, cache = makePipelineCache());
    }
    if (!pending) {
      DEBUG && console.log('pipeline pending queue created', memoKey.__id)
      PENDING.set(memoKey, pending = new Map());
    }

    // Cache by shader structural hash
    const [vertex, fragment] = shader;
    const key = vertex.hash.toString() +'-'+ fragment.hash.toString();

    const cached = cache.get(key);
    if (cached) {
      DEBUG && console.log('async pipeline cache hit', key)
      return cached;
    }

    // Mark current pipeline as stale (if any)
    staleRef.current = true;

    // Mark key as pending
    if (pending.has(key)) {
      pending.get(key)!.then((pipeline) => {
        setResolved(pipeline);
        staleRef.current = false;
        return pipeline;
      });
      return null;
    }

    // Make new pipeline async
    const promise = makeRenderPipelineAsync(
      device,
      renderContext,
      vertex,
      fragment,
      props,
    );
    promise.then((pipeline) => {
      DEBUG && console.log('async pipeline resolved', key)

      cache.set(key, pipeline);
      setResolved(pipeline);

      staleRef.current = false;
      pending.delete(key);

      return pipeline;
    });
    pending.set(key, promise);

    DEBUG && console.log('async pipeline miss', key)
    return null;
  }, [memoKey, shader, samples]);

  DEBUG && console.log('async pipeline got', (immediate ?? resolved))
  return [immediate ?? resolved, staleRef.current];
};
