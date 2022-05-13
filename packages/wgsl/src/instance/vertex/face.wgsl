use '@use-gpu/wgsl/use/types'::{ MeshVertex };
use '@use-gpu/wgsl/use/view'::{ viewUniforms, worldToClip };

@optional @link fn getPosition(i: u32) -> vec4<f32> { return vec4<f32>(0.0, 0.0, 0.0, 1.0); };
@optional @link fn getNormal(i: u32) -> vec4<f32> { return vec4<f32>(0.0, 0.0, 1.0, 1.0); };
@optional @link fn getSegment(i: u32) -> i32 { return -1; };
@optional @link fn getColor(i: u32) -> vec4<f32> { return vec4<f32>(0.5, 0.5, 0.5, 1.0); };

@export fn getFaceVertex(vertexIndex: u32, instanceIndex: u32) -> MeshVertex {
  var NaN: f32 = bitcast<f32>(0xffffffffu);

  var segment = getSegment(instanceIndex);
  
  var cornerIndex: u32;
  if (segment == -1) {
    cornerIndex = instanceIndex * 3u + vertexIndex;
  }
  else if (segment == 0) {
    return MeshVertex(
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
  var position = worldToClip(getPosition(cornerIndex));
  var normal = getNormal(cornerIndex).xyz;
  var uv = vec2<f32>(0.5, 0.5);

  return MeshVertex(
    position,
    normal,
    color,
    uv,
    instanceIndex,
  );
}
