struct PickingUniforms {
  pickingId: u32;
};

//@group(PICKING_BINDGROUP) @binding(PICKING_BINDING) var<uniform> pickingUniforms: PickingUniforms;
@group(0) @binding(1) var<uniform> pickingUniforms: PickingUniforms;

@export fn getPickingColor(fragIndex: u32) -> vec4<u32> {
  var r = pickingUniforms.pickingId;
  var g = fragIndex;
  return vec4<u32>(r, g, 0u, 0u);
}
