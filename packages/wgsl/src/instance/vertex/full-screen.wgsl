use '@use-gpu/wgsl/use/types'::{ SolidVertex };
use '@use-gpu/wgsl/geometry/quad'::{ getQuadUV };
use '@use-gpu/wgsl/use/view'::{ viewUniforms };

@export fn getFullScreenVertex(vertexIndex: i32, instanceIndex: i32) -> SolidVertex {
  var uv = getQuadUV(vertexIndex);
  var xy = uv * 2.0 - 1.0;
  
  var zz = viewUniforms.viewSize;
  
  return SolidVertex(
    vec4<f32>(xy.x, -xy.y, 0.5, 1.0),
    vec4<f32>(1.0, 1.0, 1.0, 1.0),
    uv,
  );
}