use '@use-gpu/wgsl/use/array'::{ sizeToModulus3, packIndex3 };
use './types'::{ IndirectDrawMeta };

@link var<storage, read_write> indirectDraw: IndirectDrawMeta;
@link var<storage, read_write> activeEdges: array<u32>;
@link var<storage, read_write> activeCells: array<u32>;
@link var<storage, read_write> markedCells: array<atomic<u32>>;
@link var<storage, read_write> vertexIndices: array<u32>;

@link fn getValueData(i: u32) -> f32 {};
@link fn getVolumeSize(i: u32) -> vec3<u32> {};
@optional @link fn getVolumeLevel(i: u32) -> f32 { return 0.0; };

// Append any X/Y/Z edge that crosses the level set
fn appendEdge(id: u32) {
  let nextEdge = atomicAdd(&indirectDraw.instanceCount, 1u);
  activeEdges[nextEdge] = id;
}

// Append a vertex that parallels an active edge
fn appendVertex(i: u32) {
  let g = indirectDraw.generationIndex;

  // Check if vertex was already assigned by a neighbor
  let lastGeneration = atomicMax(&markedCells[i], g);
  if (lastGeneration != g) {

    // Assign to next free index
    let nextCell = atomicAdd(&indirectDraw.nextVertexIndex, 1u);
    activeCells[nextCell] = i;
    vertexIndices[i] = nextCell;
  }
}

// Pack edge ID into 32-bit uint
fn packEdgeId(index: vec3<u32>, axis: u32) -> u32 {
  let shifted = vec4<u32>(index, axis) << vec4<u32>(0u, 10u, 20u, 30u);
  return shifted.x | shifted.y | shifted.z | shifted.w;
}

@compute @workgroup_size(1)
@export fn main(
  @builtin(global_invocation_id) globalId: vec3<u32>,
) {
  let level = getVolumeLevel(0u);
  let size = getVolumeSize(0u);
  let modulus = sizeToModulus3(vec4<u32>(size, 1u));

  let base = packIndex3(globalId, modulus);

  let p  = getValueData(base) - level;
  let px = getValueData(base + packIndex3(vec3<u32>(1u, 0u, 0u), modulus)) - level;
  let py = getValueData(base + packIndex3(vec3<u32>(0u, 1u, 0u), modulus)) - level;
  let pz = getValueData(base + packIndex3(vec3<u32>(0u, 0u, 1u), modulus)) - level;

  let check = globalId.yzx * globalId.zxy;
  if (check.x > 0u) {
    if (px * p < 0.0) {
      appendEdge(packEdgeId(globalId, 1u));

      appendVertex(base - packIndex3(vec3<u32>(0u, 1u, 1u), modulus));
      appendVertex(base - packIndex3(vec3<u32>(0u, 1u, 0u), modulus));
      appendVertex(base - packIndex3(vec3<u32>(0u, 0u, 1u), modulus));
      appendVertex(base);
    }
  }
  if (check.y > 0u) {
    if (py * p < 0.0) {
      appendEdge(packEdgeId(globalId, 2u));

      appendVertex(base - packIndex3(vec3<u32>(1u, 0u, 1u), modulus));
      appendVertex(base - packIndex3(vec3<u32>(1u, 0u, 0u), modulus));
      appendVertex(base - packIndex3(vec3<u32>(0u, 0u, 1u), modulus));
      appendVertex(base);
    }
  }
  if (check.z > 0u) {
    if (pz * p < 0.0) {
      appendEdge(packEdgeId(globalId, 3u));

      appendVertex(base - packIndex3(vec3<u32>(1u, 1u, 0u), modulus));
      appendVertex(base - packIndex3(vec3<u32>(1u, 0u, 0u), modulus));
      appendVertex(base - packIndex3(vec3<u32>(0u, 1u, 0u), modulus));
      appendVertex(base);
    }
  }
}
