import { Tree, SyntaxNode } from '@lezer/common';
import LRU from 'lru-cache';

export type ParsedModuleCache<T = any> = LRU<string, ParsedModule<T>>;

export type ShaderModule<T = any> = ParsedBundle<T> | ParsedModule<T>;

export type ParsedBundle<T = any> = {
  module: ParsedModule<T>,
  libs?: Record<string, ShaderModule<T>>,
  entry?: string,
  virtual?: ParsedModule<T>[],
};

export type ParsedModule<T = any> = {
  name: string,
  code: string,
  table: T,
  tree?: Tree,
  shake?: ShakeTable,
  virtual?: VirtualTable<T>,
  entry?: string,
};

export type VirtualTable<T = any> = {
  render: VirtualRender,
  uniforms?: DataBinding<T>[],
  bindings?: DataBinding<T>[],
  base?: number,
  namespace?: string,
};

export type DataBinding<T = any> = {
  uniform: UniformAttributeValue,
  storage?: StorageSource,
  lambda?: ShaderModule<T>,
  constant?: any,
};

export type ShakeTable = ShakeOp[];
export type ShakeOp = [number, string[]];

export type VirtualRender = (namespace: string, rename: Map<string, string>, base: number) => string;

export type StorageSource = {
  buffer: GPUBuffer,
  format: string,
  length: number,
};

export type UniformAttribute = {
  name: string,
  format: string,
  args?: string[],
};

export type UniformAttributeValue = UniformAttribute & {
  value: any,
};


