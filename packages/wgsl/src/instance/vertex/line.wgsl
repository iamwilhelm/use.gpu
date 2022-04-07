use '@use-gpu/wgsl/use/types'::{ SolidVertex };
use '@use-gpu/wgsl/use/view'::{ viewUniforms, worldToClip, worldToView, viewToClip, toClip3D, clipLineIntoView, getPerspectiveScale };
use '@use-gpu/wgsl/geometry/strip'::{ getStripIndex };
use '@use-gpu/wgsl/geometry/line'::{ getLineJoin };
use '@use-gpu/wgsl/geometry/arrow'::{ getArrowSize };

@external fn getPosition(i: i32) -> vec4<f32> {};
@external fn getSegment(i: i32) -> i32 {};
@external fn getColor(i: i32) -> vec4<f32> {};
@external fn getWidth(i: i32) -> f32 {};
@external fn getDepth(i: i32) -> f32 {};
  
@external fn getTrim(i: i32) -> vec4<i32> {};
@external fn getSize(i: i32) -> vec2<f32> {};

let ARROW_ASPECT: f32 = 2.5;

fn getAnchorDistance(anchor: vec3<f32>, tangent: vec3<f32>, center: vec3<f32>) -> f32 {
  var diff = center - anchor;

  var distance = dot(diff, tangent);
  var align = dot(normalize(diff), tangent);

  if (length(diff) == 0.0) { return 0.0; }
  else if (align > 0.92) { return distance; }
  else { return -1.0; }
}

fn trimAnchor(
  maxLength: f32,
  anchor: vec3<f32>,
  next: vec3<f32>,
  center: vec3<f32>,
  after: vec3<f32>,
  width: f32,
  size: f32,
  both: i32,
  w: f32,
  depth: f32,
) -> vec3<f32> {
  var NaN: f32 = bitcast<f32>(0xffffffffu);

  var tangent = normalize(next - anchor);
  var distanceStart = getAnchorDistance(anchor, tangent, center);
  var distanceEnd = getAnchorDistance(anchor, tangent, after);

  var arrowLength = getArrowSize(maxLength, width, size, both, w, depth) * ARROW_ASPECT;

  if (distanceStart >= 0.0 && distanceStart < arrowLength) {
    if (distanceEnd >= 0.0 && distanceEnd < arrowLength) {
      return vec3<f32>(NaN, NaN, NaN);
    }
    else {
      let ratio = (arrowLength - distanceStart) / (distanceEnd - distanceStart);
      return mix(center, after, ratio);
    }
  }

  return center;
}

fn clipLeft(left: vec3<f32>, right: vec3<f32>) -> vec3<f32> {
  if (left.z < 0.0)
  
  return center;
}

@export fn getLineVertex(vertexIndex: i32, instanceIndex: i32) -> SolidVertex {
  var NaN: f32 = bitcast<f32>(0xffffffffu);

  var ij = getStripIndex(vertexIndex);

  var segmentLeft = getSegment(instanceIndex);
  if (segmentLeft == 0 || segmentLeft == 2) {
    return SolidVertex(
      vec4(NaN, NaN, NaN, NaN),
      vec4(NaN, NaN, NaN, NaN),
      vec2(NaN, NaN),
    );
  }

  var uv = vec2<f32>(ij);
  var xy = uv * 2.0 - 1.0;

  var cornerIndex: i32;
  var joinIndex: i32;
  if (ij.x == 0) {
    joinIndex = LINE_JOIN_SIZE;
    cornerIndex = instanceIndex;
  }
  else {
    joinIndex = ij.x - 1;
    cornerIndex = instanceIndex + 1;
  }

  var trim = getTrim(instanceIndex);

  var segment = getSegment(cornerIndex);
  var color = getColor(cornerIndex);
  var width = getWidth(cornerIndex);
  var depth = getDepth(cornerIndex);

  var beforePos = getPosition(cornerIndex - 1);
  var centerPos = getPosition(cornerIndex);
  var afterPos = getPosition(cornerIndex + 1);

  // Trim from end points
  if (trim.z > 0) {
    var size = getSize(cornerIndex);

    var startPos = getPosition(trim.x);
    var midPos = getPosition((trim.x + trim.y) / 2);
    var endPos = getPosition(trim.y);

    let maxLength = length(endPos.xyz - midPos.xyz) + length(midPos.xyz - startPos.xyz);

    var both = 0;
    if (trim.z == 3) { both = 1; }

    if ((trim.z & 1) != 0) {
      var start = worldToClip(startPos);
      if (start.w > 0.0) {
        var nextPos = getPosition(trim.x + 1);
        var trimmed = trimAnchor(maxLength, startPos.xyz, nextPos.xyz, centerPos.xyz, afterPos.xyz, width, size, both, start.w, depth);
        centerPos = vec4<f32>(trimmed, 1.0);
      }
    }
    if ((trim.z & 2) != 0) {
      var end = worldToClip(endPos);
      if (end.w > 0.0) {
        var nextPos = getPosition(trim.y - 1);
        var trimmed = trimAnchor(maxLength, endPos.xyz, nextPos.xyz, centerPos.xyz, beforePos.xyz, width, size, both, end.w, depth);
        centerPos = vec4<f32>(trimmed, 1.0);
      }
    }
  }

  // Clip ends into view
  var near = viewUniforms.viewNearFar.x * 2.0;
  var clipBeforeV = clipLineIntoView(beforePos, centerPos, near);
  var clipAfterV  = clipLineIntoView(afterPos, centerPos, near);

  var before = toClip3D(viewToClip(clipBeforeV));
  var after  = toClip3D(viewToClip(clipAfterV));

  var centerV = worldToView(centerPos);
  var center4 = viewToClip(centerV);

  if (center4.w <= 0.0) {
    if (ij.x == 0) { centerV = clipLineIntoView(centerPos, afterPos, near); }
    if (ij.x != 0) { centerV = clipLineIntoView(centerPos, beforePos, near); }
    else {
      return SolidVertex(
        vec4(NaN, NaN, NaN, NaN),
        vec4(NaN, NaN, NaN, NaN),
        vec2(NaN, NaN),
      );
    }
    center4 = viewToClip(centerV);
  }

  var center = toClip3D(center4);

  // Lerp between fixed size and full perspective
  var pixelScale = getPerspectiveScale(center4.w, depth);
  width = width * pixelScale;

  var arc = f32(joinIndex) / f32(LINE_JOIN_SIZE);
  var lineJoin = getLineJoin(before, center, after, arc, xy.y, width, segment, LINE_JOIN_STYLE);

  return SolidVertex(
    vec4<f32>(lineJoin, 1.0),
    color,
    uv,
  );
}
