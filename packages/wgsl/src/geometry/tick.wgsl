@export fn getTickSegment(index: u32) -> i32 {
  let n = u32(TICK_DETAIL + 1);
  let i = index % n;
  if (i == 0u) { return 1; }
  if (i == n - 1u) { return 2; }
  return 3;
};


