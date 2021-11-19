#pragma import {MeshVertex} from 'use/types'

MeshVertex getVertex(int, int);

layout(location = 0) out vec4 fragColor;
layout(location = 1) out vec2 fragUV;

void main() {
  int vertexIndex = gl_VertexIndex;
  int instanceIndex = gl_InstanceIndex;

  MeshVertex v = getVertex(vertexIndex, instanceIndex);

  gl_Position = v.position;
  fragColor = v.color;
  fragUV = v.uv;
}