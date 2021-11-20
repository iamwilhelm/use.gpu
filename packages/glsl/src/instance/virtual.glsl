#pragma import {MeshVertex} from 'use/types'

MeshVertex getVertex(int, int);

#ifdef IS_PICKING
layout(location = 0) out flat int fragIndex;
#else
layout(location = 0) out vec4 fragColor;
layout(location = 1) out vec2 fragUV;
#endif

void main() {
  int vertexIndex = gl_VertexIndex;
  int instanceIndex = gl_InstanceIndex;

  MeshVertex v = getVertex(vertexIndex, instanceIndex);

  gl_Position = v.position;
#ifdef IS_PICKING
  fragIndex = instanceIndex;
#else
  fragColor = v.color;
  fragUV = v.uv;
#endif
}