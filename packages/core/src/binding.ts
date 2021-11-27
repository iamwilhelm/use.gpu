import { UniformAttribute, ResolvedDataBindings, ShaderLib } from './types';
import { makeStorageAccessors, checkStorageTypes, checkStorageType } from './storage';
import { makeUniformBlockAccessor } from './uniform';
import { makeShaderModule } from './pipeline';
import partition from 'lodash/partition';

// Extract prop bindings from a flattened list of `constants / buffer` pairs.
export const extractPropBindings = (uniforms: UniformAttribute[], bindings: any[]): ResolvedDataBindings => {
  const constants = {} as Record<string, any>;
  const links = {} as Record<string, any>;
  for (const u of uniforms) {
    const v = bindings.shift();
    const b = bindings.shift();
    if (b != null) {
      checkStorageType(u, b);
      links[u.name] = b;
    }
    else if (v != null) {
      constants[u.name] = v;
    }
  }
  return {links, constants};
}

// Generate accessors for bound dynamic uniforms, either attribute or constant
export const makeBoundStorageAccessors = (
  uniforms: UniformAttribute[],
  dataBindings: ResolvedDataBindings,
  base: number = 0,
): [
  Record<string, string>,
  UniformAttribute[],
  UniformAttribute[],
] => {
  const [attributes, constants] = partition(uniforms, ({name}) => !!(dataBindings.links as any)[name]);
  const constantAccessors = makeUniformBlockAccessor(constants, base);
  const storageAccessors = makeStorageAccessors(attributes, base, constants.length);
  const accessors = {...constantAccessors, ...storageAccessors};

  return [accessors, attributes, constants];
}

// Bind a shader to a set of data bindings, either as constants or a buffer
export const makeBoundShader = <A, B>(
  vertexShader: T,
  fragmentShader: T,
  links: ShaderLib<A>,
  defines: Record<string, string>,
  compile: (code: B, stage: string) => any,
  link: (shader: A, links: ShaderLib<A>, defines: Record<string, string>, cache: any) => B,
  cache: any,
  base: number = 0,
) => {
  const vertexLinked = link(vertexShader, links, defines, cache);
  const fragmentLinked = link(fragmentShader, links, defines, cache);

  const vertex = makeShaderModule(compile(vertexLinked, 'vertex'));
  const fragment = makeShaderModule(compile(fragmentLinked, 'fragment'));

  return [vertex, fragment];
};
