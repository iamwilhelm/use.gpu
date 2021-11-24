#pragma import {viewUniforms} from 'use/view';
#pragma import {pickingUniforms} from 'use/picking';

#ifdef IS_PICKING
layout(location = 0) in flat uint fragIndex;
layout(location = 0) out uvec4 outColor;
#else
layout(location = 0) in vec4 fragColor;
layout(location = 1) in vec2 fragUV;
layout(location = 0) out vec4 outColor;
#endif

void main() {
  #ifdef IS_PICKING
  /*
  float r = (fragIndex & 0xFF) / 255.0;
  float g = ((fragIndex >> 8) & 0xFF) / 255.0;
  float b = ((fragIndex >> 16) & 0xFF) / 255.0;
  float a = ((fragIndex >> 24) & 0xFF) / 255.0;
  outColor = vec4(r, g, b, a);
  */
  uint r = pickingUniforms.pickingId;
  uint g = fragIndex;
  outColor = uvec4(r, g, 0, 0);
  #else
  outColor = vec4(fragColor.xyz, fragColor.w);
  #endif
}
