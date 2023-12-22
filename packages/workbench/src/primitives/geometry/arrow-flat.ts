import type { CPUGeometry } from '@use-gpu/core';
import { makeVertexAttributeLayout } from '@use-gpu/core';

const τ = Math.PI * 2;

export const makeArrowFlatGeometry = (
  detail: number = 8,
  width: number = 2.5
): CPUGeometry => {
  const positions = makeArrow2DVertices(detail, width);

  return {
    attributes: {positions},
    formats: {positions: 'vec4<f32>'},
    count: 3,
  };
}

const makeArrowFlatVertices = (width: number = 2.5) => {
  return new Float32Array([
        0,  0, 0, 1,
    width,  1, 0, 1,
    width, -1, 0, 1,
  ]);
};