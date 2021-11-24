#ifdef IS_PICKING
#pragma export
layout(set = 0, binding = 1) uniform PickingUniforms {
  uint pickingId;
} pickingUniforms;
#endif