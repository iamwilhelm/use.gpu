use '@use-gpu/wgsl/use/types'::{ SolidVertex };
use "@use-gpu/wgsl/use/color"::{ toColorSpace };

@link fn getVertex(v: u32, i: u32) -> SolidVertex {};

struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) fragColor: vec4<f32>,
  @location(1) fragUV: vec2<f32>,
};

@stage(vertex)
fn main(
  @builtin(vertex_index) vertexIndex: u32,
  @builtin(instance_index) instanceIndex: u32,
) -> VertexOutput {
  let v = getVertex(vertexIndex, instanceIndex);

  return VertexOutput(
    v.position,
    toColorSpace(v.color),
    v.uv,
  );
}
