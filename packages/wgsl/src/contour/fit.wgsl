use '@use-gpu/wgsl/use/array'::{ sizeToModulus3, packIndex3, unpackIndex3 };

@link var<storage, read_write> activeCells: array<u32>;
@link var<storage, read_write> vertexPositions: array<vec4<f32>>;

@link fn getValueData(i: u32) -> f32 {};
@link fn getNormalData(i: u32) -> vec3<f32> {};
@link fn getVolumeSize(i: u32) -> vec3<u32> {};
@optional @link fn getVolumeLevel(i: u32) -> f32 { return 0.0; };

fn getZeroLevel(a: f32, b: f32) -> f32 {
  return -a / (b - a);
};

@compute @workgroup_size(1)
@export fn main(
  @builtin(global_invocation_id) globalId: vec3<u32>,
) {
  let level = getVolumeLevel(0u);
  let size = getVolumeSize(0u);
  let modulus = sizeToModulus3(vec4<u32>(size, 1u));

  let index = globalId.x;
  let cellIndex = activeCells[index];

  let cellOrigin = vec3<f32>(unpackIndex3(cellIndex, modulus));

  let i000 = cellIndex;
  let i100 = cellIndex + packIndex3(vec3<u32>(1u, 0u, 0u), modulus);
  let i010 = cellIndex + packIndex3(vec3<u32>(0u, 1u, 0u), modulus);
  let i001 = cellIndex + packIndex3(vec3<u32>(0u, 0u, 1u), modulus);
  let i110 = cellIndex + packIndex3(vec3<u32>(1u, 1u, 0u), modulus);
  let i011 = cellIndex + packIndex3(vec3<u32>(0u, 1u, 1u), modulus);
  let i101 = cellIndex + packIndex3(vec3<u32>(1u, 0u, 1u), modulus);
  let i111 = cellIndex + packIndex3(vec3<u32>(1u, 1u, 1u), modulus);

  let p000 = getValueData(i000) - level;
  let p100 = getValueData(i100) - level;
  let p010 = getValueData(i010) - level;
  let p001 = getValueData(i001) - level;
  let p110 = getValueData(i110) - level;
  let p011 = getValueData(i011) - level;
  let p101 = getValueData(i101) - level;
  let p111 = getValueData(i111) - level;

  let n000 = getNormalData(i000);

  var p = vec3<f32>(0.0);
  var w = 0.0;
  
  if (p000 * p100 < 0.0) {
    var f = getZeroLevel(p000, p100);
    var m = vec3<f32>(f, 0.0, 0.0);
    p += m;
    w += 1.0;
  }

  if (p000 * p010 < 0.0) {
    var f = getZeroLevel(p000, p010);
    var m = vec3<f32>(0.0, f, 0.0);
    p += m;
    w += 1.0;
  }

  if (p000 * p001 < 0.0) {
    var f = getZeroLevel(p000, p001);
    var m = vec3<f32>(0.0, 0.0, f);
    p += m;
    w += 1.0;
  }

  if (p100 * p110 < 0.0) {
    var f = getZeroLevel(p100, p110);
    var m = vec3<f32>(1.0, f, 0.0);
    p += m;
    w += 1.0;
  }

  if (p100 * p101 < 0.0) {
    var f = getZeroLevel(p100, p101);
    var m = vec3<f32>(1.0, 0.0, f);
    p += m;
    w += 1.0;
  }

  if (p010 * p110 < 0.0) {
    var f = getZeroLevel(p010, p110);
    var m = vec3<f32>(f, 1.0, 0.0);
    p += m;
    w += 1.0;
  }

  if (p010 * p011 < 0.0) {
    var f = getZeroLevel(p010, p011);
    var m = vec3<f32>(0.0, 1.0, f);
    p += m;
    w += 1.0;
  }

  if (p001 * p101 < 0.0) {
    var f = getZeroLevel(p001, p101);
    var m = vec3<f32>(f, 0.0, 1.0);
    p += m;
    w += 1.0;
  }

  if (p001 * p011 < 0.0) {
    var f = getZeroLevel(p001, p011);
    var m = vec3<f32>(0.0, f, 1.0);
    p += m;
    w += 1.0;
  }

  if (p011 * p111 < 0.0) {
    var f = getZeroLevel(p011, p111);
    var m = vec3<f32>(f, 1.0, 1.0);
    p += m;
    w += 1.0;
  }

  if (p101 * p111 < 0.0) {
    var f = getZeroLevel(p101, p111);
    var m = vec3<f32>(1.0, f, 1.0);
    p += m;
    w += 1.0;
  }

  if (p110 * p111 < 0.0) {
    var f = getZeroLevel(p110, p111);
    var m = vec3<f32>(1.0, 1.0, f);
    p += m;
    w += 1.0;
  }

  vertexPositions[index] = vec4<f32>(cellOrigin + p / w, 1.0);
}