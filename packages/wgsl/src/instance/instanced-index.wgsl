@link fn getInstanceSize() -> u32 {};

@export fn getInstancedIndex(instanceIndex: u32) -> vec2<u32> {
  var geometryIndex: u32;
  var uniformIndex: u32;

  let size = getInstanceSize();
  if (size > 0u) {
    geometryIndex = instanceIndex % size;
    uniformIndex = instanceIndex / size;
  }
  else {
    geometryIndex = instanceIndex;
    uniformIndex = instanceIndex;
  }
  
  return vec2<u32>(geometryIndex, uniformIndex);
};