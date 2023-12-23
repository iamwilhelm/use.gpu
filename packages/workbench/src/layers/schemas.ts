export const INSTANCE_SCHEMA = {
  instances:  {format: 'u32'},
};

export const SHAPE_SCHEMA = {
  ids:        {format: 'u32', single: 'id'},
  lookups:    {format: 'u32', single: 'lookup'},
  colors:     {format: 'vec4<f32>', single: 'color'},
  depths:     {format: 'f32', single: 'depth'},
  zBiases:    {format: 'f32', single: 'zBias'},
};

export const MATRIX_SCHEMA = {
  matrices: {format: 'mat4x4<f32>', single: 'matrix', ref: true},
  normalMatrices: {format: 'mat3x3<f32>', single: 'normalMatrix', ref: true},
};

export const POINT_SCHEMA = {
  ...SHAPE_SCHEMA,
  ...MATRIX_SCHEMA,
  positions: {format: 'vec4<f32>', single: 'position'},
  sizes:     {format: 'f32', single: 'size'},
};

export const LINE_SCHEMA = {
  ...SHAPE_SCHEMA,
  ...MATRIX_SCHEMA,
  positions: {format: 'vec4<f32>', single: 'position', composite: true},
  widths:    {format: 'f32', single: 'width'},

  segments:  {format: 'i8', unwelded: true},
};

export const ARROW_SCHEMA = {
  ...SHAPE_SCHEMA,
  ...MATRIX_SCHEMA,
  positions: {format: 'vec4<f32>', single: 'position', composite: true},
  widths:    {format: 'f32', single: 'width'},
  sizes:     {format: 'f32', single: 'size'},

  segments:  {format: 'i8', unwelded: true},
  anchors:   {format: 'vec4<u32>', unwelded: true},
  trims:     {format: 'vec4<u32>', unwelded: true},
};

export const FACE_SCHEMA = {
  ...SHAPE_SCHEMA,
  ...MATRIX_SCHEMA,
  positions: {format: 'vec4<f32>', single: 'position', composite: true},
  indices:   {format: 'u32', index: true},
  segments:  {format: 'i8', unwelded: true},
};
