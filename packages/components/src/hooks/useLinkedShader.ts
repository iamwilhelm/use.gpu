import { ShaderModuleDescriptor } from '@use-gpu/core/types';
import { ParsedModule, ParsedBundle, ShaderDefine } from '@use-gpu/shader/types';

import { resolveBindings, linkBundle, getHash } from '@use-gpu/shader/wgsl';
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

  // Resolve bindings between vertex and fragment.
  const s = [vertex, fragment] as [ParsedBundle, ParsedBundle];
  const {modules, uniforms, bindings} = useMemo(() =>
    resolveBindings(s, defines),
    [...s, defines]
  );

  // Keep static set of bindings
  const ref = useOne(() => ({ uniforms, bindings }));

  // Hash code + defines
  const dHash = getHash(defines);
  const [{hash: vHash}, {hash: fHash}] = modules;

  // Link final WGSL
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

    ref.uniforms = uniforms;
    ref.bindings = bindings;

    return [vertex, fragment] as [ShaderModuleDescriptor, ShaderModuleDescriptor];
  }, [...deps ?? NO_DEPS, vHash, fHash, dHash]);

  // Update bound uniform values in-place from latest
  useOne(() => {
    let i = 0;
    for (const u of uniforms) {
      if (u.constant != null) {
        ref.uniforms[i].constant = u.constant;
      }
      ++i;
    }
  }, uniforms);

  // Refresh bindings if buffer assignment changed
  const buffers = [] as GPUBuffer[];
  for (const {storage, texture} of bindings) {
    buffers.push(storage?.buffer ?? texture?.texture);
  }
  useMemo(() => {
    ref.bindings = bindings;
  }, buffers);

  return {shader, ...ref};
};
