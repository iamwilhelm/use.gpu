import { VertexAttribute } from './types';
import { VERTEX_ATTRIBUTE_SIZES } from './constants';

export const getVertexAttributeSize = (format: GPUVertexFormat): number =>
  VERTEX_ATTRIBUTE_SIZES[format];

export const makeVertexAttributeLayout = (
  attributes: VertexAttribute[],
  shaderLocation = 0
): GPUVertexBufferLayoutDescriptor => {
  const out = [] as GPUVertexAttributeDescriptor[];

  let offset = 0;
  for (const {format} of attributes) {
    out.push({shaderLocation, offset, format});
    offset += getVertexAttributeSize(format);
    shaderLocation++;
  }

  const arrayStride = offset;

  return {arrayStride, attributes: out};
};
