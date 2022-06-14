use '@use-gpu/wgsl/use/view'::{ getViewPosition };
use '@use-gpu/wgsl/material/pbr'::{ applyPBRMaterial as applyDefaultPBRMaterial };

@optional @link fn applyPBRMaterial(
  materialColor: vec4<f32>,
  lightColor: vec4<f32>,
  mapUV: vec2<f32>,
  N: vec3<f32>,
  L: vec3<f32>,
  V: vec3<f32>,
) -> vec3<f32> {
  return applyDefaultPBRMaterial(materialColor, lightColor, mapUV, N, L, V);
}

@optional @link fn getNormal(uv: vec2<f32>) -> vec4<f32> { return vec4<f32>(0.0, 0.0, 1.0, 0.0); };
@optional @link fn getOcclusion(uv: vec2<f32>) -> f32 { return 1.0; };
@optional @link fn getEmissive(uv: vec2<f32>) -> vec4<f32> { return vec4<f32>(0.0); };

@export fn getMappedFragment(
  color: vec4<f32>,
  uv: vec2<f32>,
  normal: vec4<f32>,
  tangent: vec4<f32>,
  position: vec4<f32>,
) -> vec4<f32> {

  let viewPosition = getViewPosition().xyz;
  let toView: vec3<f32> = viewPosition - position.xyz;

  let tangentNormal = getNormal(uv) * 2.0 - 1.0;
  let occlusion = getOcclusion(uv);
  let emissive = getEmissive(uv);
  
  let bitangent = cross(normal.xyz, tangent.xyz) * tangent.w;
  let bumpNormal = normalize(
    tangentNormal.x * tangent.xyz +
    tangentNormal.y * bitangent +
    tangentNormal.z * normal.xyz
  );

  let N: vec3<f32> = normalize(bumpNormal);
  let V: vec3<f32> = normalize(toView);

  let lightPosition = vec3<f32>(10.0, 30.0, 20.0);
  let lightColor = vec4<f32>(1.0, 1.0, 1.0, 1.0);
  let lightAmbient = 0.005;

  let toLight: vec3<f32> = lightPosition - position.xyz;
  let L: vec3<f32> = normalize(toLight);

  let direct = emissive.xyz + applyPBRMaterial(color, lightColor, uv, N, L, V);
  let indirect = vec3<f32>(occlusion * lightAmbient);

  return vec4<f32>((direct + indirect) * color.a, color.a);
}

/*
fn toDerivative(normal: vec3<f32>) -> vec2<f32> { return -normal.xy / normal.z; }

fn getBasis(normal: vec3<f32> uv: vec2<f32>) -> mat3x2<f32> {
  let sigmaS = dpdxFine(uv);
  let sigmaT = dpdyFine(uv);

  let det = dot(dx, vec2<f32>(dy.y, -dy.x));
  let detSign = det < 0.0 ? -1.0 : 1.0;
  
  let invC0 = detSign * vec2<f32>(dy.y, -dx.y); // ???
  var vT = sigmaX * invC0.x + signaY * invC0.y;
  if (abs(det) > 0.0) vT = normalize(vT);

  var vB = (detSign * flipSign) * cross(normal, vT);
  return mat3x2<f32>(vT, vB);
}
*/
