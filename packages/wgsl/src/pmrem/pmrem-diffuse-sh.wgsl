use '@use-gpu/wgsl/codec/octahedral'::{ decodeOctahedral };

const MAX_HEIGHT = 64;

const CONV_COS0 = 3.1415926536; // π     //0.8862269255;//0.2499987930059433/0.2820947918;
const CONV_COS1 = 2.09439510239;// π*2/3 //1.02332670795;//0.2888830900192261/0.2820947918;
const CONV_COS2 = 0.7853981634; // π/4   //0.4954159122;//0.1400941610336303/0.2820947918;

@link fn getSourceMapping() -> vec4<i32> {};

@link fn getAtlasTexture(uv: vec2<f32>, level: f32) -> vec4<f32>;

@link var<storage, read_write> shCoefficients: array<vec4<f32>>;

var<workgroup> shScratch: array<vec4<f32>, 640>;

@compute @workgroup_size(64, 1)
@export fn pmremDiffuseSH(
  @builtin(global_invocation_id) globalId: vec3<u32>,
) {
  let mapping = getSourceMapping();
  let size = mapping.zw - mapping.xy;

  var band0 = vec4<f32>(0.0);
  var band1 = vec4<f32>(0.0);
  var band2 = vec4<f32>(0.0);
  var band3 = vec4<f32>(0.0);
  var band4 = vec4<f32>(0.0);
  var band5 = vec4<f32>(0.0);
  var band6 = vec4<f32>(0.0);
  var band7 = vec4<f32>(0.0);
  var band8 = vec4<f32>(0.0);
  var bandW = 0.0;
  
  let s1 = size - 1;

  let x = i32(globalId.x);
  if (x < size.x - 1) {
    for (var y = 0; y < MAX_HEIGHT; y++) {
      if (y >= size.y - 1) { break; }

      let xy = vec2<f32>(vec2<i32>(x, y));
      let uv = (xy + .5) / vec2<f32>(s1);

      // texture starts at uv .5 (absolute coords)
      let uv2 = xy + 1.0 + vec2<f32>(mapping.xy);
      var sample = getAtlasTexture(uv2, 0.0);
      
      let uvo = uv * 2.0 - 1.0;
      let ray = decodeOctahedral(uvo);

      let dx = (
        decodeOctahedral(uvo + vec2<f32>(1e-4, 0.0)) -
        decodeOctahedral(uvo + vec2<f32>(-1e-4, 0.0))
      ) * 5e3;
      let dy = (
        decodeOctahedral(uvo + vec2<f32>(0.0, 1e-4)) -
        decodeOctahedral(uvo + vec2<f32>(0.0, -1e-4))
      ) * 5e3;
      
      let weight = length(cross(dx, dy));
      let s = sample * weight;

      band0 += s        * CONV_COS0;
      band1 += s *  3.0 * CONV_COS1 * ray.y; // sqrt(3)
      band2 += s *  3.0 * CONV_COS1 * ray.z;
      band3 += s *  3.0 * CONV_COS1 * ray.x;
      band4 += s * 15.0 * CONV_COS2 * ray.y * ray.x; // sqrt(15)
      band5 += s * 15.0 * CONV_COS2 * ray.y * ray.z;
      band6 += s * 1.25 * CONV_COS2 * (3.0 * sqr(ray.z) - 1.0); // sqrt(5) / 2
      band7 += s * 15.0 * CONV_COS2 * ray.x * ray.z;
      band8 += s * 3.75 * CONV_COS2 * (sqr(ray.x) - sqr(ray.y)); // sqrt(15) / 2

      /*
      let xx = sqr(ray.x);
      let yy = sqr(ray.y);
      let zz = sqr(ray.z);
      band9  += s * sqrt(70.0)/4.0 * ray.y * (3 * xx - yy);
      band10 += s * sqrt(105.0)    * ray.x * ray.y * ray.z;
      band11 += s * sqrt(42.0)/4.0 * ray.y * (5 * zz - 1);
      band12 += s * sqrt(7.0)/2.0  * ray.z * (5 * zz - 3);
      band13 += s * sqrt(42.0)/4.0 * ray.x * (5 * zz - 1);
      band14 += s * sqrt(105)/2.0  * ray.z * (xx - yy);
      band15 += s * sqrt(70.0)/4.0 * ray.x * (xx - 3 * yy);
      */

      bandW += weight;
    }

    let index = x * 10;
    shScratch[index + 0] = band0;
    shScratch[index + 1] = band1; 
    shScratch[index + 2] = band2; 
    shScratch[index + 3] = band3; 
    shScratch[index + 4] = band4; 
    shScratch[index + 5] = band5; 
    shScratch[index + 6] = band6; 
    shScratch[index + 7] = band7; 
    shScratch[index + 8] = band8; 
    shScratch[index + 9] = vec4<f32>(bandW, 0.0, 0.0, 0.0); 
  }

  workgroupBarrier();

  if (x > 0) { return; }
  
  for (var x = 1; x < size.x - 1; x++) {
    let index = x * 10;
    band0 += shScratch[index + 0];
    band1 += shScratch[index + 1];
    band2 += shScratch[index + 2];
    band3 += shScratch[index + 3];
    band4 += shScratch[index + 4];
    band5 += shScratch[index + 5];
    band6 += shScratch[index + 6];
    band7 += shScratch[index + 7];
    band8 += shScratch[index + 8];
    bandW += shScratch[index + 9].x;
  }

  let norm = 1 / bandW;
  shCoefficients[0] = band0 * norm;
  shCoefficients[1] = band1 * norm; 
  shCoefficients[2] = band2 * norm; 
  shCoefficients[3] = band3 * norm; 
  shCoefficients[4] = band4 * norm; 
  shCoefficients[5] = band5 * norm; 
  shCoefficients[6] = band6 * norm; 
  shCoefficients[7] = band7 * norm; 
  shCoefficients[8] = band8 * norm; 
}

fn sqr(x: f32) -> f32 { return x * x; }
