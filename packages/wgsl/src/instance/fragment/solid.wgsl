use '@use-gpu/wgsl/use/view'::{ getViewPosition };
use '@use-gpu/wgsl/use/types'::{ SurfaceFragment };

@export fn getSolidFragment(
  surface: SurfaceFragment,
) -> vec4<f32> {
  return vec4<f32>(surface.albedo.rgb * surface.albedo.a, surface.albedo.a);
}
