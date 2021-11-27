import { ShaderLanguages, ShaderLib } from '@use-gpu/core/types';
import { makeBoundShader } from '@use-gpu/core';
import { linkBundle as link, loadModule } from '@use-gpu/shader';
import { useFiber } from '@use-gpu/live';
import mapValues from 'lodash/mapValues';

import { useMemo } from '@use-gpu/live';
import { checkStorageType } from './storage';

const NO_DEPS = [];

export const useBoundShader = (
  vertexShader: ParsedBundle,
  fragmentShader: ParsedBundle,
  codeBindings: ShaderLib<ParsedBundle | ParsedModule>,
  accessors: Record<string, string>,
  defines: Record<string, string>,
  languages: ShaderLanguages,
  deps: any[] | null = null,
  base: number = 0,
) => {
  const {glsl: {compile, cache}} = languages;

  const shader = useMemo(() => {
    const bindings = {
      ...codeBindings,
      ...mapValues(accessors, loadModule),
    };

    return makeBoundShader(
      vertexShader,
      fragmentShader,
      bindings,
      defines,
      compile,
      link,
      cache,
      base,
    );
  }, [...deps ?? NO_DEPS, codeBindings, accessors]);

  const [,, vertexCode, fragmentCode] = shader;
  const fiber = useFiber();
  fiber.__inspect = fiber.__inspect || {};
  fiber.__inspect.vertex = vertexCode;
  fiber.__inspect.fragment = fragmentCode;

  return shader;
};
