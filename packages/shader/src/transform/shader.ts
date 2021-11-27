import { Tree, SyntaxNode } from '@lezer/common';
import { parser } from '../grammar/glsl';
import { makeModuleCache } from './link';
import { ShaderLanguages, ShaderCompiler } from '@use-gpu/core/types';

export const parseGLSL = (code: string): Tree => {
  const parsed = parser.parse(code);
  return parsed;
}

type Define = string | number | boolean | null | undefined;
export const defineGLSL = (defs: Record<string, Define>): string => {
  const out = [];
  for (let k in defs) if (defs[k] !== false && defs[k] !== null) out.push(`#define ${k} ${defs[k]}`);
  return out.join("\n");
}

type LangDef = {
  glsl?: ShaderCompiler,
  modules?: Record<string, string>,
  cache?: any,
};

export const makeShaderLanguages = (langs: LangDef[]): ShaderLanguages => {
  const out = {} as any;
  for (const {glsl} of langs) {
    if (glsl) {
      out.glsl = {
        compile: (code: string, stage: any) => (glsl as any)(code, stage, false),
        cache: makeModuleCache(),
      };
    }
  }
  return out;
};
