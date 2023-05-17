use '@use-gpu/wgsl/use/types'::{ SolidVertex };
use '@use-gpu/wgsl/use/view'::{ worldToClip, worldToView, viewToClip, to3D, clipLineIntoView, getPerspectiveScale, applyZBias3 };
use '@use-gpu/wgsl/geometry/strip'::{ getStripIndex };
use '@use-gpu/wgsl/geometry/line'::{ getLineJoin };
use '@use-gpu/wgsl/geometry/arrow'::{ getArrowSize };

@optional @link fn getPosition(i: u32) -> vec4<f32> { return vec4<f32>(0.0, 0.0, 0.0, 1.0); };
@optional @link fn getScissor(i: u32) -> vec4<f32> { return vec4<f32>(1.0); };

@optional @link fn getSegment(i: u32) -> i32 { return 0; };
@optional @link fn getColor(i: u32) -> vec4<f32> { return vec4<f32>(0.5, 0.5, 0.5, 1.0); };
@optional @link fn getWidth(i: u32) -> f32 { return 1.0; };
@optional @link fn getDepth(i: u32) -> f32 { return 0.0; };
@optional @link fn getZBias(i: u32) -> f32 { return 0.0; };
  
@optional @link fn getTrim(i: u32) -> vec4<u32> { return vec4<u32>(0u, 0u, 0u, 0u); };
@optional @link fn getSize(i: u32) -> f32 { return 3.0; };

const ARROW_ASPECT: f32 = 2.5;

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
) -> vec4<f32> {
  var tangent = normalize(next - anchor);
  var distanceStart = getAnchorDistance(anchor, tangent, center);
  var distanceEnd = getAnchorDistance(anchor, tangent, after);

  var arrowLength = getArrowSize(maxLength, width, size, both, w, depth) * ARROW_ASPECT;

  if (distanceStart >= 0.0 && distanceStart < arrowLength) {
    let ratio = (arrowLength - distanceStart) / (distanceEnd - distanceStart);
    return vec4<f32>(mix(center, after, ratio), 1.0);
  }

  return vec4<f32>(center, 1.0);
}

@export fn getLineVertex(vertexIndex: u32, instanceIndex: u32) -> SolidVertex {
  var ij = getStripIndex(vertexIndex);

  var segmentLeft = getSegment(instanceIndex);
  if (segmentLeft == 0 || segmentLeft == 2) {
    return SolidVertex(
      vec4<f32>(0.0),
      vec4<f32>(0.0),
      vec4<f32>(0.0),
      vec4<f32>(0.0),
      vec4<f32>(0.0),
      0u,
    );
  }

  var uv = vec2<f32>(ij);
  var xy = uv * 2.0 - 1.0;

  let uv4 = vec4<f32>(uv, 0.0, 0.0);
  let st4 = vec4<f32>(0.0);

  var cornerIndex: u32;
  var joinIndex: u32;
  if (ij.x == 0u) {
    joinIndex = u32(LINE_JOIN_SIZE);
    cornerIndex = instanceIndex;
  }
  else {
    joinIndex = ij.x - 1u;
    cornerIndex = instanceIndex + 1u;
  }

  let trim = getTrim(instanceIndex);
  var trimMode = i32(trim.z);

  let segment = getSegment(cornerIndex);
  let color = getColor(cornerIndex);
  var width = getWidth(cornerIndex);
  let depth = getDepth(cornerIndex);
  let zBias = getZBias(cornerIndex);
  
  var centerPos = getPosition(cornerIndex);
  var beforePos = centerPos;
  var afterPos = centerPos;

  let scissor = getScissor(cornerIndex);

  if (segment != 1) { beforePos = getPosition(cornerIndex - 1u); }
  else { trimMode = trimMode & 1; }
  if (segment != 2) { afterPos = getPosition(cornerIndex + 1u); }
  else { trimMode = trimMode & 2; }

  // Trim from end points
  if (trimMode > 0) {
    var size = getSize(cornerIndex);

    var startIndex = trim.x;
    var endIndex = trim.y;
    var midIndex = (startIndex + endIndex) / 2u;

    var startPos = getPosition(startIndex);
    var midPos = getPosition(midIndex);
    var endPos = getPosition(endIndex);

    let maxLength = length(endPos.xyz - midPos.xyz) + length(midPos.xyz - startPos.xyz);

    var both = 0;
    if (trimMode == 3) { both = 1; }

    if ((trimMode & 1) != 0) {
      var start = worldToClip(startPos);
      if (start.w > 0.0) {
        var nextPos = getPosition(trim.x + 1u);
        centerPos = trimAnchor(maxLength, startPos.xyz, nextPos.xyz, centerPos.xyz, afterPos.xyz, width, size, both, start.w, depth);
      }
    }
    if ((trimMode & 2) != 0) {
      var end = worldToClip(endPos);
      if (end.w > 0.0) {
        var nextPos = getPosition(trim.y - 1u);
        centerPos = trimAnchor(maxLength, endPos.xyz, nextPos.xyz, centerPos.xyz, beforePos.xyz, width, size, both, end.w, depth);
      }
    }
    
    if (centerPos.w == 0.0) {
      return SolidVertex(
        vec4<f32>(0.0),
        vec4<f32>(0.0),
        vec4<f32>(0.0),
        vec4<f32>(0.0),
        vec4<f32>(0.0),
        0u,
      );
    }
  }

  // Clip ends into view
  var clipBeforeV = clipLineIntoView(beforePos, centerPos);
  var clipAfterV  = clipLineIntoView(afterPos, centerPos);

  var before = to3D(viewToClip(clipBeforeV));
  var after  = to3D(viewToClip(clipAfterV));

  var centerV = worldToView(centerPos);
  var center4 = viewToClip(centerV);

  if (center4.w <= 0.0) {
    if (ij.x == 0u) {
      centerV = clipLineIntoView(centerPos, afterPos);
    }
    else if (ij.x != 0u) {
      centerV = clipLineIntoView(centerPos, beforePos);
    }
    else {
      return SolidVertex(
        vec4<f32>(0.0),
        vec4<f32>(0.0),
        vec4<f32>(0.0),
        vec4<f32>(0.0),
        vec4<f32>(0.0),
        0u,
      );
    }
    center4 = viewToClip(centerV);
  }

  var center = to3D(center4);

  // Lerp between fixed size and full perspective
  var pixelScale = getPerspectiveScale(center4.w, depth);
  width = width * pixelScale;

  var arc = f32(joinIndex) / f32(LINE_JOIN_SIZE);
  var lineJoin = getLineJoin(before, center, after, arc, xy.y, width, segment, LINE_JOIN_STYLE);

  if (zBias != 0.0) {
    lineJoin = applyZBias3(lineJoin, width * zBias, center4.w);
  }

  return SolidVertex(
    vec4<f32>(lineJoin, 1.0) * center4.w,
    color,
    uv4,
    st4,
    scissor,
    cornerIndex,
  );
}
