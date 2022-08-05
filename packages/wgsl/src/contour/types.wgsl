@export struct IndirectDrawMeta {
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
