import { Point, LayoutState, LayoutGenerator, LayoutResult, Margin } from '../types';

// Stack blocks horizontally or vertically.
export const makeBlockLayout = (
  direction: 'x' | 'y' = 'y',
  grow: number = 0,
  shrink: number = 0,
) => {
  const isX = direction === 'x';

  return (layout: LayoutState, ls: LayoutGenerator[]) => {
    const [l, t, r, b] = layout;

    const block = [0, 0, r - l, b - t] as LayoutState;
    const spill = [0, 0, 0, 0] as Margin;
    const max = [0, 0] as [number, number];

    const results = [] as LayoutResult[];

    let i = 0;
    let n = ls.length;
    let m = 0;

    for (let l of ls) {
      const result = l(block);
      const {box, size, margin} = result;
      const [ml, mt, mr, mb] = margin;

      // First and last margin spills out
      if (i === 0) {
        if (isX) spill[0] = ml;
        else spill[1] = mt;
      }
      else if (i === n - 1) {
        if (isX) spill[2] = mr;
        else spill[3] = mb;
      }

      // Margin between two blocks collapse to the max of the two
      if (i > 0) {
        // Shift box right/down
        if (isX) {
          m = Math.max(m, ml);
          block[0] += m;
          box[0] += m;
          box[2] += m;
          m = mr;
        }
        else {
          m = Math.max(m, mt);
          block[1] += m;
          box[1] += m;
          box[3] += m;
          m = mb;
        }
      }

      // Track block extents
      if (isX) {
        block[0] = box[2];
        max[1] = Math.max(size[1], max[1]);
      }
      else {
        block[1] = box[3];
        max[0] = Math.max(size[0], max[0]);
      }

      results.push(result);
      ++i;
    }

    let w: number;
    let h: number;
    let size: Point;

    // Get final size
    if (isX) {
      w = block[0];
      h = b - t;
      size = [w, max[1]];
    }
    else {
      w = r - l;
      h = block[1];
      size = [max[0], h];
    }

    return ([l, t]: LayoutState): LayoutResult => ({
      box: [l, t, l + w, t + h],
      size,
      margin: spill,
      grow,
      shrink,
      results,
    });
  };
}
