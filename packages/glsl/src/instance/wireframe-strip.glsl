#pragma import {MeshVertex} from 'use/types'
#pragma import {getQuadIndex} from 'geometry/quad'
#pragma import {getStripIndex} from 'geometry/strip'
#pragma import {getLineJoin} from 'geometry/line'

MeshVertex getVertex(int, int);

layout(location = 0) out vec4 fragColor;
layout(location = 1) out vec2 fragUV;

void main() {
  int vertexIndex = gl_VertexIndex;
  int instanceIndex = gl_InstanceIndex;

  ivec2 ij = getQuadIndex(vertexIndex);
  vec2 xy = vec2(ij) * 2.0 - 1.0;

  int f = instanceIndex % WIREFRAME_STRIP_SEGMENTS;
  int i = instanceIndex / WIREFRAME_STRIP_SEGMENTS;

  ivec2 stripIndex = getStripIndex(f);
  int edgeIndex = stripIndex.y;
  int triIndex = stripIndex.x;

  MeshVertex a = getVertex(triIndex, i);
  MeshVertex b = getVertex(triIndex + 1 + edgeIndex, i);

  vec3 left = a.position.xyz / a.position.w;
  vec3 right = b.position.xyz / b.position.w;

  vec3 join = (ij.x > 0)
    ? getLineJoin(left, left, right, 0.0, xy.y, 2.0, 1, 0)
    : getLineJoin(left, right, right, 0.0, xy.y, 2.0, 2, 0);

  gl_Position = vec4(join, 1.0);
  fragColor = vec4(1.0, 1.0, 1.0, 1.0);
  fragUV = vec2(0.0, 0.0);
}
