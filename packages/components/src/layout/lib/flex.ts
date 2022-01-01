import { Point, LayoutState, LayoutGenerator, LayoutResult } from '../types';
import { parseAlignment } from './util';

export const makeFlexLayout = (
  direction: 'x' | 'y' = 'x',
  alignX: 'start' | 'center' | 'end' | 'justify' = 'start',
  alignY: 'start' | 'center' | 'end' | 'justify' = 'start',
  wrap: boolean = false,
) => {
  const isX = (direction === 'x');

  const alignXRatio = parseAlignment(alignX);
  const alignYRatio = parseAlignment(alignY);

  const alignMain = isX ? alignX : alignY;
  const isJustify = alignMain === 'justify';
  const isWrap = !!wrap;

  return (layout: LayoutState, ls: LayoutGenerator[]) => {
    const [l, t, r, b] = layout;
    let w = r - l;
    let h = b - t;

    const block = [0, 0, w, h] as LayoutState;

    const results = [] as LayoutResult[];
    const row = [] as LayoutResult[];
    const sizes = [] as number[];

    let accum = 0;
    let maxOn = 0;
    let maxOff = 0;
    let n = 0;

    let offAxis = 0;

    const reduce = () => {
      if (!n) return;

      const slack = (isX ? w : h) - accum;

      let onAxisLead = 0;
      let onAxisSpace = 0;;
      if (isJustify) {
        if (n > 1) onAxisSpace = slack / Math.max(1, n - 1);
        else onAxisLead = slack / 2;
      }
      else {
        onAxisLead = (isX ? alignXRatio : alignYRatio) * slack;
      }

      if (slack > 0) {
        let weight = 0;
        for (let i = 0; i < n; ++i) if (row[i].grow > 0) weight += row[i].grow;

        if (weight > 0) {
          for (let i = 0; i < n; ++i) if (row[i].grow > 0) {
            sizes[i] += slack * row[i].grow / weight;
          }
          onAxisLead = 0;
        }
      }
      else if (slack < 0) {
        let weight = 0;
        for (let i = 0; i < n; ++i) if (row[i].shrink < 0) weight -= row[i].shrink;

        if (weight > 0) {
          for (let i = 0; i < n; ++i) if (row[i].shrink < 0) {
            sizes[i] += slack * row[i].shrink / weight;
          }
          onAxisLead = 0;
        }
      }

      let onAxis = 0;

      for (let i = 0; i < n; ++i) {
        const block = row[i];
        const {box, size} = block;

        let [l, t] = box;
        if (isX) {
          l += onAxis + onAxisLead;
          t += offAxis;
        }
        else {
          t += onAxis + onAxisLead;
          l += offAxis;
        }

        const r = l + ( isX ? sizes[i] : size[0]);
        const b = t + (!isX ? sizes[i] : size[1]);
        results.push({
          ...block,
          box: [l, t, r, b],
          size: [r - l, b - t],
        });

        onAxis += size[isX ? 0 : 1] + onAxisSpace;
      }
      if (n) onAxis -= onAxisSpace;

      maxOn = Math.max(maxOn, onAxis);
      offAxis += maxOff;
      row.length = accum = maxOff = n = 0;      
    };

    const blocks = ls.map(l => l(block));
    for (const block of blocks) {
      const {size} = block;
      const s = size[isX ? 0 : 1];

      if (isWrap && (accum + s > w)) reduce();
      accum += s;
      maxOff = Math.max(maxOff, size[isX ? 1 : 0]);
      ++n;

      sizes.push(s);
      row.push(block);
    }
    reduce();

    if (isX) {
      w = maxOn;
      h = offAxis;
    }
    else {
      w = offAxis;
      h = maxOn;
    }

    const size = [w, h];

    return ([l, t]: LayoutState) => ({
      box: [l, t, l + w, t + h],
      size,
      results,
      grow: 1,
      shrink: 1,
    });
  };
}
