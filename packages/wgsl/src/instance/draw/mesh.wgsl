struct ViewUniforms {
  projectionMatrix: mat4x4<f32>;
  viewMatrix: mat4x4<f32>;
  viewPosition: vec4<f32>;
  viewResolution: vec2<f32>;
  viewSize: vec2<f32>;
  viewWorldUnit: f32;
  viewPixelRatio: f32;
};

@group(0) @binding(0) var<uniform> viewUniforms: ViewUniforms;

fn worldToView(position: vec4<f32>) -> vec4<f32> {
  return viewUniforms.viewMatrix * position;
}

fn viewToClip(position: vec4<f32>) -> vec4<f32> {
  return viewUniforms.projectionMatrix * position;
}

fn worldToClip(position: vec4<f32>) -> vec4<f32> {
  return viewToClip(worldToView(position));
}

struct VertexOutput {
  @builtin(position) position: vec4<f32>;
  @location(0) fragColor: vec4<f32>;
  @location(1) fragUV: vec2<f32>;
  @location(2) fragNormal: vec3<f32>;
  @location(3) fragPosition: vec3<f32>;
};

@stage(vertex)
fn main(
  @builtin(instance_index) instanceIndex: u32,
  @location(0) position: vec4<f32>,
  @location(1) normal: vec4<f32>,
  @location(2) color: vec4<f32>,
  @location(3) uv: vec2<f32>,
) -> VertexOutput {
  
  var outPosition: vec4<f32> = worldToClip(position);
  
  return VertexOutput(
    outPosition,
    color,
    uv,
    normal.xyz,
    position.xyz,
  );
}

/*
#pragma import {worldToClip} from '@use-gpu/glsl/use/view'
#pragma import {pickingUniforms} from '@use-gpu/glsl/use/picking';
#pragma import {lightUniforms} from '@use-gpu/glsl/use/light';

layout(location = 0) in vec4 position;
layout(location = 1) in vec4 normal;
layout(location = 2) in vec4 color;
layout(location = 3) in vec2 uv;

#ifdef IS_PICKING
layout(location = 0) out flat uint fragIndex;
#else
layout(location = 0) out vec4 fragColor;
layout(location = 1) out vec2 fragUV;

layout(location = 2) out vec3 fragNormal;
layout(location = 3) out vec3 fragPosition;
#endif

void main() {
  int instanceIndex = gl_InstanceIndex;
  gl_Position = worldToClip(position);
#ifdef IS_PICKING
  fragIndex = uint(instanceIndex);
#else
  fragColor = color;
  fragUV = uv;

  fragNormal = normal.xyz;
  fragPosition = position.xyz;
#endif
}
*/