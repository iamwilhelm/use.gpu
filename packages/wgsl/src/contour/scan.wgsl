@group(0) @binding(0) var<storage, read_write> crossingEdges: array<u32>;
@group(0) @binding(1) var<storage, read_write> nextEdgeIndex: atomic<u32>;

fn appendEdge(id: u32) {
  let cell = atomicAdd(&nextEdgeIndex, 1u);
  crossingEdges[cell] = id;
}

fn packEdgeId(index: vec3<u32>, axis: u32) -> u32 {
  let shifted = vec4<u32>(index, axis) << vec4<u32>(0u, 10u, 20u, 30u);
  return shifted.x | shifted.y | shifted.z | shifted.w;
}

@link fn getVolumeData(i: u32) -> f32 {};
@optional @link fn getVolumeLevel() -> f32 { return 0.0; };

fn sizeToModulus(size: vec3<u32>) -> vec3<u32> {
  let ny = size.x * size.y;
  return vec3<u32>(size.x, ny, 0xffffffffu);
}

fn packIndex(index: vec3<u32>, modulus: vec3<u32>) -> u32 {
  let offsets = index * vec3<u32>(1u, modulus.xy);
  return dot(offsets, vec3<u32>(1u, 1u, 1u));
}

fn getVolumeSample(modulus: vec3<u32>, uvw: vec3<u32>) -> f32 {
  return getVolumeData(packIndex(uvw, modulus));
};


@compute @workgroup_size(1)
@export fn main(
  @builtin(global_invocation_id) globalId: vec3<u32>,
  @builtin(num_workgroups) numWorkgroups: vec3<u32>,
) {
  let level = getVolumeLevel();
  let modulus = sizeToModulus(numWorkgroups + 1u);

  let p  = getVolumeSample(modulus, globalId);
  let px = getVolumeSample(modulus, globalId + vec3<u32>(1u, 0u, 0u));
  let py = getVolumeSample(modulus, globalId + vec3<u32>(0u, 1u, 0u));
  let pz = getVolumeSample(modulus, globalId + vec3<u32>(0u, 0u, 1u));

  let sp = sign(p - level);
  let sx = sign(px - level);
  let sy = sign(py - level);
  let sz = sign(pz - level);

  let check = globalId.yzx * globalId.zxy;
  if (check.x > 0u) {
    if (sx * sp < 0.0) {
      appendEdge(packEdgeId(globalId, 1u));
    }
  }
  if (check.y > 0u) {
    if (sy * sp < 0.0) {
      appendEdge(packEdgeId(globalId, 2u));
    }
  }
  if (check.z > 0u) {
    if (sz * sp < 0.0) {
      appendEdge(packEdgeId(globalId, 3u));
    }
  }
}
