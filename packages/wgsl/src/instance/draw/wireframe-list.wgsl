use '@use-gpu/wgsl/use/types'::{ SolidVertex };
use '@use-gpu/wgsl/geometry/quad'::{ getQuadIndex };
use '@use-gpu/wgsl/geometry/strip'::{ getStripIndex };
use '@use-gpu/wgsl/geometry/line'::{ getLineJoin };

@external fn getVertex(v: i32, i: i32) -> SolidVertex {};
@external fn getInstanceSize(i: i32) -> i32 {};

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

  let vi = i32(vertexIndex);
  var ij = getStripIndex(vi - (vi / 3) * 2);
  var xy = vec2<f32>(ij) * 2.0 - 1.0;

  var n = getInstanceSize(0);
  var f = i32(instanceIndex) % n;
  var i = i32(instanceIndex) / n;

  var v = i32(f) % 3;
  var t = i32(f) - v;

  var a: SolidVertex;
  var b: SolidVertex;
  var c: SolidVertex;
  if (v == 0) {
    a = getVertex(t, i);
    b = getVertex(t + 1, i);
    c = getVertex(t + 2, i);
  }
  else if (v == 1) {
    a = getVertex(t + 1, i);
    b = getVertex(t + 2, i);
    c = getVertex(t, i);
  }
  else if (v == 2) {
    a = getVertex(t + 2, i);
    b = getVertex(t, i);
    c = getVertex(t + 1, i);
  }

  var left = a.position.xyz / a.position.w;
  var right = b.position.xyz / b.position.w;
  var other = c.position.xyz / c.position.w;

  var join: vec3<f32>;
  if (ij.x > 0) {
    join = getLineJoin(left, right, other, (f32(ij.x) - 1.0) / 2.0, xy.y, 2.0, 3, 2);
  }
  else {
    join = getLineJoin(other, left, right, 1.0, xy.y, 2.0, 3, 2);
  }

  return VertexOutput(
    vec4<f32>(join, 1.0),
    vec4<f32>(1.0, 1.0, 1.0, 1.0),
    vec2<f32>(0.0, 0.0),
  );
}
