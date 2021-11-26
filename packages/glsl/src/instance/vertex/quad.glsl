#pragma import {SolidVertex} from 'use/types'
#pragma import {viewUniforms, worldToClip} from 'use/view'
#pragma import {getQuadUV} from 'geometry/quad'

vec4 getPosition(int);
float getSize(int);

#pragma export
SolidVertex getQuadVertex(int vertexIndex, int instanceIndex) {
  vec4 instancePosition = getPosition(instanceIndex);
  float instanceSize = getSize(instanceIndex);

  vec4 position = worldToClip(instancePosition);

  vec2 uv = getQuadUV(vertexIndex);
  vec2 xy = uv * 2.0 - 1.0;
  position.xy += xy * viewUniforms.viewResolution * (instanceSize * position.w);

  return SolidVertex(
    position,
    vec4(abs(instancePosition.xyz) / 2.0, 1.0),
    uv
  );
}