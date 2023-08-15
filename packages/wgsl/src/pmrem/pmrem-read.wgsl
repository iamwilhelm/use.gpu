use '@use-gpu/wgsl/codec/octahedral'::{ encodeOctahedral };

const MAX_LAYERS_LOG = 8;

@link fn getLayerCount() -> u32;
@link fn getMapping(i: u32) -> vec4<u32>;
@link fn getSigma(i: u32) -> f32;

@link fn getTexture(uv: vec2<f32>, level: f32) -> vec4<f32>;

@link var<storage> shCoefficients: array<vec4<f32>>;

@export fn sampleEnvMap(
  uvw: vec3<f32>,
  sigma: f32,
) -> vec4<f32> {  
  if (sigma < 0.0) { return sampleDiffuse(uvw); }

  let uv = encodeOctahedral(uvw) * .5 + .5;
  if (sigma == 0) { return sampleCubeMapLevel(uv, 0u); }

  let count = getLayerCount();
  var start = 0u;
  var length = count;
  for (var i = 0u; i < MAX_LAYERS_LOG; i++) {
    var mid = start + length / 2u;
    var v = getSigma(mid);
    if (sigma > v) {
      length -= mid - start;
      start = mid;
    }
    else {
      length = length / 2u;
    }
    if (length == 1u) {
      break;
    }
  }

  let level = min(start, count - 2);

  let a = max(getSigma(level), 1e-5);
  let b = getSigma(level + 1);
  let f = max(0.0, (sigma - a) / (b - a));

  let s1 = sampleCubeMapLevel(uv, level);
  let s2 = sampleCubeMapLevel(uv, level + 1);
  return mix(s1, s2, f);
}

fn sampleDiffuse(
  ray: vec3<f32>,
) -> vec4<f32> {
  let sample = (
    shCoefficients[0] + 
    shCoefficients[1] * ray.y +
    shCoefficients[2] * ray.z +
    shCoefficients[3] * ray.x +
    shCoefficients[4] * ray.y * ray.x +
    shCoefficients[5] * ray.y * ray.z +
    shCoefficients[6] * (3.0 * sqr(ray.z) - 1.0) +
    shCoefficients[7] * ray.x * ray.z +
    shCoefficients[8] * (sqr(ray.x) - sqr(ray.y))
  );

  return sample;
}

fn sampleCubeMapLevel(
  uv: vec2<f32>,
  level: u32,
) -> vec4<f32> {
  let mapping = vec4<f32>(getMapping(level));
  let size = mapping.zw - mapping.xy;

  let s = size - 1.0;
  let xy = uv * s + 0.5;

  if (FIX_BILINEAR_SEAM) {
    // Seam in diamond-shaped great circle where bilinear patches are not parallelograms
    let fxy = floor(xy - .5) + .5;
    let axy = abs(fxy * 2.0 - s);
    let diag = abs(s.x - axy.x - axy.y);

    if (diag < 1.0) {
      let uvb = fxy + mapping.xy;
      let uvd = xy - fxy;

      let signs = sign(uv);
      let inv = max(vec2<f32>(0.0), -signs);
      let xy = uvd * signs + inv;

      let tl = getTexture(uvb +                               inv, 0.0);
      let tr = getTexture(uvb + vec2<f32>(1.0, 0.0) * signs + inv, 0.0);
      let bl = getTexture(uvb + vec2<f32>(0.0, 1.0) * signs + inv, 0.0);
      let br = getTexture(uvb + vec2<f32>(1.0, 1.0) * signs + inv, 0.0);
    
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

  let uvt = xy + mapping.xy;
  return getTexture(uvt, 0.0);
}

fn sqr(x: f32) -> f32 { return x * x; }