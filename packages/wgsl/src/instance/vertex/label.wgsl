use '@use-gpu/wgsl/use/types'::{ UIVertex };
use '@use-gpu/wgsl/geometry/quad'::{ getQuadUV };
use '@use-gpu/wgsl/use/view'::{ viewUniforms, worldToClip, getPerspectiveScale }; 

@external fn getIndex(i: u32) -> u32 {};
@external fn getRectangle(i: u32) -> vec4<f32> {};
@external fn getUV(i: u32) -> vec2<f32> {};
@external fn getLayout(i: u32) -> vec2<f32> {};

@external fn getPosition(i: i32) -> vec4<f32> {};
@external fn getPlacement(i: u32) -> vec2<f32> {};
@external fn getOffset(i: u32) -> f32 {};
@external fn getSize(i: u32) -> f32 {};
@external fn getDepth(i: i32) -> f32 {};
@external fn getColor(i: u32) -> f32 {};
@external fn getExpand(i: u32) -> f32 {};
// @external fn getFlip(i: u32) -> f32;

@external fn getSDFConfig(i: u32) -> vec2<f32> {};

@export fn getLabelVertex(vertexIndex: u32, instanceIndex: u32) -> UIVertex {

  var sdfConfig = getSDFConfig(instanceIndex);
  var fontSize = sdfConfig.z;

  var index = getIndex(instanceIndex);
  var rectangle = getRectangle(instanceIndex);
  var uv4 = getUV(instanceIndex);

  var position = getPosition(index);
  var placement = getPlacement(index);
  var layout = getLayout(index);
  var offset = getOffset(index);
  var size = getSize(index);
  var depth = getDepth(index);
  var color = getColor(index);
  var expand = getExpand(index);
  // var flip = getFlip(index);

  var center = worldToClip(position);
  
  // Lay out quad
  var uv1 = getQuadUV(vertexIndex);
  var xy1 = uv1 * 2.0 - 1.0;
  var origin = ((placement - 1.0) * 0.5 * layout) + (offset * placement);

  // Lerp between fixed size and full perspective.
  var pixelScale = getPerspectiveScale(center.w, depth);

  // Factor in relative font and atlas scale
  var glyphScale = size / fontSize;
  var finalScale = pixelScale * glyphScale;

  // Apply half pixel edge bleed on XY and UV
  var xy: vec2<f32>;
  var uv: vec2<f32>;
  /*
  if (HAS_EDGE_BLEED) {
    let bleed = 0.5;
    var ul = (rectangle.xy + origin) * finalScale - bleed;
    var br = (rectangle.zw + origin) * finalScale + bleed;
    var wh = (rectangle.zw - rectangle.xy) * finalScale;

    xy = mix(ul, br, uv1);
    uv = mix(uv4.xy, uv4.zw, uv1 + xy1 * bleed / wh);
  }
  else {
  */
    xy = mix(rectangle.xy + origin, rectangle.zw + origin, uv1) * finalScale;
    uv = mix(uv4.xy, uv4.zw, uv1);
  // }

  xy = xy * vec2<f32>(1.0, -1.0);

  // Attach to position
  center = vec4<f32>(center.xy + 2.0 * xy * viewUniforms.viewResolution * center.w, center.zw);

  let sdfUV = uv;
  let textureUV = uv;
  let box = rectangle.zw - rectangle.xy;

  return UIVertex(
    center,
    uv1,
    sdfConfig,
    sdfUV,
    textureUV,
    0,
    -1,
    vec4<f32>(layout, 0.0, 0.0),
    vec4<f32>(0.0),
    vec4<f32>(expand, 0.0, 0.0, 0.0),
    vec4<f32>(0.0),
    color,
    instanceIndex,
  );
}