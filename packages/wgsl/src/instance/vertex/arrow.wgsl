use '@use-gpu/wgsl/use/types'::{ SolidVertex };
use '@use-gpu/wgsl/use/view'::{ worldToClip, worldToClip3D, getWorldScale };

@external fn getVertex(i: i32) -> vec4<f32> {};

@external fn getAnchor(i: i32) -> vec2<i32> {};

@external fn getPosition(i: i32) -> vec4<f32> {};
@external fn getColor(i: i32) -> vec4<f32> {};
@external fn getSize(i: i32) -> f32 {};
@external fn getWidth(i: i32) -> f32 {};
@external fn getDepth(i: i32) -> f32 {};

@export fn getArrowVertex(vertexIndex: i32, instanceIndex: i32) -> SolidVertex {
  var NaN: f32 = bitcast<f32>(0xffffffffu);

  let meshPosition = getVertex(vertexIndex);
  
  let anchor = getAnchor(instanceIndex);
  let anchorIndex = anchor.x;
  let endIndex = anchor.y;
  
  let color = getColor(anchorIndex);
  let size = getSize(anchorIndex);
  let width = getWidth(anchorIndex);
  let depth = getDepth(anchorIndex);

  let startPos = getPosition(anchorIndex);
  let endPos = getPosition(endIndex);
  let center = worldToClip(startPos);

  // Lerp between fixed size and full perspective
  let worldScale = getWorldScale(center.w, depth);
  // TODO: awaiting compound support
  // width *= pixelScale;
  let finalSize = size * width * worldScale * 0.5;

  let t = normalize(endPos.xyz - startPos.xyz);

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

  //let position = vec4<f32>(meshPosition.xyz * finalSize + startPos.xyz, 1.0);
  let uv = vec2<f32>(f32(anchorIndex), 0.0);

  let orientedPos = m * vec4<f32>(meshPosition.xyz * finalSize, 1.0);
  let finalPos = vec4<f32>(orientedPos.xyz + startPos.xyz, 1.0);
  let position = worldToClip(finalPos);

  return SolidVertex(
    position,
    color,
    uv
  );
}
