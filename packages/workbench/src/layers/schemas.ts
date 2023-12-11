export const SHAPE_SCHEMA = {
  colors:     {format: 'vec4<f32>', single: 'color'},
  depths:     {format: 'f32', single: 'depth'},
  zBiases:    {format: 'f32', single: 'zBias'},
  ids:        {format: 'u32', single: 'id'},
  lookups:    {format: 'u32', single: 'lookup'},
};

export const POINT_SCHEMA = {
  ...SHAPE_SCHEMA,
  positions: {format: 'vec4<f32>', single: 'position'},
  sizes:     {format: 'f32', single: 'size'},
};

export const LINE_SCHEMA = {
  ...SHAPE_SCHEMA,
  positions: {format: 'vec4<f32>', composite: true},
  widths:    {format: 'f32', single: 'width'},

  segments:  {format: 'i8', segment: true},
  order:     {format: 'u32', order: true},
};

export const ARROW_SCHEMA = {
  ...SHAPE_SCHEMA,
  positions: {format: 'vec4<f32>', composite: true},
  widths:    {format: 'f32', single: 'width'},
  sizes:     {format: 'f32', single: 'size'},
  segments:  {format: 'i8', segment: true},
  anchors:   {format: 'vec4<u32>', segment: true},
  trims:     {format: 'vec4<u32>', segment: true},
};

export const FACE_SCHEMA = {
  ...SHAPE_SCHEMA,
  position:  {format: 'vec4<f32>', composite: true},
  indices:   {format: 'u32', index: true},
  segments:  {format: 'i8', segment: true},
};
