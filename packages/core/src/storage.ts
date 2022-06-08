import { StorageSource, UniformAttribute, DataBinding } from './types';

export const makeStorageBinding = (
  device: GPUDevice,
  pipeline: GPURenderPipeline | GPUComputePipeline,
  links: Record<string, StorageSource | null | undefined>,
  set: number = 0,
): GPUBindGroup => {
  const entries = makeStorageEntries(links);
  const bindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(set),
    entries,
  });
  return bindGroup;
}

export const makeStorageEntries = (
  links: Record<string, StorageSource | null | undefined>,
  binding: number = 0
): GPUBindGroupEntry[] => {
  const entries = [] as any[];

  for (const k in links) {
    const link = links[k];
    if (link) {
      const {buffer} = link;
      entries.push({binding, resource: {buffer}});
      binding++;
    }
  }

  return entries;
};

export const checkStorageTypes = (
  uniforms: UniformAttribute[],
  links: Record<string, StorageSource | null | undefined>,
) => {
  for (const u of uniforms) {
    const link = links[u.name];
    checkStorageType(u, link)
  }
} 

export const checkStorageType = (
  uniform: UniformAttribute,
  link: StorageSource | null | undefined,
) => {
  const {name, format: from} = uniform;
  const to = link?.format;
  if (link && from !== to) {
    // Remove vec size to allow for automatic widening/narrowing
    const fromVec = from.replace(/vec[0-9](to[0-9])?/, 'vec');
    const toVec   =   to.replace(/vec[0-9](to[0-9])?/, 'vec'); 

    if (fromVec !== toVec) {
      // Remove bit size to allow for automatic widening/narrowing
      const fromScalar = fromVec.replace(/([uif])([0-9]+)/, '$1__');
      const toScalar   =   toVec.replace(/([uif])([0-9]+)/, '$1__');

      if (fromScalar !== toScalar) {
        console.warn(`Invalid format ${to} bound for ${from} "${name}" (${fromScalar} != ${toScalar})`);
      }
    }
  }
} 

export const makeStorageAccessors = (
  uniforms: UniformAttribute[],
  set: number = 0,
  binding: number = 0,
): Record<string, string> => {
  const modules = {} as Record<string, string>;

  for (const {name, format} of uniforms) {
    modules[name] = makeStorageAccessor(set, binding, format, name);
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