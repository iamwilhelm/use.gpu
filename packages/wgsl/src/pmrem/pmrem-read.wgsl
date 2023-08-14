use '@use-gpu/wgsl/codec/octahedral'::{ encodeOctahedral };

@link fn getMapping() -> vec4<f32> {};
@link fn getTexture(uv: vec2<f32>) -> vec4<f32>;
@link fn getTextureSize() -> vec2<f32>;

@export fn sampleCubeMap(
  uvw: vec3<f32>,
) -> vec4<f32> {
  let mapping = getMapping();
  let size = mapping.zw - mapping.xy;

  let uv = encodeOctahedral(uvw);
  let xy = (uv * .5 + .5) * (size - 1) + 0.5;

  let uvt = (xy + mapping.xy) / getTextureSize();
  return getTexture(uvt);
}

@export fn sampleTextureMap(
  uv: vec2<f32>,
) -> vec4<f32> {
  let mapping = getMapping();
  let size = mapping.zw - mapping.xy;

  let xy = uv * size;
  let uvt = (xy + mapping.xy) / getTextureSize();
  return getTexture(uvt);
}
