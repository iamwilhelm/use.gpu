import type { LiveComponent, PropsWithChildren } from '@use-gpu/live';
import type { GeometryArray, TypedArray } from '@use-gpu/core';

import { memo, yeet, useOne } from '@use-gpu/live';
import { patch } from '@use-gpu/state';
import { vec3, mat3, mat4 } from 'gl-matrix';

import { transformPositions, transformNormals, useMatrixContext } from '@use-gpu/workbench';

export type GeometryProps = GeometryArray & {
  _u?: null,
};

export const Geometry: LiveComponent<GeometryProps> = memo((props: PropsWithChildren<GeometryProps>) => {
  const {count, attributes, formats, children} = props;

  const matrix = useMatrixContext();
  if (!matrix) return children;

  return useOne(() => {
    const {positions, normals} = attributes;
    const ps = transformPositions(positions, formats.positions, matrix);
    const ns = transformNormals(normals, formats.normals, matrix);
    return yeet({
      count,
      attributes: patch(attributes, {positions: ps, normals: ns}),
      formats: patch(formats, {positions: 'vec4<f32>', normals: 'vec4<f32>'}),
    });
  }, matrix);
}, 'Geometry');

