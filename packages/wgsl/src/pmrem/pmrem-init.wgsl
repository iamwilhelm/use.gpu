use '@use-gpu/wgsl/codec/octahedral'::{ decodeOctahedral };

@link fn getTargetMapping() -> vec4<u32> {};

@optional @link fn getCubeMap(uvw: vec3<f32>, dx: vec3<f32>, dy: vec3<f32>) -> vec4<f32> { return vec4<f32>(0.0); };

@link var scratchTexture: texture_storage_2d<rgba16float, write>;
@link var atlasTexture: texture_storage_2d<rgba16float, write>;

//@link fn getScratchTexture(uv: vec2<f32>) -> vec4<f32>;

@compute @workgroup_size(8, 8)
@export fn pmremInit(
  @builtin(global_invocation_id) globalId: vec3<u32>,
) {
  let mapping = getTargetMapping();
  let size = mapping.zw - mapping.xy;

  if (any(globalId.xy >= vec2<u32>(size))) { return; }

  let xyi = vec2<u32>(globalId.xy);
  let uv = vec2<f32>(xyi) / vec2<f32>(size - 1);

  let uv2 = uv * 2.0 - 1.0;
  let ray = decodeOctahedral(uv2);
  let sample = getCubeMap(ray, vec3<f32>(0.0), vec3<f32>(0.0));

  textureStore(atlasTexture, xyi + mapping.xy, sample);
  textureStore(scratchTexture, xyi, sample);
}
