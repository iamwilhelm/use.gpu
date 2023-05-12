@optional @link fn getEffect() -> u32 { return 0; };
@optional @link fn getDirection() -> vec4<f32> { return vec4<f32>(0.0); };
@optional @link fn getValue() -> f32 { return 0; };
@optional @link fn getLayout() -> vec4<f32> { return vec4<f32>(0.0); };

fn getSlideMotion(position: vec4<f32>, sign: f32) -> vec4<f32> {
  let e = getEffect();
  let d = getDirection();
  let v = getValue();
  let l = getLayout();

  var p = position;
  // Move
  if (e == 3) {
    let direction = getDirection();
    let delta = vec4<f32>(l.zw - l.xy, 1.0, 0.0) * direction;

    p += delta * p.w * v * sign;
  }

  return p;
}

@export fn getSlidePosition(position: vec4<f32>) -> vec4<f32> {
  return getSlideMotion(position, 1.0);
}

@export fn getSlideInverse(position: vec4<f32>) -> vec4<f32> {
  return getSlideMotion(position, -1.0);
}

