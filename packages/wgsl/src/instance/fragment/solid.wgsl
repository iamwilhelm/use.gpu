use '@use-gpu/wgsl/use/view'::{ getViewPosition };
use '@use-gpu/wgsl/use/types'::{ SurfaceFragment };

@export fn getSolidFragment(
  surface: SurfaceFragment,
) -> vec4<f32> {
  return surface.albedo;
}
