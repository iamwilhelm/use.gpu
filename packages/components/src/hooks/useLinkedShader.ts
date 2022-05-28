import { ShaderModuleDescriptor } from '@use-gpu/core/types';
import { ParsedModule, ParsedBundle, ShaderDefine } from '@use-gpu/shader/types';

import { resolveBindings, linkBundle, getHash, getBundleHash, getBundleKey } from '@use-gpu/shader/wgsl';
import { makeShaderModule } from '@use-gpu/core';
import { useFiber, useMemo, useOne } from '@use-gpu/live';
import { useInspectable } from './useInspectable'
import LRU from 'lru-cache';

const NO_DEPS = [] as any[];
const NO_LIBS = {} as Record<string, any>;

type RenderShader = [ShaderModuleDescriptor, ShaderModuleDescriptor];

export const makeShaderCache = (options: Record<number, any> = {}) => new LRU<string, any>({
  max: 100,
  ...options,
});

const CACHE = new LRU<string, any>();

export const useLinkedShader = (
  vertex: ParsedBundle,
  fragment: ParsedBundle,
  defines: Record<string, ShaderDefine> | null | undefined,
  deps: any[] | null = null,
  base: number = 0,
  key?: number | string,
) => {
  const fiber = useFiber();
  const inspect = useInspectable();

  // Get hash for defines, shader code, shader instance
  const pHash = getHash(deps);
  const dHash = getHash(defines);
  const vHash = getBundleHash(vertex);
  const fHash = getBundleHash(fragment);
  const vKey  = getBundleKey(vertex);
  const fKey  = getBundleKey(fragment);

  const instanceKey   = vKey  + fKey  + dHash + pHash;
  const structuralKey = vHash + fHash + dHash + pHash;

  // If structural key hasn't changed, we don't need updated modules
  let lazy = true;
  useOne(() => { lazy = false }, structuralKey);

  // Resolve bindings between vertex and fragment if instance key changed
  const s = [vertex, fragment] as [ParsedBundle, ParsedBundle];
  const {modules, uniforms, bindings, volatiles} = useOne(() =>
    resolveBindings(s, defines, lazy),
    instanceKey
  );

  // Keep static set of uniforms/bindings to avoid recreating descriptors unless necessary
  const ref = useOne(() => ({ uniforms, bindings, constants: {} as Record<string, any> }));

  // Link final WGSL if code structure changed.
  const shader = useMemo(() => {
    const vKey = vHash +'-'+ dHash;
    const fKey = fHash +'-'+ dHash;

    let vertex = CACHE.get(vKey);
    if (vertex == null) {
      const v = linkBundle(modules[0], NO_LIBS, defines);
      vertex = makeShaderModule(v, vKey);
      CACHE.set(vKey, vertex);
    }

    let fragment = CACHE.get(fKey);
    if (fragment == null) {
      const f = linkBundle(modules[1], NO_LIBS, defines);
      fragment = makeShaderModule(f, fKey);
      CACHE.set(fKey, fragment);
    }
    
    inspect({
      vertex,
      fragment,
      uniforms,
      bindings,
    });

    // Replace uniforms/bindings as structure changed
    ref.uniforms = uniforms;
    ref.bindings = bindings;

    return [vertex, fragment] as [ShaderModuleDescriptor, ShaderModuleDescriptor];
  }, structuralKey);

  // Update uniform constant values in-place
  useOne(() => {
    for (const u of uniforms) ref.constants[u.uniform.name] = u.constant;
  }, uniforms);

  // Refresh all bindings if buffer assignment changed, as they need new a storage bind group
  const buffers = [] as (GPUBuffer | GPUTexture)[];
  for (const {storage, texture} of bindings) buffers.push(storage?.buffer ?? texture?.view ?? texture?.texture);
  useMemo(() => {
    ref.bindings = bindings;
  }, buffers);

  return {shader, ...ref, volatiles};
};
