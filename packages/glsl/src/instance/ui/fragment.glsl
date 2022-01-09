#pragma import {getPickingColor} from '@use-gpu/glsl/use/picking';
#pragma import {viewUniforms} from '@use-gpu/glsl/use/view';

vec4 getTexture(vec2);

layout(location = 0) in flat vec4 fragRectangle;
layout(location = 1) in flat vec4 fragRadius;
layout(location = 2) in vec2 fragUV;
#ifdef IS_PICKING
layout(location = 3) in flat uint fragIndex;
#else
layout(location = 3) in flat vec4 fragBorder;
layout(location = 4) in flat vec4 fragStroke;
layout(location = 5) in flat vec4 fragFill;
#endif

layout(location = 0) out vec4 outColor;

float getBoxSDF(vec4 box, vec4 radius, vec2 uv) {
  vec2 nearest = round(uv);
  vec2 rr = mix(radius.xw, radius.yz, nearest.x);
  float r = mix(rr.x, rr.y, nearest.y);

  vec2 wh = box.zw - box.xy;
  vec2 xy = (abs((uv - .5)) - .5) * wh + r;
  vec2 clip = max(vec2(0.0), xy);
  float neg = min(0.0, max(xy.x, xy.y));

  return r + 0.5 - length(clip) - neg;
}

#ifdef IS_PICKING
void main() {
  outColor = getPickingColor(fragIndex);
}
#else
void main() {
  float sdf = getBoxSDF(fragRectangle, fragRadius, fragUV);

  vec4 color = mix(fragFill, fragStroke, clamp(sdf - fragBorder, 0.0, 1.0));
  outColor = color;

  float mask = clamp(sdf, 0.0, 1.0);
  outColor *= mask;
}
#endif
