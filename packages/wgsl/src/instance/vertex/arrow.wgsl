use '@use-gpu/wgsl/use/types'::{ SolidVertex };
use '@use-gpu/wgsl/use/view'::{ worldToClip, worldToClip3D };
use '@use-gpu/wgsl/geometry/arrow'::{ getArrowSize, getArrowCorrection };

@external fn getVertex(i: i32) -> vec4<f32> {};

@external fn getAnchor(i: i32) -> vec4<i32> {};

@external fn getPosition(i: i32) -> vec4<f32> {};
@external fn getColor(i: i32) -> vec4<f32> {};
@external fn getSize(i: i32) -> f32 {};
@external fn getWidth(i: i32) -> f32 {};
@external fn getDepth(i: i32) -> f32 {};
  
let ARROW_ASPECT: f32 = 2.5;

@export fn getArrowVertex(vertexIndex: i32, instanceIndex: i32) -> SolidVertex {
  var NaN: f32 = bitcast<f32>(0xffffffffu);

  let meshPosition = getVertex(vertexIndex);
  
  let anchor = getAnchor(instanceIndex);
  let anchorIndex = anchor.x;
  let nextIndex = anchor.y;
  let endIndex = anchor.z;
  let both = anchor.w;
  
  let color = getColor(anchorIndex);
  let size = getSize(anchorIndex);
  let width = getWidth(anchorIndex);
  let depth = getDepth(anchorIndex);

  let startPos = getPosition(anchorIndex);
  let nextPos = getPosition(nextIndex);
  let midPos = getPosition((anchorIndex + endIndex) / 2);
  let endPos = getPosition(endIndex);

  let center = worldToClip(startPos);

  let maxLength = length(endPos.xyz - midPos.xyz) + length(midPos.xyz - startPos.xyz);
  let arrowSize = getArrowSize(maxLength, width, size, both, center.w, depth);

  let t = normalize(nextPos.xyz - startPos.xyz);

  var u: vec3<f32>;
  if (abs(t.z) > 0.5) { u = vec3<f32>(1.0, 0.0, 0.0); }
  else { u = vec3<f32>(0.0, 0.0, 1.0); };

  let n = normalize(cross(t, u));
  let b = cross(t, n);

  let m = mat4x4<f32>(
    vec4<f32>(t.xyz, 0.0),
    vec4<f32>(b.xyz, 0.0),
    vec4<f32>(n.xyz, 0.0),
    vec4<f32>(0.0, 0.0, 0.0, 1.0),
  );

  let offset = vec4<f32>(t.xyz, 0.0) * (ARROW_ASPECT * arrowSize);
  let cap = worldToClip(startPos + offset);
  let arrowRadius = getArrowCorrection(cap.w, center.w, depth);

  //let position = vec4<f32>(meshPosition.xyz * finalSize + startPos.xyz, 1.0);
  let uv = vec2<f32>(f32(anchorIndex), 0.0);

  let orientedPos = m * vec4<f32>(vec3<f32>(meshPosition.x, meshPosition.yz * arrowRadius) * arrowSize, 1.0);
  let finalPos = vec4<f32>(orientedPos.xyz + startPos.xyz, 1.0);
  let position = worldToClip(finalPos);

  return SolidVertex(
    position,
    color,
    uv,
  );
}
