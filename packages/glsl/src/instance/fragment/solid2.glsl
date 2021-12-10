#pragma import {getPickingColor} from '@use-gpu/glsl/use/picking';

vec4 getFragment(vec2);

#ifdef IS_PICKING
layout(location = 0) in flat uint fragIndex;
layout(location = 0) out uvec4 outColor;
#else
layout(location = 0) in vec4 fragColor;
layout(location = 1) in vec2 fragUV;

layout(location = 0) out vec4 outColor;
#endif

#ifdef IS_PICKING
void main() {
  outColor = getPickingColor(fragIndex);
}
#else
void main() {
  outColor = fragColor;
  outColor.xyz *= outColor.a;
  outColor *= getFragment(fragUV);

  if (outColor.a <= 0.0) discard;
}
#endif
