use '@use-gpu/wgsl/use/types'::{ UIVertex };
use '@use-gpu/wgsl/geometry/quad'::{ getQuadUV };
use '@use-gpu/wgsl/use/view'::{ worldToClip3D, getViewResolution, getViewSize }; 

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
  var xy1 = uv1 * 2.0 - 1.0;
  
  let box = rectangle.zw - rectangle.xy;  

  var position = vec4<f32>(mix(rectangle.xy, rectangle.zw, uv1), 0.5, 1.0);
  var posFlipX = vec4<f32>(mix(rectangle.xy, rectangle.zw, vec2<f32>(1.0 - uv1.x, uv1.y)), 0.5, 1.0);
  var posFlipY = vec4<f32>(mix(rectangle.xy, rectangle.zw, vec2<f32>(uv1.x, 1.0 - uv1.y)), 0.5, 1.0);

  var center  = worldToClip3D(applyTransform(position));
  var centerX = worldToClip3D(applyTransform(posFlipX));
  var centerY = worldToClip3D(applyTransform(posFlipY));

  var size = getViewSize();
  var dx = (center.xy - centerX.xy) * size;
  var dy = (center.xy - centerY.xy) * size;

  var stepX = normalize(dx);
  var stepY = normalize(dy);

  var conservative: vec3<f32>;
  if (mode == -1) {
    conservative = center;
  }
  else {
    conservative = vec3<f32>(center.xy + (stepX + stepY) * getViewResolution(), center.z);
    uv1 = uv1 + xy1 / vec2<f32>(length(dx), length(dy));
  }

  var uv = mix(uv4.xy, uv4.zw, uv1);
  let textureUV = uv;
  let sdfUV = uv1 * box;
  let clipUV = vec4<f32>(-1.0, -1.0, 2.0, 2.0);
  
  return UIVertex(
    vec4<f32>(conservative, 1.0),
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
