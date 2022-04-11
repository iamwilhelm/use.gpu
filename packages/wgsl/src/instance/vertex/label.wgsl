use '@use-gpu/wgsl/use/types'::{ SolidVertex };
use '@use-gpu/wgsl/geometry/quad'::{ getQuadUV };
use '@use-gpu/wgsl/use/view'::{ viewUniforms, worldToClip, getPerspectiveScale }; 

@external fn getPosition(i: u32) -> vec4<f32>;
@external fn getBox(i: u32) -> f32;
@external fn getColor(i: u32) -> vec4<f32>;



@external fn getIndex(i: u32) -> u32;
@external fn getRectangle(i: u32) -> vec4<f32>;
@external fn getUV(i: u32) -> vec2<f32>;
@external fn getLayout(i: u32) -> vec2<f32>;

@external fn getPosition(i: i32) -> vec4<f32> {};
@external fn getColor(i: i32) -> vec4<f32> {};
@external fn getBackground(i: u32) -> vec4<f32>;
@external fn getDepth(i: i32) -> f32 {};
@external fn getOutline(i: u32) -> f32;

@external fn getPlacement(i: u32) -> vec2<f32>;
@external fn getOffset(i: u32) -> f32;
@external fn getSize(i: u32) -> f32;
// @external fn getFlip(i: u32) -> f32;

@export fn getLabelVertex(vertexIndex: i32, instanceIndex: i32) -> SolidVertex {

  var index = getIndex(u32(instanceIndex));
  var rectangle = getRectangle(u32(instanceIndex));
  var uv4 = getUV(u32(instanceIndex));

  var position = getPosition(index);
  var color = getColor(index);
  var depth = getDepth(index);

  var placement = getPlacement(index);
  var offset = getOffset(index);
  var size = getSize(index);
  // var flip = getFlip(index);

  var center = worldToClip(position);

  var uv1 = getQuadUV(vertexIndex);
  var xy1 = uv1 * 2.0 - 1.0;
  
  // Lerp between fixed size and full perspective.
  var pixelScale = getPerspectiveScale(center.w, depth);

  // Apply half pixel edge bleed on XY and UV
  var xy: vec2<f32>;
  var uv: vec2<f32>;
  /*
  if (HAS_EDGE_BLEED) {
    let bleed = 0.5;
    var ul = rectangle.xy * pixelScale - bleed;
    var br = rectangle.zw * pixelScale + bleed;
    var wh = (rectangle.zw - rectangle.xy) * pixelScale;

    xy = mix(ul, br, uv1);
    uv = mix(uv4.xy, uv4.zw, uv1 + xy1 * bleed / wh);
  }
  else {
  */
    xy = mix(rectangle.xy, rectangle.zw, uv1) * pixelScale;
    uv = mix(uv4.xy, uv4.zw, uv1);
  // }

  xy = xy + (placement - 1) * 0.5 * layout + offset * placement;

  // Attach to position
  center = vec4<f32>(center.xy + xy * size * viewUniforms.viewResolution * center.w, center.zw);

  return SolidVertex(
    center,
    color,
    uv,
  );
}