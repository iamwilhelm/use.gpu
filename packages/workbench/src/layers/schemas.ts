export const SHAPE_SCHEMA = {
  ids:        {format: 'u32', single: 'id'},
  colors:     {format: 'vec4<f32>', single: 'color'},
  depths:     {format: 'f32', single: 'depth'},
  zBiases:    {format: 'f32', single: 'zBias'},
};

export const POINT_SCHEMA = {
  ...SHAPE_SCHEMA,
  positions: {format: 'vec4<f32>', single: 'position'},
  sizes:     {format: 'f32', single: 'size'},
};

export const LINE_SCHEMA = {
  ...SHAPE_SCHEMA,
  positions: {format: 'vec4<f32>', single: 'position', composite: true},
  widths:    {format: 'f32', single: 'width'},

  scatters:  {format: 'u16', scatter: true},
  segments:  {format: 'i8',  segment: true},
  lookups:   {format: 'u16', segment: true},
};

export const ARROW_SCHEMA = {
  ...SHAPE_SCHEMA,
  positions: {format: 'vec4<f32>', single: 'position', composite: true},
  widths:    {format: 'f32', single: 'width'},
  sizes:     {format: 'f32', single: 'size'},

  scatters:  {format: 'u32', scatter: true},
  segments:  {format: 'i8', segment: true},
  anchors:   {format: 'vec4<u32>', segment: true},
  trims:     {format: 'vec4<u32>', segment: true},
};

export const FACE_SCHEMA = {
  ...SHAPE_SCHEMA,
  position:  {format: 'vec4<f32>', single: 'position', composite: true},
  indices:   {format: 'u32', index: true},
  segments:  {format: 'i8', segment: true},
};
