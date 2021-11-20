#pragma import {viewUniforms} from 'use/view';

#ifdef IS_PICKING
layout(location = 0) in flat int fragIndex;
#else
layout(location = 0) in vec4 fragColor;
layout(location = 1) in vec2 fragUV;
#endif

layout(location = 0) out vec4 outColor;

void main() {
  #ifdef IS_PICKING
  float r = (fragIndex & 0xFF);
  float g = ((fragIndex >> 8) & 0xFF);
  float b = ((fragIndex >> 16) & 0xFF);
  float a = ((fragIndex >> 24) & 0xFF);
  outColor = vec4(r, g, b, a);
  #else
  outColor = vec4(fragColor.xyz, fragColor.w);
  #endif
}
