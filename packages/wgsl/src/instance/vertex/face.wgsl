use '@use-gpu/wgsl/use/types'::{ ShadedVertex };
use '@use-gpu/wgsl/use/view'::{ worldToClip, getViewPosition };

@optional @link fn getPosition(i: u32) -> vec4<f32> { return vec4<f32>(0.0, 0.0, 0.0, 1.0); };
@optional @link fn getNormal(i: u32) -> vec4<f32> { return vec4<f32>(0.0, 0.0, 1.0, 1.0); };
@optional @link fn getSegment(i: u32) -> i32 { return -1; };
@optional @link fn getColor(i: u32) -> vec4<f32> { return vec4<f32>(0.5, 0.5, 0.5, 1.0); };

@optional @link fn getIndex(i: u32) -> u32 { return 0u; };
@optional @link fn getLookup(i: u32) -> u32 { return i; };

@export fn getFaceVertex(vertexIndex: u32, instanceIndex: u32) -> ShadedVertex {
  var NaN: f32 = bitcast<f32>(0xffffffffu);

  var segment = getSegment(instanceIndex);
  
  var cornerIndex: u32;
  if (HAS_INDICES) {
    cornerIndex = getIndex(instanceIndex * 3u + vertexIndex);
  }
  else if (segment == -1) {
    cornerIndex = instanceIndex * 3u + vertexIndex;
  }
  else if (segment == 0) {
    return ShadedVertex(
      vec4(NaN, NaN, NaN, NaN),
      vec4(NaN, NaN, NaN, NaN),
      vec3(NaN, NaN, NaN),
      vec4(NaN, NaN, NaN, NaN),
      vec2(NaN, NaN),
      0u,
    );
  }
  else {
    if (vertexIndex == 0u) {
      cornerIndex = instanceIndex - u32(segment - 1);
    }
    else if (vertexIndex == 1u) {
      cornerIndex = instanceIndex + 1u;
    }
    else {
      cornerIndex = instanceIndex + 2u;
    }
  }

  var color = getColor(cornerIndex);
  var world = getPosition(cornerIndex);
  var position = worldToClip(world);
  var normal = getNormal(cornerIndex).xyz;
  var uv = vec2<f32>(0.5, 0.5);

  var viewPosition = getViewPosition().xyz;

  return ShadedVertex(
    position,
    world,
    normal,
    color,
    uv,
    getLookup(cornerIndex),
  );
}
