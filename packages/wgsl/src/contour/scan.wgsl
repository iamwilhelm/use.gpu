use '@use-gpu/wgsl/use/array'::{ sizeToModulus3, packIndex3 }

@link fn getVolumeData(i: u32) -> f32 {};
@link fn getVolumeSize(i: u32) -> vec3<u32> {};
@optional @link fn getVolumeLevel(i: u32) -> f32 { return 0.0; };

struct IndirectDrawMeta {
  // Build indirect draw call
  vertexCount: u32,
  instanceCount: atomic<u32>,
  firstVertex: u32,
  firstInstance: u32,

  // Vertex dispatch state
  nextVertexIndex: atomic<u32>,
  _unused1: u32,
  _unused2: u32,
  generationIndex: u32,
};

//@link fn getIndirectDrawPtr(i: u32) -> ptr<storage, IndirectDrawMeta, read_write> {};

///*
@group(0) @binding(0) var<storage, read_write> indirectDraw: IndirectDrawMeta;

@group(0) @binding(1) var<storage, read_write> crossingEdges: array<u32>;
@group(0) @binding(2) var<storage, read_write> crossingVertices: array<u32>;
@group(0) @binding(3) var<storage, read_write> markedVertices: array<atomic<u32>>;
@group(0) @binding(4) var<storage, read_write> vertexIndices: array<u32>;
//*/

// Append an X/Y/Z edge that crosses the level set
fn appendEdge(id: u32) {
  //let indirectDraw = getIndirectDrawPtr()
  let nextEdge = atomicAdd(&indirectDraw.instanceCount, 1u);
  crossingEdges[nextEdge] = id;
}

// Append a vertex that parallels a crossing edge
fn appendVertex(index: vec3<u32>, modulus: vec3<u32>) {
  let i = packIndex3(index, modulus);
  let g = indirectDraw.generationIndex;

  // Check if vertex was already assigned by a neighbor
  let lastGeneration = atomicMax(&markedVertices[i], g);
  if (lastGeneration != g) {

    // Assign to next free index
    let nextVertex = atomicAdd(&indirectDraw.nextVertexIndex, 1u);
    crossingVertices[nextVertex] = i;
    vertexIndices[i] = nextVertex;
  }
}

// Pack edge ID into 32-bit uint
fn packEdgeId(index: vec3<u32>, axis: u32) -> u32 {
  let shifted = vec4<u32>(index, axis) << vec4<u32>(0u, 10u, 20u, 30u);
  return shifted.x | shifted.y | shifted.z | shifted.w;
}

// Volume index packing
fn getVolumeSample(index: vec3<u32>, modulus: vec3<u32>) -> f32 {
  return getVolumeData(packIndex3(index, modulus));
};


@compute @workgroup_size(1)
@export fn main(
  @builtin(global_invocation_id) globalId: vec3<u32>,
) {
  let level = getVolumeLevel(0u);
  let size = getVolumeSize(0u);
  let modulus = sizeToModulus3(vec4<u32>(size, 1u));

  let p  = getVolumeSample(globalId, modulus) - level;
  let px = getVolumeSample(globalId + vec3<u32>(1u, 0u, 0u), modulus) - level;
  let py = getVolumeSample(globalId + vec3<u32>(0u, 1u, 0u), modulus) - level;
  let pz = getVolumeSample(globalId + vec3<u32>(0u, 0u, 1u), modulus) - level;

  let check = globalId.yzx * globalId.zxy;
  if (check.x > 0u) {
    if (px * p < 0.0) {
      appendEdge(packEdgeId(globalId, 1u));

      appendVertex(globalId - vec3<u32>(0u, 1u, 1u), modulus);
      appendVertex(globalId - vec3<u32>(0u, 1u, 0u), modulus);
      appendVertex(globalId - vec3<u32>(0u, 0u, 1u), modulus);
      appendVertex(globalId, modulus);
    }
  }
  if (check.y > 0u) {
    if (py * p < 0.0) {
      appendEdge(packEdgeId(globalId, 2u));

      appendVertex(globalId - vec3<u32>(1u, 0u, 1u), modulus);
      appendVertex(globalId - vec3<u32>(1u, 0u, 0u), modulus);
      appendVertex(globalId - vec3<u32>(0u, 0u, 1u), modulus);
      appendVertex(globalId, modulus);
    }
  }
  if (check.z > 0u) {
    if (pz * p < 0.0) {
      appendEdge(packEdgeId(globalId, 3u));

      appendVertex(globalId - vec3<u32>(1u, 1u, 0u), modulus);
      appendVertex(globalId - vec3<u32>(1u, 0u, 0u), modulus);
      appendVertex(globalId - vec3<u32>(0u, 1u, 0u), modulus);
      appendVertex(globalId, modulus);
    }
  }
}
