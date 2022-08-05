import type { StorageSource, UniformAttribute, DataBinding } from './types';

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
      const {buffer, byteOffset, byteLength} = link;
      entries.push({binding, resource: {
        buffer,
        offset: byteOffset,
        size:   byteLength,
      }});
      binding++;
    }
  }

  return entries;
};

const toTypeName = (s: any) => s?.module?.entry ?? s?.entry ?? s;

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

  const fromName = toTypeName(from);
  const toName = toTypeName(to);
  
  let f = fromName;
  let t = toName;
  
  if (link && t != null && f !== t) {
    // Remove array<atomic<..>>
    f = f.replace(/array?/, '').replace(/^<|>$/g, '');
    f = f.replace(/atomic?/, '').replace(/^<|>$/g, '');
    t = t.replace(/array?/, '').replace(/^<|>$/g, ''); 
    t = t.replace(/atomic?/, '').replace(/^<|>$/g, ''); 

    // Remove vec<..> to allow for automatic widening/narrowing
    f = f.replace(/vec[0-9](to[0-9])?/, '').replace(/^<|>$/g, '');
    t = t.replace(/vec[0-9](to[0-9])?/, '').replace(/^<|>$/g, ''); 

    if (f !== t) {
      // Remove bit size to allow for automatic widening/narrowing
      const fromScalar = f.replace(/([uif])([0-9]+)/, '$1__');
      const toScalar   = t.replace(/([uif])([0-9]+)/, '$1__');

      if (fromScalar !== toScalar) {
        // uppercase = struct type, allow any (u)int
        if (fromName.match(/[A-Z]/) && toName.match(/^[ui]/)) return;

        console.warn(`Invalid format ${to} bound for ${from} "${name}" (${fromScalar} != ${toScalar})`);
      }
    }
  }
} 
