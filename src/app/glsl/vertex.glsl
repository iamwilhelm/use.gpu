#version 450

layout(location = 0) in vec4 position;
layout(location = 1) in vec4 color;
layout(location = 2) in vec2 uv;

layout(location = 0) out vec4 vColor;
layout(location = 1) out vec2 vUV;

void main() {
  gl_Position = position;
  vColor = color;
  vUV = uv;
}
