import { Margin, Point, LayoutState, LayoutGenerator, LayoutResult } from '../types';
import { parseAlignment } from './util';

export const makeFlexLayout = (
  direction: 'x' | 'y' = 'x',
  alignX: 'start' | 'center' | 'end' | 'justify' | 'between' = 'start',
  alignY: 'start' | 'center' | 'end' | 'justify' | 'between' = 'start',
  wrap: boolean = false,
  snap: boolean = true,
) => {
  const isX = (direction === 'x');

  const alignXRatio = parseAlignment(alignX);
  const alignYRatio = parseAlignment(alignY);

  const alignMain = isX ? alignX : alignY;
  const isJustify = alignMain === 'justify';
  const isBetween = alignMain === 'between';
  const isSnap = !!snap;
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

    let offAxis = 0;

    const reduce = () => {
      const n = row.length;
      if (!n) return;

      // Extra space to be grown (+) or shrunk (-)
      const slack = (isX ? w : h) - accum;

      // Alignment on the main axis
      let onAxis = 0;
      let onAxisLead = 0;
      let onAxisSpace = 0;

      if (isBetween) {
        if (n > 1) {
          onAxisSpace = Math.max(0, slack / n);
          onAxisLead = onAxisSpace / 2;
        }
        else onAxisLead = slack / 2;
      }
      else if (isJustify) {
        if (n > 1) onAxisSpace = Math.max(0, slack / Math.max(1, n - 1));
        else onAxisLead = slack / 2;
      }
      else {
        onAxisLead = (isX ? alignXRatio : alignYRatio) * slack;
      }

      // Grow/shrink row if applicable
      if (slack > 0) {
        if (growRow(slack, row, sizes)) onAxisLead = onAxisSpace = 0;
      }
      else if (slack < 0) {
        if (shrinkRow(slack, row, sizes)) onAxisLead = onAxisSpace = 0;
      }

      // Lay out a row of flexed boxes
      for (let i = 0; i < n; ++i) {
        const block = row[i];
        const {box, size, margin} = block;
        const [ml, mt, mr, mb] = margin;

        // Top left
        let [l, t] = box;
        if (isX) {
          l += onAxis + onAxisLead + ml;
          t += offAxis + mt;
        }
        else {
          t += onAxis + onAxisLead + mt;
          l += offAxis + ml;
        }

        // Final size
        let w =  isX ? sizes[i] : size[0];
        let h = !isX ? sizes[i] : size[1];

        let r = l + w;
        let b = t + h;

        // Snap to pixels
        if (isSnap) {
          l = Math.round(l);
          t = Math.round(t);
          r = Math.round(r);
          b = Math.round(b);
          w = r - l;
          h = b - t;
        }

        results.push({
          ...block,
          box: [l, t, r, b],
          size: [w, h],
        });

        // Move cursor ahead
        onAxis += (isX ? ml + w + mr : mt + h + mb) + onAxisSpace;
      }

      // Remove last space if justifying
      if (n && isJustify) onAxis -= onAxisSpace;

      maxOn = Math.max(maxOn, onAxis);
      offAxis += maxOff;
      row.length = accum = maxOff = 0;      
    };

    // Accumulate blocks into row(s),
    // reduce a row once it's full.
    const blocks = ls.map(l => l(block));
    for (const block of blocks) {
      const {size, margin} = block;

      const s    =   size[isX ? 0 : 1];
      const mOn  = margin[isX ? 0 : 1] + margin[isX ? 2 : 3];
      const mOff = margin[isX ? 1 : 0] + margin[isX ? 3 : 2];

      if (isWrap && (accum + s + mOn > w)) reduce();
      accum += s + mOn;
      maxOff = Math.max(maxOff, size[isX ? 1 : 0] + mOff);

      sizes.push(s);
      row.push(block);
    }
    reduce();

    // Get final size
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
      margin: [0, 0, 0, 0] as Margin,
      results,
      grow: 1,
      shrink: 1,
    });
  };
}

// Grow all applicable blocks in a row to add extra slack.
export const growRow = (slack: number, row: LayoutResult[], sizes: number[]) => {
  const n = row.length;

  let weight = 0;
  for (let i = 0; i < n; ++i) if (row[i].grow > 0) weight += row[i].grow;

  if (weight > 0) {
    for (let i = 0; i < n; ++i) if (row[i].grow > 0) {
      sizes[i] += slack * row[i].grow / weight;
    }
    return true;
  }
  return false;
}

// Shrink all applicable blocks in a row to remove excess slack.
export const shrinkRow = (slack: number, row: LayoutResult[], sizes: number[]): boolean => {
  const n = row.length;

  let weight = 0;
  for (let i = 0; i < n; ++i) if (row[i].shrink) weight += row[i].shrink * sizes[i];

  if (weight > 0) {
    let negative = 0;
    for (let i = 0; i < n; ++i) if (row[i].shrink > 0 && sizes[i]) {
      sizes[i] += slack * row[i].shrink * sizes[i] / weight;
      if (sizes[i] < 0) {
        negative += sizes[i];
        sizes[i] = 0;
      }
    }
    if (negative) {
      shrinkRow(negative, row, sizes);
    }
    return true;
  }
  return false;
}
