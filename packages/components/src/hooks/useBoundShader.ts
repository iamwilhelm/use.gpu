import { ShaderLanguages } from '@use-gpu/core/types';
import { ParsedModule, ParsedBundle, ShaderDefine } from '@use-gpu/shader/types';

import { resolveBindings, bindBundle, linkBundle, loadModule } from '@use-gpu/shader/glsl';
import { makeShaderModule } from '@use-gpu/core';
import { useFiber, useMemo, useOne } from '@use-gpu/live';
import mapValues from 'lodash/mapValues';

const NO_DEPS = [] as any[];
const NO_LIBS = {} as Record<string, any>;

export const useBoundShader = (
  vertex: ParsedBundle,
  fragment: ParsedBundle,
  links: Record<string, ParsedBundle | ParsedModule>,
  defines: Record<string, ShaderDefine> | null | undefined,
  languages: ShaderLanguages,
  deps: any[] | null = null,
  base: number = 0,
  key?: number | string,
) => {
  const fiber = useFiber();
  const {glsl: {compile, cache}} = languages;

  // Binds links into shader and
  // resolve bindings between vertex and fragment.
  const {modules, uniforms, bindings} = useMemo(() => {
    const k = key ?? 'bound' + fiber.id;
    const v = bindBundle(vertex, links, null, k);
    const f = bindBundle(fragment, links, null, k);

    console.log('links changed');
    return resolveBindings([v, f]);
  }, [vertex, fragment, links])

  // Keep static set of bindings
  const ref = useOne(() => ({ uniforms, bindings }));

  // Memoize on specific keys to refresh shader
  const keys = [];
  for (const u of uniforms) keys.push(u.uniform.name);
  keys.push('/');
  for (const b of bindings) keys.push(b.uniform.name);

  // Link final GLSL
  const shader = useMemo(() => {
    console.log('shader changed');
    const v = linkBundle(modules[0], NO_LIBS, defines);
    const f = linkBundle(modules[1], NO_LIBS, defines);
    const vertex = makeShaderModule(compile(v, 'vertex'));
    const fragment = makeShaderModule(compile(f, 'fragment'));

    fiber.__inspect = fiber.__inspect || {};
    fiber.__inspect.vertex = v;
    fiber.__inspect.fragment = f;

    ref.uniforms = uniforms;
    ref.bindings = bindings;

    return [vertex, fragment, v, f];
  }, [...deps ?? NO_DEPS, ...keys]);

  // Update bound uniform values in-place from latest
  useOne(() => {
    console.log('uniforms changed');
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
  for (const b of bindings) buffers.push(b.storage?.buffer);  
  useMemo(() => {
    console.log('buffers changed');
    ref.bindings = bindings;
  }, buffers);

  return {shader, ...ref};
};
