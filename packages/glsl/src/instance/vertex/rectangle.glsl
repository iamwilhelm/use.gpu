#pragma import {SolidVertex} from '@use-gpu/glsl/use/types'
#pragma import {worldToClip} from '@use-gpu/glsl/use/view'
#pragma import {getQuadUV} from '@use-gpu/glsl/geometry/quad'

vec4 getRectangle(int);
vec4 getColor(int);
vec4 getUV(int);
float getZ(int);

#pragma export
SolidVertex getRectangleVertex(int vertexIndex, int instanceIndex) {
  vec4 rectangle = getRectangle(instanceIndex);
  vec4 color = getColor(instanceIndex);
  vec4 uv4 = getUV(instanceIndex);
  float z = getZ(instanceIndex);

  vec2 uv = getQuadUV(vertexIndex);
  vec4 position = vec4(mix(rectangle.xy, rectangle.zw, uv), z, 1.0);
  vec4 center = worldToClip(position);
  uv = mix(uv4.xy, uv4.zw, uv);

  return SolidVertex(
    center,
    color,
    uv
  );
}