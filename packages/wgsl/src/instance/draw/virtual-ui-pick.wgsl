use '@use-gpu/wgsl/use/types'::{ UIVertex };
use "@use-gpu/wgsl/use/color"::{ toColorSpace };

@external fn getVertex(v: u32, i: u32) -> UIVertex {};

struct VertexOutput {
  @builtin(position)              position: vec4<f32>,
  @location(0)                    fragUV: vec2<f32>,
  @location(1)                    fragSDFUV: vec2<f32>,
  @location(2)                    fragTextureUV: vec2<f32>,
  @location(4) @interpolate(flat) fragMode: i32,
  @location(5) @interpolate(flat) fragRadius: vec4<f32>,
  @location(6) @interpolate(flat) fragIndex: u32,
};

@stage(vertex)
fn main(
  @builtin(vertex_index) vertexIndex: u32,
  @builtin(instance_index) instanceIndex: u32,
) -> VertexOutput {
  var v = getVertex(vertexIndex, instanceIndex);

  return VertexOutput(
    v.position,
    v.uv,
    v.sdfUV,
    v.textureUV,
    v.mode,
    v.radius,
    instanceIndex,
  );
}
