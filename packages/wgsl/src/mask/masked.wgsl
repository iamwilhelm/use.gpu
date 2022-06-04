@optional @link fn getMask(uv: vec2<f32>) -> f32 { return 1.0; };
@optional @link fn getTexture(uv: vec2<f32>) -> vec4<f32> { return vec4<f32>(1.0, 1.0, 1.0, 1.0); };

@export fn getMaskedFragment(color: vec4<f32>, uv: vec2<f32>) -> vec4<f32> {
  let t = getTexture(uv);
  let m = getMask(uv);

  var c = color;
  
  if (HAS_ALPHA_TO_COVERAGE) {
    c = vec4<f32>(c.xyz * t.xyz, c.a * m * t.a);
  }
  else {
    c = c * t * clamp(m, 0.0, 1.0);
  }

  if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) {
    c = vec4<f32>(c.x + 0.0, c.yz, c.a);
  }

  return c;
}
