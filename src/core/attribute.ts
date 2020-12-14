import {TypedArray, VertexAttribute} from './types';
import {VERTEX_ATTRIBUTE_SIZES} from './constants';

export const getVertexAttributeSize = (format: GPUVertexFormat) => VERTEX_ATTRIBUTE_SIZES[format];

export const makeVertexAttributeLayout = (
  attributes: VertexAttribute[],
  shaderLocation: number = 0
): GPUVertexBufferLayoutDescriptor => {

  let offset = 0;
  let out = [] as GPUVertexAttributeDescriptor[];
  for (let {format} of attributes) {
    out.push({shaderLocation, offset, format});
    offset += getVertexAttributeSize(format);
    shaderLocation++;
  }

  const arrayStride = offset;

  return {arrayStride, attributes: out};
};
