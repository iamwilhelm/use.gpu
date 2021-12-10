import { ShaderLanguages } from '@use-gpu/core/types';
import { ParsedModule, ParsedBundle, ShaderDefine } from '@use-gpu/shader/types';

import { resolveBindings, bindBundle, linkBundle, loadModule } from '@use-gpu/shader/glsl';
import { makeShaderModule } from '@use-gpu/core';
import { useFiber, useMemo } from '@use-gpu/live';
import mapValues from 'lodash/mapValues';

const NO_DEPS = [] as any[];

export const useBoundShader2 = (
  vertex: ParsedBundle,
  fragment: ParsedBundle,
  links: Record<string, ParsedBundle | ParsedModule>,
  defines: Record<string, ShaderDefine>,
  languages: ShaderLanguages,
  deps: any[] | null = null,
  base: number = 0,
) => {
  const {glsl: {compile, cache}} = languages;

  const {modules, uniforms, bindings} = useMemo(() => {
    const v = bindBundle(vertex, links, defines, 'bound');
    const f = bindBundle(fragment, links, defines, 'bound');
    return resolveBindings([v, f]);
  }, [vertex, fragment, links, defines])

  const keys = [...uniforms.map(u => u.uniform.name), ...bindings.map(b => b.uniform.name)];

  const shader = useMemo(() => {
    const v = linkBundle(modules[0]);
    const f = linkBundle(modules[1]);

    const vertex = makeShaderModule(compile(v, 'vertex'));
    const fragment = makeShaderModule(compile(f, 'fragment'));

    return [vertex, fragment, v, f];
  }, [...deps ?? NO_DEPS, ...keys]);

  const [,, vertexCode, fragmentCode] = shader;
  const fiber = useFiber();
  fiber.__inspect = fiber.__inspect || {};
  fiber.__inspect.vertex = vertexCode;
  fiber.__inspect.fragment = fragmentCode;

  return {shader, uniforms, bindings};
};
