import type {
  UniformAttribute, UniformAttributeValue,
  ShaderModule, StorageSource, DataBinding, TextureSource, LambdaSource,
} from './types';
import { checkStorageType } from './storage';

/**
 * Parse a set of shader sources for use with a given set of uniforms/attributes.
 */
export const makeShaderBindings = <T extends ShaderModule>(
  uniforms: (UniformAttribute | UniformAttributeValue)[],
  sources: (StorageSource | TextureSource | LambdaSource<T> | any)[],
): DataBinding<T>[] => {
  const n = uniforms.length;
  const out = [] as DataBinding<T>[];
  for (let i = 0; i < n; ++i) {
    const u = uniforms[i];
    const s = sources[i];
    out.push(makeShaderBinding<T>(u, s));
  }
  return out;
}

/**
 * Parse a source for use with a given uniform/attribute.
 */
export const makeShaderBinding = <T extends ShaderModule>(
  uniform: UniformAttribute | UniformAttributeValue,
  source?: StorageSource | TextureSource | LambdaSource<T> | T | any,
): DataBinding<T> => {
  if (source != null) {
    if (source.shader) {
      const lambda = source as LambdaSource<T>;
      return {uniform, lambda};
    }
    if (source.module || source.table) {
      const lambda = {shader: source} as LambdaSource<T>;
      return {uniform, lambda};
    }
    if (source.buffer && (source.buffer instanceof GPUBuffer)) {
      const storage = source as StorageSource;
      checkStorageType(uniform, storage);
      return {uniform, storage};
    }
    if (source.texture || source.view) {
      const texture = source as TextureSource;
      return {uniform, texture};
    }
  }
  return {uniform, constant: source ?? (uniform as any).value};
}

/**
 * Make a binding for a wrapped value (a ref) for use with a given uniform/attribute.
 */
export const makeRefBinding = <T extends ShaderModule>(
  uniform: UniformAttribute | UniformAttributeValue,
  value?: {current: T} | T,
): DataBinding<T> => ({uniform, constant: value ?? (uniform as any).value});

export const isShaderBinding = <T extends ShaderModule>(
  source?: StorageSource | TextureSource | LambdaSource<T> | T | any,
): source is StorageSource | TextureSource | LambdaSource<T> | T => {
  if (source != null) {
    return !!(
      (source.shader) ||
      (source.module || source.table) ||
      (source.buffer && (source.buffer instanceof GPUBuffer)) ||
      (source.texture || source.view)
    );
  }
  return false;
}
