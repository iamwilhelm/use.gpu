use './sdf'::{ SDF, getBorderBoxSDF, getRoundedBorderBoxSDF };

@external fn getTexture(uv: vec2<f32>) -> vec4<f32> {};

@stage(fragment)
fn main(
  @location(0) @interpolate(flat) fragRectangle: vec4<f32>,
  @location(1) @interpolate(flat) fragRadius: vec4<f32>,
  @location(2)                    fragUV: vec2<f32>,
  @location(3) @interpolate(flat) fragMode: i32,
  @location(4) @interpolate(flat) fragBorder: vec4<f32>,
  @location(5) @interpolate(flat) fragStroke: vec4<f32>,
  @location(6) @interpolate(flat) fragFill: vec4<f32>,
) -> @location(0) vec4<f32> {
  if (fragMode == 0) { return fragFill; }

  var sdf: SDF;
  if (fragMode == 1) { sdf = getBorderBoxSDF(fragRectangle, fragBorder, fragUV); }
  else { sdf = getRoundedBorderBoxSDF(fragRectangle, fragRadius, fragBorder, fragUV); }

  var mask = clamp(sdf.outer, 0.0, 1.0);
  if (mask == 0.0) { discard; }

  var color = mix(fragStroke, fragFill, clamp(sdf.inner + (1.0 - mask), 0.0, 1.0));
  color = color * mask;

  return color;
}
