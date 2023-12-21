@link fn getInstanceSize() -> u32 {};

@export fn getInstancedIndex(instanceIndex: u32) -> vec2<u32> {
  var geometryIndex: u32;
  var uniformIndex: u32;

  let size = getInstanceSize();
  geometryIndex = instanceIndex % size;
  uniformIndex = instanceIndex / size;
  
  return vec2<u32>(geometryIndex, uniformIndex);
};