use '@use-gpu/wgsl/use/array'::{ sizeToModulus2, packIndex2, wrapIndex2 };

@link fn getSize() -> vec2<u32> {};

@link var<storage, read_write> velocityBufferOut: array<vec4<f32>>;

@link var<storage> velocityBufferInPnHat: array<vec4<f32>>;
@link var<storage> velocityBufferInPn1Hat: array<vec4<f32>>;
@link var<storage> velocityBufferInPn: array<vec4<f32>>;

@compute @workgroup_size(8, 8)
fn main(
  @builtin(global_invocation_id) globalId: vec3<u32>,
) {
  let size = getSize();
  if (any(globalId.xy >= size)) { return; }
  let fragmentId = globalId.xy;

  let modulus = sizeToModulus2(size);
  let center = packIndex2(fragmentId, modulus);

  let pn = velocityBufferInPn[center];
  let pn1hat = velocityBufferInPn1Hat[center];
  let pnhat = velocityBufferInPnHat[center];

  let xy = vec2<f32>(fragmentId) + pn.xy;
  let xyi = floor(xy);
  let ff = xy - xyi;
  let ij = vec2<i32>(xyi);

  let tl = velocityBufferInPn[packIndex2(wrapIndex2(ij + vec2<i32>(0, 0), size), modulus)];
  let tr = velocityBufferInPn[packIndex2(wrapIndex2(ij + vec2<i32>(1, 0), size), modulus)];
  let bl = velocityBufferInPn[packIndex2(wrapIndex2(ij + vec2<i32>(0, 1), size), modulus)];
  let br = velocityBufferInPn[packIndex2(wrapIndex2(ij + vec2<i32>(1, 1), size), modulus)];

  let pn1 = pn1hat + 0.5*(pn - pnhat);

  var pmin = min(min(tl, tr), min(bl, br));
  var pmax = max(max(tl, tr), max(bl, br));

  let value = max(pmin, min(pmax, pn1));
  velocityBufferOut[center] = value;
}
