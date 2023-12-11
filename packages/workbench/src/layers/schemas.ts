export const SHAPE_SCHEMA = {
  position:  {format: 'vec4<f32>', plural: 'positions'},
  color:     {format: 'vec4<f32>', plural: 'colors'},
  depth:     {format: 'f32', plural: 'depths'},
  zBias:     {format: 'f32', plural: 'zBiases'},
  id:        {format: 'u32', plural: 'ids'},
  lookup:    {format: 'u32', plural: 'lookups'},
};

export const POINT_SCHEMA = {
  ...SHAPE_SCHEMA,
  size:      {format: 'f32', plural: 'sizes'},
};

export const LINE_SCHEMA = {
  ...SHAPE_SCHEMA,
  segment:   {format: 'u32', plural: 'segments'},
  width:     {format: 'f32', plural: 'widths'},
};

export const FACE_SCHEMA = {
  ...SHAPE_SCHEMA,
  segment:   {format: 'u32', plural: 'segments'},
  index:     {format: 'u32', plural: 'indices', index: true},
};
