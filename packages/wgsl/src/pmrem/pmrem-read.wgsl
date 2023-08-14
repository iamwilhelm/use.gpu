use '@use-gpu/wgsl/codec/octahedral'::{ encodeOctahedral };

@link fn getMapping(i: u32) -> vec4<u32>;
@link fn getTexture(uv: vec2<f32>, level: f32) -> vec4<f32>;
@link fn getTextureSize() -> vec2<f32>;

@export fn sampleCubeMap(
  uvw: vec3<f32>,
  level: u32,
) -> vec4<f32> {
  let mapping = vec4<f32>(getMapping(level));
  let size = mapping.zw - mapping.xy;

  let s = (size - 1.0);
  let uv = encodeOctahedral(uvw);
  let xy = (uv * .5 + .5) * s + 0.5;

  if (FIX_BILINEAR_SEAM) {
    let fxy = floor(xy - .5) + .5;
    let axy = abs(fxy * 2.0 - s);
    let diag = abs(s.x - axy.x - axy.y);

    if (diag < 1.0) {
      let s = 1 / getTextureSize();
      let uvb = (fxy + mapping.xy) * s;
      let uvd = xy - fxy;

      let signs = sign(uv);
      let inv = max(vec2<f32>(0.0), -signs);
      let xy = uvd * signs + inv;

      let tl = getTexture(uvb +                               inv * s, 0.0);
      let tr = getTexture(uvb + vec2<f32>(s.x, 0.0) * signs + inv * s, 0.0);
      let bl = getTexture(uvb + vec2<f32>(0.0, s.y) * signs + inv * s, 0.0);
      let br = getTexture(uvb + vec2<f32>(s.x, s.y) * signs + inv * s, 0.0);
    
      let x = xy.x;
      let y = xy.y;
      let sum = x + y;
      let diff1 = x / (x + y);
      let diff2 = 1.0 - (1.0 - x) / (2.0 - x - y);
      let af = min(sum, 2 - sum);
      let bf = select(diff1, diff2, sum > 1.0);
      let corner = select(tl, br, sum > 1.0);
      let top = bl;
      let bottom = tr;
      return mix(corner, mix(top, bottom, bf), af);
    }
  }

  let uvt = (xy + mapping.xy) / getTextureSize();
  return getTexture(uvt, 0.0);
}

@export fn sampleTextureMap(
  uv: vec2<f32>,
) -> vec4<f32> {
  let mapping = vec4<f32>(getMapping(0));
  let size = mapping.zw - mapping.xy;

  let xy = uv * size;
  let uvt = (xy + mapping.xy) / getTextureSize();
  return getTexture(uvt);
}
