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
  defines: Record<string, ShaderDefine>,
  languages: ShaderLanguages,
  deps: any[] | null = null,
  base: number = 0,
  key?: number | string,
) => {
  const fiber = useFiber();
  const {glsl: {compile, cache}} = languages;

  // Binds links/defines into shader and
  // resolve bindings between vertex and fragment.
  const {modules, uniforms, bindings, bases} = useMemo(() => {
    const k = key ?? 'bound' + fiber.id;
    const v = bindBundle(vertex, links, defines, k);
    const f = bindBundle(fragment, links, defines, k);

    return resolveBindings([v, f]);
  }, [vertex, fragment, links, defines])

  // Memoize on specific keys
  const keys = [
    // Constant uniforms
    ...uniforms.map(u => u.uniform.name),
    // Storage buffers
    ...bindings.map(b => b.buffer),
  ];

  // Keep canonical set of bindings
  const ref = useOne(() => ({ uniforms, bindings }));

  // Update bound uniform values in-place from latest
  useOne(() => {
    let i = 0;
    for (const u of uniforms) if (u.constant) {
      ref.uniforms[i++].constant = u.constant;
    }
  }, uniforms);

  const shader = useMemo(() => {
    // Link final GLSL
    const v = linkBundle(modules[0], NO_LIBS, NO_LIBS, bases);
    const f = linkBundle(modules[1], NO_LIBS, NO_LIBS, bases);
    const vertex = makeShaderModule(compile(v, 'vertex'));
    const fragment = makeShaderModule(compile(f, 'fragment'));

    fiber.__inspect = fiber.__inspect || {};
    fiber.__inspect.vertex = v;
    fiber.__inspect.fragment = f;

    ref.uniforms = uniforms;
    ref.bindings = bindings;

    return [vertex, fragment, v, f];
  }, [...deps ?? NO_DEPS, ...keys]);

  return {shader, ...ref};
};
