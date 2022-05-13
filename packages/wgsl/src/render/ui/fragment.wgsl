use './sdf'::{ SDF, getUVScale, getBorderBoxSDF, getRoundedBorderBoxSDF };
use '@use-gpu/wgsl/use/color'::{ premultiply };

@optional @link fn getTexture(uv: vec2<f32>) -> vec4<f32> { return vec4<f32>(0.0, 0.0, 0.0, 0.0); };

@stage(fragment)
fn main(
  @location(0) @interpolate(flat) fragRectangle: vec4<f32>,
  @location(1) @interpolate(flat) fragRadius: vec4<f32>,
  @location(2) @interpolate(flat) fragMode: i32,
  @location(3) @interpolate(flat) fragBorder: vec4<f32>,
  @location(4) @interpolate(flat) fragStroke: vec4<f32>,
  @location(5) @interpolate(flat) fragFill: vec4<f32>,
  @location(6) @interpolate(flat) fragRepeat: i32,
  @location(7)                    fragUV: vec2<f32>,
  @location(8)                    fragTextureUV: vec2<f32>,
) -> @location(0) vec4<f32> {
  var fillColor = fragFill;
  var strokeColor = fragStroke;

  var texture = getTexture(fragTextureUV);
  var sdf: SDF;
  
  if (fragRepeat < 0) {
    var wh = fragRectangle.zw - fragRectangle.xy;
    var scale = getUVScale(fragUV * wh) * fragRadius.x;
    var d = (texture.a - 0.75) * f32(fragRadius.y) + 0.25;
    sdf = SDF(d / scale, d / scale);

    fillColor = premultiply(fillColor);
  }
  else {
    if (texture.a > 0.0) {
      if (fragRepeat == 0 || fragRepeat == 1) {
        if (fragTextureUV.x < 0.0 || fragTextureUV.x > 1.0) { texture.a = 0.0; }
      }
      if (fragRepeat == 0 || fragRepeat == 2) {
        if (fragTextureUV.y < 0.0 || fragTextureUV.y > 1.0) { texture.a = 0.0; }
      }
  
      fillColor = vec4<f32>(
        premultiply(fillColor).rgb * (1.0 - texture.a) + texture.rgb,
        mix(fillColor.a, 1.0, texture.a),
      );
    }
    else {
      fillColor = premultiply(fillColor);
    }
  
    if (fragMode == 0) {
      if (fillColor.a <= 0.0) { discard; }
      return fillColor;
    }
    if (fragMode == 1) { sdf = getBorderBoxSDF(fragRectangle, fragBorder, fragUV); }
    else { sdf = getRoundedBorderBoxSDF(fragRectangle, fragRadius, fragBorder, fragUV); }
  }

  strokeColor = premultiply(strokeColor);

  var mask = clamp(sdf.outer, 0.0, 1.0);
  if (mask == 0.0) { discard; }

  var color = mix(strokeColor, fillColor, clamp(sdf.inner + (1.0 - mask), 0.0, 1.0));
  color = color * color.a;
  color = color * mask;

  return color;
}
