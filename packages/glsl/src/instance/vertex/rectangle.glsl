#pragma import {SolidVertex} from '@use-gpu/glsl/use/types'
#pragma import {worldToClip} from '@use-gpu/glsl/use/view'
#pragma import {getQuadUV} from '@use-gpu/glsl/geometry/quad'

vec4 getRectangle(int);
vec4 getColor(int);

#pragma export
SolidVertex getRectangleVertex(int vertexIndex, int instanceIndex) {
  vec4 rectangle = getRectangle(instanceIndex);
  vec4 color = getColor(instanceIndex);

  vec2 uv = getQuadUV(vertexIndex);

  vec4 position = vec4(mix(rectangle.xy, rectangle.zw, uv), 0.5, 1.0);
  vec4 center = worldToClip(position);

  return SolidVertex(
    center,
    color,
    uv
  );
}