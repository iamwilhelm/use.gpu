import { Point, LayoutState, LayoutGenerator, LayoutResult } from '../types';

export const makeBlockLayout = (
  direction: 'x' | 'y' = 'y',
  grow: number = 0,
  shrink: number = 0,
) => {
  const isX = direction === 'x';

  return (layout: LayoutState, ls: LayoutGenerator[]) => {
    const [l, t, r, b] = layout;

    const block = [0, 0, r - l, b - t] as LayoutState;
    const max = [0, 0] as [number, number];

    const results = [] as LayoutResult[];

    for (let l of ls) {
      const result = l(block);
      const {box, size} = result;

      if (isX) {
        block[0] = box[2];
        max[1] = Math.max(size[1], max[1]);
      }
      else {
        block[1] = box[3];
        max[0] = Math.max(size[0], max[0]);
      }

      results.push(result);
    }

    let w: number;
    let h: number;
    let size: Point;

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
      grow,
      shrink,
      results,
    });
  };
}
