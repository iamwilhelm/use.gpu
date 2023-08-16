// PISA

const SH_DIFFUSE = array(
  vec3<f32>(0.6478044390678406, 0.5393319725990295, 0.5180429816246033),
  vec3<f32>(0.4988895356655121, 0.40993690490722656, 0.42176204919815063),
  vec3<f32>(0.10027801990509033, 0.13628526031970978, 0.16455410420894623),
  vec3<f32>(0.03301825001835823, 0.24857786297798157, 0.4057373106479645),
  vec3<f32>(-0.029035339131951332, 0.16475766897201538, 0.31327173113822937),
  vec3<f32>(0.07706236839294434, 0.10744889825582504, 0.12923571467399597),
  vec3<f32>(-0.015774380415678024, -0.01320259552448988, -0.015574689023196697),
  vec3<f32>(-0.008114758878946304, 0.0862012580037117, 0.14150208234786987),
  vec3<f32>(0.03538018465042114, 0.043087996542453766, 0.039103809744119644),
);

const SH_SPECULAR = array(
  vec3<f32>(0.20620261132717133, 0.1716747134923935, 0.16489818692207336),
  vec3<f32>(0.23820216953754425, 0.19573044776916504, 0.2013765126466751),
  vec3<f32>(0.047879237681627274, 0.06507141143083572, 0.07856880873441696),
  vec3<f32>(0.01576508767902851, 0.11868717521429062, 0.19372530281543732),
  vec3<f32>(-0.03696891665458679, 0.20977596938610077, 0.39886993169784546),
  vec3<f32>(0.0981188490986824, 0.13680821657180786, 0.16454799473285675),
  vec3<f32>(-0.020084572955965996, -0.01681007817387581, -0.01983032003045082),
  vec3<f32>(-0.010331989265978336, 0.10975483059883118, 0.18016602098941803),
  vec3<f32>(0.045047443360090256, 0.054861340671777725, 0.049788519740104675),

  vec3<f32>(0.051476288586854935, 0.05682909116148949, 0.06344589591026306),
  vec3<f32>(0.015071669593453407, 0.035011567175388336, 0.04740570858120918),
  vec3<f32>(0.014864001423120499, 0.019568361341953278, 0.022601570934057236),
  vec3<f32>(-0.026807576417922974, -0.025919439271092415, -0.026471659541130066),
  vec3<f32>(0.01565399579703808, 0.0075677912682294846, 0.00418047234416008),
  vec3<f32>(0.019260363653302193, 0.014955920167267323, 0.012197832576930523),
  vec3<f32>(0.0456550307571888, 0.014412368647754192, -0.013487264513969421)
);

const GAIN = 1.0;

@export fn getDefaultEnvironment(
  uvw: vec3<f32>,
  sigma: f32,
  ddx: vec3<f32>,
  ddy: vec3<f32>,
) -> vec4<f32> {
  if (sigma < 0.0) {
    return vec4<f32>(GAIN * sampleDiffuse(uvw), 1.0);
  }
  return vec4<f32>(GAIN * sampleSpecular(uvw, sigma), 1.0);
}

fn sqr(x: f32) -> f32 { return x * x; }

fn sampleDiffuse(
  ray: vec3<f32>,
) -> vec3<f32> {
  let sample = max(
    vec3<f32>(0.0),
    SH_DIFFUSE[0] + 
    SH_DIFFUSE[1] * ray.y +
    SH_DIFFUSE[2] * ray.z +
    SH_DIFFUSE[3] * ray.x +
    SH_DIFFUSE[4] * ray.y * ray.x +
    SH_DIFFUSE[5] * ray.y * ray.z +
    SH_DIFFUSE[6] * (3.0 * sqr(ray.z) - 1.0) +
    SH_DIFFUSE[7] * ray.x * ray.z +
    SH_DIFFUSE[8] * (sqr(ray.x) - sqr(ray.y))
  );

  return sample;
}

fn sampleSpecular(
  ray: vec3<f32>,
  sigma: f32,
) -> vec3<f32> {

  // Simulate rough detail at sigma size
  let s = 0.2;
  let f = clamp(1.0 - sigma / 0.336, 0.0, 1.0);
  let u = sin(ray / s);
  let v = cos(ray / s);
  let r = normalize(ray + (u.x*v.z + u.y*v.x + u.z*v.z*v.x) * s * f * f);

  // 3rd order SH
  let xx = sqr(r.x);
  let yy = sqr(r.y);
  let zz = sqr(r.z);

  let sample = max(
    vec3<f32>(0.0),
    SH_SPECULAR[0] + 
    SH_SPECULAR[1] * r.y +
    SH_SPECULAR[2] * r.z +
    SH_SPECULAR[3] * r.x +
    SH_SPECULAR[4] * r.y * r.x +
    SH_SPECULAR[5] * r.y * r.z +
    SH_SPECULAR[6] * (3.0 * sqr(r.z) - 1.0) +
    SH_SPECULAR[7] * r.x * r.z +
    SH_SPECULAR[8] * (sqr(r.x) - sqr(r.y)) +

    SH_SPECULAR[ 9] * r.y * (3 * xx - yy) +
    SH_SPECULAR[10] * r.x * r.y * r.z +
    SH_SPECULAR[11] * r.y * (5 * zz - 1) +
    SH_SPECULAR[12] * r.z * (5 * zz - 3) +
    SH_SPECULAR[13] * r.x * (5 * zz - 1) +
    SH_SPECULAR[14] * r.z * (xx - yy) +
    SH_SPECULAR[15] * r.x * (xx - 3 * yy)
  );

  return sample;
}
