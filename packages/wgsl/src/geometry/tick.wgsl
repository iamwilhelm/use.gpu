@export fn getTickSegment(index: i32) -> i32 {
  let n = TICK_DETAIL + 1;
  let i = index % n;
  if (i == 0) { return 1; }
  if (i == n - 1) { return 2; }
  return 3;
};


