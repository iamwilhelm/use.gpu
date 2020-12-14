import {TypedArray, UniformLayout, UniformAttribute, UniformBinding, UniformType} from './types';
import {UNIFORM_ATTRIBUTE_SIZES} from './constants';
import {UNIFORM_BYTE_SETTERS} from './bytes';

export const getUniformAttributeSize = (format: UniformType) => UNIFORM_ATTRIBUTE_SIZES[format];
export const getUniformByteSetter = (format: UniformType) => UNIFORM_BYTE_SETTERS[format];

export const makeUniformBindings = (
  bindings: UniformBinding[],
  binding: number = 0
): GPUBindGroupEntry[] => {

  let entries = [] as any[];

  for (let {resource} of bindings) {
    entries.push({binding, resource});
    binding++;
  }

  return entries;
};

export const makeUniformLayout = (
  attributes: UniformAttribute[],
  base: number = 0,
): UniformLayout => {

  let offset = base;
  let out = [] as any[];
  for (let {name, format} of attributes) {
    out.push({name, offset, format});
    offset += getUniformAttributeSize(format);
  }

  return {length: offset - base, attributes: out};
};

export const makeLayoutData = (layout: UniformLayout, count: number) => {
  const {length} = layout;
  const data = new ArrayBuffer(length * count);
  return data;
}

export const fillLayoutData = (layout: UniformLayout, data: ArrayBuffer) => {
  const {length, attributes} = layout;

  const dataView = new DataView(data);

  const setItem = (index: number, item: any) => {
    let base = index * length;
    for (let {name, offset, format} of attributes) {
      const setter = getUniformByteSetter(format);
      setter(dataView, base + offset, item[name]);
    }
  }

  return (items: any) => {
    let index = 0;
    if (!Array.isArray(items)) setItem(index, items);
    else for (let item of items) {
      setItem(index++, item);
    }
  }
}
