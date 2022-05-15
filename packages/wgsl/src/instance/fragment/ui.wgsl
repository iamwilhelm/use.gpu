use '@use-gpu/wgsl/fragment/sdf-2d'::{ SDF, getUVScale, getBoxSDF, getBorderBoxSDF, getRoundedBorderBoxSDF };
use '@use-gpu/wgsl/use/color'::{ premultiply };

@optional @link fn getTexture(uv: vec2<f32>) -> vec4<f32> { return vec4<f32>(0.0, 0.0, 0.0, 0.0); };

@export fn getUIFragment(
  uv: vec2<f32>,
  textureUV: vec2<f32>,
  clipUV: vec4<f32>,
  sdfUV: vec2<f32>,
  sdfConfig: vec4<f32>,
  repeat: i32,
  mode: i32,
  layout: vec4<f32>,
  radius: vec4<f32>,
  border: vec4<f32>,
  stroke: vec4<f32>,
  fill: vec4<f32>,
) -> vec4<f32> {
  var fillColor = fill;
  var strokeColor = stroke;

  var scale = getUVScale(sdfUV);
  if (uv.x < clipUV.x || uv.y < clipUV.y || uv.x > clipUV.z || uv.y > clipUV.w) { discard; }

  var sdf: SDF;
  var texture = getTexture(textureUV);
  var mark = 0.0;
  
  if (mode == -1) {
    let sdfRadius = sdfConfig.x;
    var expand = border.x;
    
    var d = (texture.a - 0.75) * sdfRadius;
    var s = (d + expand) / scale * sdfConfig.y + 0.5;
    sdf = SDF(s, s);
    
    if (texture.a == 0.0 && sdf.outer > 0.0) { sdf.outer = 0.5; }
  }
  else {
    if (texture.a > 0.0) {
      if (repeat == 0 || repeat == 1) {
        if (textureUV.x < 0.0 || textureUV.x > 1.0) { texture.a = 0.0; }
      }
      if (repeat == 0 || repeat == 2) {
        if (textureUV.y < 0.0 || textureUV.y > 1.0) { texture.a = 0.0; }
      }

      fillColor = vec4<f32>(
        premultiply(fillColor).rgb * (1.0 - texture.a) + texture.rgb,
        mix(fillColor.a, 1.0, texture.a),
      );
    }
    else {
      fillColor = premultiply(fillColor);
    }
  
    let bleed = 0.5;
    if (mode == 0) {
      if (fillColor.a <= 0.0) { discard; }
      
      var s = getBoxSDF(layout.xy, uv, scale);
      sdf.outer = s;
      sdf.inner = s;
    }
    else if (mode == 1) { sdf = getBorderBoxSDF(layout.xy, border, uv, scale); }
    else { sdf = getRoundedBorderBoxSDF(layout.xy, border, radius, uv, scale); }
    
    sdf.outer += bleed;
    sdf.inner += bleed;
  }

  var mask = clamp(sdf.outer, 0.0, 1.0);

  if (DEBUG_SDF) {
    let o = (sdf.outer - 0.5) * scale / 4.0;
    let m = ((o + 0.5) % 1.0) - 0.5;
    mark = clamp(1.0 - abs(m / scale) * 4.0, 0.0, 1.0);
  }
  if (mask == 0.0 && mark == 0.0) { discard; }

  var color = fill;
  if (sdf.outer != sdf.inner) { color = mix(strokeColor, fillColor, clamp(sdf.inner + (1.0 - mask), 0.0, 1.0)); }

  if (!HAS_ALPHA_TO_COVERAGE) {
    color = vec4<f32>((color.rgb + mark) * color.a * mask, color.a * mask);
  }
  else {
    color = vec4<f32>(color.rgb + mark, color.a * mask);
  }

  if (DEBUG_SDF) {
    return vec4<f32>(mix(color.rgb, vec3<f32>(mark), 0.5), color.a);
  }
  return color;
}
