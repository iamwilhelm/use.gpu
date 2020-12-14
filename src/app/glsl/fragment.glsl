#version 450

layout(location = 0) in vec4 vColor;
layout(location = 1) in vec2 vUV;

float getGrid(vec2 uv) {
  vec2 xy = abs(fract(uv - 0.5) - 0.5);
  return max(xy.x, xy.y) > 0.4 ? 1.0 : 0.0;
}

void main() {
  gl_FragColor = vec4(vColor.xyz * getGrid(vUV), vColor.w);
}
