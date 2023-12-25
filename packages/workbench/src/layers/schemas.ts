import type { ArchetypeSchema } from '@use-gpu/core';
import { isUniformArrayType } from '@use-gpu/core';

type CompactSchema = {
  single?: string,     // singular prop
  composite?: boolean, // singular is array

  // ArchetypeSchema
  format: string,
  ref?: boolean,
  index?: boolean,
  unwelded?: boolean,
};

const expandArrays = (schema: Record<string, CompactSchema>): ArchetypeSchema => {
  const out: ArchetypeSchema = {};
  for (const k in schema) {
    const {format, single, ref, ...rest} = schema[k];
    const composite = isUniformArrayType(format);
    const array = `array<${format}>`;

    if (ref) {
      out[single] = { format: array, name: k, ref, ...rest };
      continue;
    }

    out[k] = { format: array, ...rest };
    if (single) {
      if (composite) out[single] = { format, name: k };
      else out[single] = { format, name: k, spread: k, ...rest };
    }
  }
  return out;
};

export const INSTANCE_SCHEMA = {
  instances:  {format: 'array<u16>'},
};

export const SHAPE_SCHEMA = expandArrays({
  ids:        {format: 'u32', single: 'id'},
  lookups:    {format: 'u32', single: 'lookup'},
  colors:     {format: 'vec4<f32>', single: 'color'},
  depths:     {format: 'f32', single: 'depth'},
  zBiases:    {format: 'f32', single: 'zBias'},
});

export const MATRIX_SCHEMA = expandArrays({
  matrices: {format: 'mat4x4<f32>', single: 'matrix', ref: true},
  normalMatrices: {format: 'mat3x3<f32>', single: 'normalMatrix', ref: true},
});

export const POINT_SCHEMA = {
  ...SHAPE_SCHEMA,
  ...MATRIX_SCHEMA,
  ...expandArrays({
    positions: {format: 'vec4<f32>', single: 'position'},
    sizes:     {format: 'f32', single: 'size'},
  }),
};

export const LINE_SCHEMA = {
  ...SHAPE_SCHEMA,
  ...MATRIX_SCHEMA,
  ...expandArrays({
    positions: {format: 'array<vec4<f32>>', single: 'position'},
    widths:    {format: 'f32', single: 'width'},

    segments:  {format: 'i8', unwelded: true},
  }),
};

export const ARROW_SCHEMA = {
  ...SHAPE_SCHEMA,
  ...MATRIX_SCHEMA,
  ...expandArrays({
    positions: {format: 'array<vec4<f32>>', single: 'position'},
    widths:    {format: 'f32', single: 'width'},
    sizes:     {format: 'f32', single: 'size'},

    segments:  {format: 'i8', unwelded: true},
    anchors:   {format: 'vec4<u32>', unwelded: true},
    trims:     {format: 'vec4<u32>', unwelded: true},
  }),
};

export const FACE_SCHEMA = {
  ...SHAPE_SCHEMA,
  ...MATRIX_SCHEMA,
  ...expandArrays({
    positions: {format: 'array<vec4<f32>>', single: 'position'},
    indices:   {format: 'u32', index: true},
    segments:  {format: 'i8', unwelded: true},
  }),
};

export const SEGMENT_SCHEMA = {
  segments:  {format: 'i8', unwelded: true},
  anchors:   {format: 'vec4<u32>', unwelded: true},
  trims:     {format: 'vec4<u32>', unwelded: true},
};
