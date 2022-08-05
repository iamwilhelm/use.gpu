use '@use-gpu/wgsl/use/array'::{ sizeToModulus3, packIndex3 }

@link fn getVolumeData(i: u32) -> f32 {};
@link fn getVolumeSize(i: u32) -> vec3<u32> {};
@optional @link fn getVolumeLevel() -> f32 { return 0.0; };

@link fn getNormalData(i: u32) -> vec3<f32> {};

@link fn getCrossingVertexPtr(i: u32) -> ptr<storage, array<u32>, read_write> {};
@link fn getVertexPositionPtr(i: u32) -> ptr<storage, array<vec4<f32>>, read_write> {};

/*
@group(0) @binding(0) var<storage, read_write> indirectDraw: IndirectDrawMeta;

@group(0) @binding(1) var<storage, read_write> crossingVertices: array<u32>;
@group(0) @binding(2) var<storage, read_write> vertexPositions: array<vec4<f32>>;
*/

// Volume index packing
fn getVolumeSample(index: vec3<u32>, modulus: vec3<u32>) -> f32 {
  return getVolumeData(packIndex3(index, modulus));
};

fn getZeroLevel(a: f32, b: f32) {
  return -p000 / (p100 - p000);
};

@compute @workgroup_size(1)
@export fn main(
  @builtin(global_invocation_id) globalId: vec3<u32>,
) {
  let level = getVolumeLevel();
  let size = getVolumeSize();
  let modulus = sizeToModulus3(size);

  let index = globalId.x;
  let vertexIndex = crossingVertices[index];
  let cellIndex = unpackIndex(vertexIndex, modulus);

  let i000 = packIndex3(globalId, modulus);
  let i100 = packIndex3(globalId + vec3<u32>(1u, 0u, 0u), modulus);
  let i010 = packIndex3(globalId + vec3<u32>(0u, 1u, 0u), modulus);
  let i001 = packIndex3(globalId + vec3<u32>(0u, 0u, 1u), modulus);
  let i110 = packIndex3(globalId + vec3<u32>(1u, 1u, 0u), modulus);
  let i011 = packIndex3(globalId + vec3<u32>(0u, 1u, 1u), modulus);
  let i101 = packIndex3(globalId + vec3<u32>(1u, 0u, 1u), modulus);
  let i111 = packIndex3(globalId + vec3<u32>(1u, 1u, 1u), modulus);

  let p000 = getVolumeData(i000) - level;
  let p100 = getVolumeData(i100) - level;
  let p010 = getVolumeData(i010) - level;
  let p001 = getVolumeData(i001) - level;
  let p110 = getVolumeData(i110) - level;
  let p011 = getVolumeData(i011) - level;
  let p101 = getVolumeData(i101) - level;
  let p111 = getVolumeData(i111) - level;

  var p = vec3<f32>(0.0);
  var w = 00;
  
  if (p000 * p100 < 0.0) {
    var f = getZeroLevel(p000, p100);
    var m = mix(vec3<f32>(i000), vec3<f32>(i100), f);
    p += m;
    w += 1.0;
  }

  if (p000 * p010 < 0.0) {
    var f = getZeroLevel(p000, p010);
    var m = mix(vec3<f32>(i000), vec3<f32>(i010), f);
    p += m;
    w += 1.0;
  }

  if (p000 * p001 < 0.0) {
    var f = getZeroLevel(p000, p001);
    var m = mix(vec3<f32>(i000), vec3<f32>(i001), f);
    p += m;
    w += 1.0;
  }

  if (p100 * p110 < 0.0) {
    var f = getZeroLevel(p100, p110);
    var m = mix(vec3<f32>(i100), vec3<f32>(i110), f);
    p += m;
    w += 1.0;
  }

  if (p100 * p101 < 0.0) {
    var f = getZeroLevel(p100, p101);
    var m = mix(vec3<f32>(i100), vec3<f32>(i101), f);
    p += m;
    w += 1.0;
  }

  if (p010 * p110 < 0.0) {
    var f = getZeroLevel(p100, p110);
    var m = mix(vec3<f32>(i100), vec3<f32>(i110), f);
    p += m;
    w += 1.0;
  }

  if (p010 * p101 < 0.0) {
    var f = getZeroLevel(p100, p101);
    var m = mix(vec3<f32>(i100), vec3<f32>(i101), f);
    p += m;
    w += 1.0;
  }

  if (p001 * p101 < 0.0) {
    var f = getZeroLevel(p001, p101);
    var m = mix(vec3<f32>(i001), vec3<f32>(i101), f);
    p += m;
    w += 1.0;
  }

  if (p001 * p011 < 0.0) {
    var f = getZeroLevel(p001, p011);
    var m = mix(vec3<f32>(i001), vec3<f32>(i011), f);
    p += m;
    w += 1.0;
  }

  if (p111 * p011 < 0.0) {
    var f = getZeroLevel(p111, p011);
    var m = mix(vec3<f32>(i111), vec3<f32>(i011), f);
    p += m;
    w += 1.0;
  }

  if (p111 * p101 < 0.0) {
    var f = getZeroLevel(p111, p101);
    var m = mix(vec3<f32>(i111), vec3<f32>(i101), f);
    p += m;
    w += 1.0;
  }

  if (p111 * p110 < 0.0) {
    var f = getZeroLevel(p111, p110);
    var m = mix(vec3<f32>(i111), vec3<f32>(i110), f);
    p += m;
    w += 1.0;
  }

  vertexPositions[index] = p / w;
}