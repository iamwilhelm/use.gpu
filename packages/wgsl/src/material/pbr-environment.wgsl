use '@use-gpu/wgsl/fragment/pbr'::{ IBL, IBLResult };
use '@use-gpu/wgsl/use/types'::{ SurfaceFragment };

@link fn sampleEnvMap(uvw: vec3<f32>, sigma: f32) -> vec4<f32>;

fn sqr(x: f32) -> f32 { return x * x; }

fn varianceForRoughness(roughness: f32) -> f32 {
  if (roughness < 0.4) { return 1.74 * sqr(sqr(roughness)); }
  if (roughness < 0.8) { return 0.575 * roughness - 0.184; }
  return 0.312 * roughness + 0.027;
};

@export fn applyPBREnvironment(
  N: vec3<f32>,
  V: vec3<f32>,
  surface: SurfaceFragment,
) -> vec3<f32> {
  let albedo = surface.albedo;
  let metalness = surface.material.x;
  let roughness = surface.material.y;

  let sigma = sqrt(varianceForRoughness(roughness));
  let ibl = IBL(N, V, albedo.xyz, metalness, roughness);

  let R = reflect(-V, N);

  let diffuse = ibl.diffuse * sampleEnvMap(N, -1.0).xyz;
  let specular = ibl.specular * sampleEnvMap(R, sigma).xyz;

  return sampleEnvMap(N, -1.0).xyz;
  return diffuse + specular * 0.0;
}
