use '@use-gpu/wgsl/use/types'::{ ShadedVertex };
use '@use-gpu/wgsl/use/array'::{ sizeToModulus3, packIndex3 };
use '@use-gpu/wgsl/use/view'::{ getViewResolution, worldToClip, getPerspectiveScale, getViewScale, applyZBias }; 
use '@use-gpu/wgsl/geometry/quad'::{ getQuadIndex };

@link fn getEdgeId(i: u32) -> u32 { };
@link fn getVertexIndex(i: u32) -> u32 { };
@link fn getVertexPosition(i: u32) -> vec4<f32> { };
@link fn getVertexNormal(i: u32) -> vec4<f32> { };

@link fn transformPosition(p: vec4<f32>) -> vec4<f32>;
@link fn getVolumeSize(i: u32) -> vec3<u32> { };

@optional @link fn getColor(i: u32) -> vec4<f32> { return vec4<f32>(0.5, 0.5, 0.5, 1.0); };
@optional @link fn getZBias(i: u32) -> f32 { return 0.0; };

@optional @link fn getRangeMin(i: u32) -> vec3<f32> { return vec3<f32>(-1.0, -1.0, -1.0); };
@optional @link fn getRangeMax(i: u32) -> vec3<f32> { return vec3<f32>(1.0, 1.0, 1.0); };

fn unpackEdgeId(id: u32) -> vec4<u32> {
  return (vec4<u32>(id) >> vec4<u32>(0u, 9u, 18u, 27u)) & vec4<u32>(0x1FFu);
}

@export fn getDualContourVertex(vertexIndex: u32, instanceIndex: u32) -> ShadedVertex {

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
    //color = mix(color, vec4<f32>(1.0, 0.0, 0.0, 1.0), 0.15);
  }
  else if (edgeIndex.a == 2u) {
    gridIndex -= vec3<u32>(0u, ij.yx);
    //color = mix(color, vec4<f32>(1.0, 0.0, 0.0, 1.0), 0.15);
  }
  else if (edgeIndex.a == 3u) {
    gridIndex -= vec3<u32>(ij.y, 0u, ij.x);
    //color = mix(color, vec4<f32>(0.0, 1.0, 0.0, 1.0), 0.15);
  }
  else if (edgeIndex.a == 4u) {
    gridIndex -= vec3<u32>(ij.x, 0u, ij.y);
    //color = mix(color, vec4<f32>(0.0, 1.0, 0.0, 1.0), 0.15);
  }
  else if (edgeIndex.a == 5u) {
    gridIndex -= vec3<u32>(ij, 0u);
    //color = mix(color, vec4<f32>(0.0, 0.0, 1.0, 1.0), 0.15);
  }
  else if (edgeIndex.a == 6u) {
    gridIndex -= vec3<u32>(ij.yx, 0u);
    //color = mix(color, vec4<f32>(0.0, 0.0, 1.0, 1.0), 0.15);
  }
  
  let modulus = sizeToModulus3(vec4<u32>(gridSize, 1u));
  let index = getVertexIndex(packIndex3(gridIndex, modulus));

  let vertex = getVertexPosition(index).xyz;
  let normal = getVertexNormal(index);

  let uv3 = vertex / (vec3<f32>(gridSize - 1u));
  let object = mix(rangeMin, rangeMax, uv3);
  let world = transformPosition(vec4<f32>(object, 1.0));

  var center = worldToClip(world);
  if (zBias != 0.0) {
    var vr = getViewResolution();
    var size = vr.y;
    center = applyZBias(center, size * zBias);
  }

  let tangent = vec4<f32>(0.0, 0.0, 0.0, 0.0);
  let uv4 = vec4<f32>(uv3, 0.0);
  let st4 = vec4<f32>(0.0);

  return ShadedVertex(
    center,
    world,
    normal,
    tangent,
    color,
    uv4,
    st4,
    instanceIndex,
 );
}