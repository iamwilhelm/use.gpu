@optional @link fn getStereographicBend() -> f32 { return 0.0; };

@link fn getMatrix() -> mat4x4<f32>;

@export fn getStereographicPosition(position: vec4<f32>) -> vec4<f32> {
  let stereoBend = getStereographicBend();
  let matrix = getMatrix();

  if (stereoBend > 0.0001) {
    if (position.z == -1.0) {
      var NaN: f32 = bitcast<f32>(0xffffffffu);
      return vec4<f32>(NaN, NaN, NaN, NaN);
    }

    let pos = position.xyz;
    let z = (pos.z + 1.0);
    let iz = 1.0/z;
    let proj = pos.xy * iz;
  
    var f = stereoBend;
    let mixed = mix(pos.xy, proj, f);
    let out = vec3<f32>(mixed, mix(pos.z, 0.0, f));

    return matrix * vec4<f32>(out, 1.0);
    
    

  }

  return matrix * vec4<f32>(position.xyz, 1.0);
}
