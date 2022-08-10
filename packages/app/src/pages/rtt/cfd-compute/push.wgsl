use '@use-gpu/wgsl/use/array'::{ sizeToModulus2, packIndex2 };

@link fn getSize() -> vec2<u32> {};

@link fn getMousePosition() -> vec2<f32> {};
@link fn getMouseDirection() -> vec2<f32> {};

@link var<storage, read_write> velocityBuffer: array<vec4<f32>>;

@compute @workgroup_size(8, 8)
fn main(
  @builtin(global_invocation_id) globalId: vec3<u32>,
) {
  let size = getSize();
  if (any(globalId.xy >= size)) { return; }
  let fragmentId = globalId.xy;

  let modulus = sizeToModulus2(size);
  let index = packIndex2(fragmentId, modulus);

  var mp = getMousePosition();
  var md = -getMouseDirection();
  
  let xy = (vec2<f32>(fragmentId) - mp) / f32(size.y) * 16.0; 
  let r1 = dot(xy, xy);

  let strength = max(0.0, 1.0 / (r1 + 1.0) * (1.0 - r1));
  let velocity = md * strength / 32.0 / max(1.0, length(md) / 5.0);

  let ripple = sin((xy + cos(xy.yx + mp) * 4.0 - mp) * vec2<f32>(13.311, 17.717));
  let dots = ripple.xy * ripple.yx;
  
  let circle = f32(r1 < 1.0) * r1 * (1.0 - r1);
  let density = (dots.x * dots.y) * (circle * circle);

  velocityBuffer[index] += vec4<f32>(velocity, density, 0.0);
}
