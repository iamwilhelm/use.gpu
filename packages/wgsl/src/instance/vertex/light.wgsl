use '@use-gpu/wgsl/use/view'::{ worldToClip };
use '@use-gpu/wgsl/use/types'::{ LightVertex, Light };
use '@use-gpu/wgsl/geometry/quad'::{ getQuadUV };

@link fn getLight(i: u32) -> Light;

@optional @link fn getInstance(index: u32) -> u32 { return index; };
@optional @link fn getPosition(i: u32) -> vec4<f32>;
@optional @link fn getIndex(index: u32) -> u32 { return index; };

@export fn getLightVertex(vertexIndex: u32, instanceIndex: u32) -> LightVertex {
  let NaN: f32 = bitcast<f32>(0xffffffffu);

  var vertex: vec4<f32>;
  if (IS_FULLSCREEN) {
    var uv = getQuadUV(vertexIndex);
    var xy = uv * 2.0 - 1.0;
    vertex = vec4<f32>(xy.x * 2.0 + 1.0, -(xy.y * 2.0 + 1.0), 0.0001, 1.0);
  } else {
    vertex = getPosition(getIndex(vertexIndex));
  }

  let instance = getInstance(instanceIndex);
  let light = getLight(instance);

  let scale = light.intensity * 0.1;
  let world = vec4<f32>(light.position.xyz + vertex.xyz * scale, 1.0);
  let position = worldToClip(world);

  return LightVertex(position, light.color, instance);
}
