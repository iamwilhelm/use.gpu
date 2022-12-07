@link fn getGain() -> f32;

@export fn gainColor(color: vec4<f32>) -> vec4<f32> {
  var rgb = color.rgb;
  return vec4<f32>(rgb * getGain(), color.a);
};
