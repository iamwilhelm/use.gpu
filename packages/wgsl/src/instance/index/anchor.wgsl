@link fn getAnchor(instanceIndex: u32) -> @infer(T) T;

@export fn getAnchorIndex(i: u32) -> vec2<u32> { return vec2<u32>(i, getAnchor(i).x); };
