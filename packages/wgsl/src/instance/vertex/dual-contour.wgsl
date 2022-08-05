use '@use-gpu/wgsl/use/types'::{ SolidVertex };
use '@use-gpu/wgsl/use/array'::{ sizeToModulus3, packIndex3 };
use '@use-gpu/wgsl/use/view'::{ getViewResolution, worldToClip, getPerspectiveScale, getViewScale, applyZBias }; 
use '@use-gpu/wgsl/geometry/quad'::{ getQuadIndex };

@link fn getEdgeId(i: u32) -> u32 { };
@link fn getVertexIndex(i: u32) -> u32 { };
@link fn getVertexPosition(i: u32) -> vec4<f32> { };

@link fn transformPosition(p: vec4<f32>) -> vec4<f32>;
@link fn getVolumeSize(i: u32) -> vec3<u32> { };

@optional @link fn getColor(i: u32) -> vec4<f32> { return vec4<f32>(0.5, 0.5, 0.5, 1.0); };
@optional @link fn getZBias(i: u32) -> f32 { return 0.0; };

@optional @link fn getRangeMin(i: u32) -> vec3<f32> { return vec3<f32>(-1.0, -1.0, -1.0); };
@optional @link fn getRangeMax(i: u32) -> vec3<f32> { return vec3<f32>(1.0, 1.0, 1.0); };

fn unpackEdgeId(id: u32) -> vec4<u32> {
  return (vec4<u32>(id) >> vec4<u32>(0u, 10u, 20u, 30u)) & vec4<u32>(0x3FFu);
}

@export fn getDualContourVertex(vertexIndex: u32, instanceIndex: u32) -> SolidVertex {

  let edgeId = getEdgeId(instanceIndex);
  let edgeIndex = unpackEdgeId(edgeId);

  let gridSize = getVolumeSize(instanceIndex);

  var color = getColor(instanceIndex);
  let zBias = getZBias(instanceIndex);

  let rangeMin = getRangeMin(instanceIndex);
  let rangeMax = getRangeMax(instanceIndex);

  let ij = getQuadIndex(vertexIndex);

  var gridIndex = edgeIndex.xyz;
  if (edgeIndex.a == 1u) {
    gridIndex -= vec3<u32>(0u, ij);
    color = mix(color, vec4<f32>(1.0, 0.0, 0.0, 1.0), 0.5);
  }
  else if (edgeIndex.a == 2u) {
    gridIndex -= vec3<u32>(ij.x, 0u, ij.y);
    color = mix(color, vec4<f32>(0.0, 1.0, 0.0, 1.0), 0.5);
  }
  else if (edgeIndex.a == 3u) {
    gridIndex -= vec3<u32>(ij, 0u);
    color = mix(color, vec4<f32>(0.0, 0.0, 1.0, 1.0), 0.5);
  }

  let modulus = sizeToModulus3(vec4<u32>(gridSize, 1u));
  let i = packIndex3(gridIndex, modulus);

  let vertex = getVertexPosition(getVertexIndex(i)).xyz;
  let uv3 = vertex / (vec3<f32>(gridSize - 1u));
  let position = mix(rangeMin, rangeMax, uv3);
  var center = worldToClip(transformPosition(vec4<f32>(position, 1.0)));

  if (zBias != 0.0) {
    var vr = getViewResolution();
    var size = vr.y;
    center = applyZBias(center, size * zBias);
  }

  let uv4 = vec4<f32>(uv3, 0.0);
  let st4 = vec4<f32>(0.0);

  return SolidVertex(
    center,
    color,
    uv4,
    st4,
    instanceIndex,
  );
}