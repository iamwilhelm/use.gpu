@link fn getTransformMatrix() -> mat4x4<f32>;

const PI = 3.14159265359;
const PI4 = 0.7853981634;
const toRad = 0.01745329252;
const limitLat = 85.05113;

@optional @link fn getWebMercatorBend() -> f32 { return 0.0; };
@optional @link fn getWebMercatorOrigin() -> vec3<f32> { return 0.0; };
@optional @link fn getWebMercatorZoom() -> f32 { return 0.0; };
@optional @link fn getWebMercatorRadius() -> f32 { return 0.0; };
@optional @link fn getWebMercatorCentered() -> f32 { return 0.0; };

@export fn getWebMercatorPosition(position: vec4<f32>) -> vec4<f32> {
  let mercatorBend = getWebMercatorBend();
  let mercatorRadius = getWebMercatorRadius();
  let mercatorOrigin = getWebMercatorOrigin();
  let mercatorZoom = getWebMercatorZoom();
  let mercatorCentered = getWebMercatorCentered();

  let matrix = getTransformMatrix();

  let phi = toRad * position.x; // longitude
  let theta = toRad * position.y; // latitude
  let radius = (mercatorRadius + position.z) / mercatorRadius;

  let o = mercatorOrigin;
  let f = mercatorBend;
  let z = mercatorZoom;
  
  var transformed: vec3<f32>;
  if (f < 1.0) {
    /*
    if (abs(position.y) >= limitLat) {
      var NaN: f32 = bitcast<f32>(0xffffffffu);
      return vec4<f32>(NaN, NaN, NaN, NaN);
    }
    */

    var proj = vec2<f32>(phi, log(tan(PI4 + theta / 2.0)));

    if (f > 0.0) {
      transformed = toSphericalBend(
        vec3<f32>(
          mix(vec2<f32>(phi, theta), proj, 1.0 - f),
          radius,
        ),
        o,
        z,
        f
      );
      if (mercatorCentered > 0.0) {
        transformed -= toSphericalBend(
          vec3<f32>(
            mix(vec2<f32>(o.x * PI, o.z), vec2<f32>(o.x * PI, o.y * PI), 1.0 - f),
            radius,
          ),
          o,
          z,
          f
        );
      }
    }
    else {
      var flat = (proj / PI - o.xy) * z;
      transformed = vec3<f32>(flat, radius - 1.0);
    }
  }
  else {
    transformed = toSpherical(phi - o.x * PI, theta, radius * z / PI);
    if (mercatorCentered > 0.0) {
      transformed -= toSpherical(0.0, o.z, radius * z / PI);
    }
  }

  transformed = rotateToCenter(
    transformed,
    o,
    z,
    f
  );

  return matrix * vec4<f32>(transformed, 1.0);
}

fn toSpherical(phi: f32, theta: f32, radius: f32) -> vec3<f32> {
  let angles = vec2<f32>(phi, theta);
  let c = cos(angles);
  let s = sin(angles);

  let spherical = vec3<f32>(
    s.x * c.y,
    s.y,
    c.x * c.y,
  ) * radius;

  return spherical;
}

fn toSphericalBend(position: vec3<f32>, o: vec3<f32>, z: f32, f: f32) -> vec3<f32> {
  let f1 = 1.0 - f;
  let fi = 1.0 / f;

  let angles = vec2<f32>((position.x - o.x * PI) * f, (position.y) * f);
  let c = cos(angles);
  let s = sin(angles);

  var spherical = vec3<f32>(
    s.x * c.y * fi,
    s.y * fi,
    (c.x * c.y - 1.0) * fi + f,
  ) * z / PI;
  
  spherical.y -= o.y * z * f1;
  
  return spherical;
}

fn rotateToCenter(position: vec3<f32>, o: vec3<f32>, z: f32, f: f32) -> vec3<f32> {
  let angle = mix(o.z, o.z, f) * f;
  let c = cos(angle);
  let s = sin(angle);
  
  return vec3<f32>(position.x, position.y * c - position.z * s, position.z * c + position.y * s);
}
