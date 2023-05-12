use '@use-gpu/wgsl/use/color'::{ premultiply };

@optional @link fn getTexture(uv: vec2<f32>) -> vec4<f32> { return vec4<f32>(0.0, 0.0, 0.0, 0.0); };
@optional @link fn getMask(color: vec4<f32>, uv: vec4<f32>, st: vec4<f32>) -> vec4<f32> { return color; }

@export fn getUICopyFragment(
  uv: vec2<f32>,
  textureUV: vec2<f32>,
  textureST: vec2<f32>,
  clipUV: vec4<f32>,
  sdfUV: vec2<f32>,
  sdfConfig: vec4<f32>,
  repeat: i32,
  mode: i32,
  shape: vec4<f32>,
  radius: vec4<f32>,
  border: vec4<f32>,
  stroke: vec4<f32>,
  fill: vec4<f32>,
  coord: vec4<f32>,
) -> vec4<f32> {
  var texture = getTexture(coord.xy);

  var color = vec4<f32>(
    premultiply(fill).rgb * (1.0 - texture.a) + texture.rgb,
    mix(fill.a, 1.0, texture.a),
  );

  color = getMask(color, vec4<f32>(textureUV, 0.0, 0.0), vec4<f32>(textureST, 0.0, 0.0));

  return color;
}
