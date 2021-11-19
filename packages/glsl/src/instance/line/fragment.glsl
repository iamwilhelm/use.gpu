#pragma import {viewUniforms} from 'use/view';

layout(location = 0) in vec4 fragColor;
layout(location = 1) in vec2 fragUV;

layout(location = 0) out vec4 outColor;

void main() {
  outColor = vec4(fragColor.xyz, fragColor.w);
}
