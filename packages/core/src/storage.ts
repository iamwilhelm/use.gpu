import { StorageSource } from './types';

export const makeStorageBindings = (
  links: Record<string, StorageSource>,
  binding: number = 0
): GPUBindGroupEntry[] => {
  const entries = [] as any[];

  for (const k in links) {
    const {type, buffer} = links[k];
    entries.push({binding, resource: {buffer}});
    binding++;
  }

  return entries;
};

export const makeStorageAccessors = (
  types: Record<string, string>,
  set: number = 0,
  binding: number = 0,
): Record<string, string> => {
  const modules = {} as Record<string, string>;

  for (const k in types) {
    const type = types[k];
    modules[k] = makeStorageAccessor(set, binding, type, k);
    binding++;
  }

  return modules;
};

export const makeStorageAccessor = (set: number, binding: number, type: string, name: string) => `
layout (std430, set = ${set}, binding = ${binding}) readonly buffer ${name}Type {
  ${type} data[];
} ${name}Storage;

#pragma export
${type} ${name}(int index) {
  return ${name}Storage.data[index];
}
`;