use '@use-gpu/wgsl/use/types'::{ UIVertex };
use '@use-gpu/wgsl/geometry/quad'::{ getQuadUV };
use '@use-gpu/wgsl/use/view'::{ worldToClip }; 

@optional @link fn getRectangle(i: u32) -> vec4<f32> { return vec4<f32>(0.0, 0.0, 0.0, 0.0); }
@optional @link fn getRadius(i: u32)    -> vec4<f32> { return vec4<f32>(0.0, 0.0, 0.0, 0.0); }
@optional @link fn getBorder(i: u32)    -> vec4<f32> { return vec4<f32>(0.0, 0.0, 0.0, 0.0); }
@optional @link fn getStroke(i: u32)    -> vec4<f32> { return vec4<f32>(0.5, 0.5, 0.5, 1.0); }
@optional @link fn getFill(i: u32)      -> vec4<f32> { return vec4<f32>(0.5, 0.5, 0.5, 1.0); }
@optional @link fn getUV(i: u32)        -> vec4<f32> { return vec4<f32>(0.0, 0.0, 1.0, 1.0); }
@optional @link fn getRepeat(i: u32)    -> i32       { return 0; }

@optional @link fn getSDFConfig(i: u32) -> vec4<f32> { return vec4<f32>(0.0, 0.0, 0.0, 0.0); };
@optional @link fn applyTransform(p: vec4<f32>) -> vec4<f32> { return p; }

@export fn getUIRectangleVertex(vertexIndex: u32, instanceIndex: u32) -> UIVertex {

  var rectangle = getRectangle(instanceIndex);
  var radius = getRadius(instanceIndex);
  var border = getBorder(instanceIndex);
  var fill = getFill(instanceIndex);
  var stroke = getStroke(instanceIndex);
  var uv4 = getUV(instanceIndex);
  var repeat = getRepeat(instanceIndex);

  var sdfConfig = getSDFConfig(instanceIndex);

  var mode: i32;
  if (sdfConfig.x > 0.0) { mode = -1; }
  else if (length(radius + border) == 0.0) { mode = 0; }
  else if (length(radius) == 0.0) { mode = 1; }
  else { mode = 2; };

  var uv1 = getQuadUV(vertexIndex);
  
  let box = rectangle.zw - rectangle.xy;  

  var position = vec4<f32>(mix(rectangle.xy, rectangle.zw, uv1), 0.5, 1.0);
  var center = worldToClip(applyTransform(position));

  var uv = mix(uv4.xy, uv4.zw, uv1);
  let textureUV = uv;
  let sdfUV = uv1 * box;
  let clipUV = vec4<f32>(0.0, 0.0, 1.0, 1.0);
  
  return UIVertex(
    center,
    uv1,
    sdfConfig,
    sdfUV,
    clipUV,
    textureUV,
    repeat,
    mode,
    vec4<f32>(box, 0.0, 0.0),
    radius,
    border,
    stroke,
    fill,
    instanceIndex,
  );
}
