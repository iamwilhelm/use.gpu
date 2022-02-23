struct LightUniforms {
  lightPosition: vec4<f32>;
  lightColor: vec4<f32>;
};

//@export @group(LIGHT_BINDGROUP) @binding(LIGHT_BINDING) var<uniform> lightUniforms: LightUniforms;
@export @group(0) @binding(1) var<uniform> lightUniforms: LightUniforms;
