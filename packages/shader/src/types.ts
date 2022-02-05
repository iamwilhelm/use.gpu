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

export type VirtualRender = (namespace: string, rename: Map<string, string>, base: number) => string;
