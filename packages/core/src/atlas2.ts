type Rectangle = [number, number, number, number];
type Point = [number, number];
type Caret = [number, number];
type Direction = number;

type Anchor = {
  pt: Point,
  shadow: [number, number] | null,
  caret: Caret | null,
};

type Edge = {
  a: Point,
  b: Point,
  dir: Direction,
  dx: number,
  dy: number,
};

const NONE = 0;
const LEFT = -1;
const DOWN = -2;
const RIGHT = 1;
const UP = 2;
const DIAG = 5;
const getDirection = (dx: number, dy: number) => (
  (dx && !dy) ? (dx > 0 ? RIGHT : LEFT) :
  (dy && !dx) ? (dy > 0 ? DOWN : UP) :
  (dx && dy) ? DIAG : NONE
);

const sign = (x: number) => x > 0 ? 1 : x < 0 ? -1 : 0;

const NEW_CARET: Caret = [-1, -1];
const SPLIT_X: Caret = [1, 0];
const SPLIT_Y: Caret = [0, 1];

export type AtlasMapping = {
  rect: Rectangle,
  uv: Rectangle,
};

enum Overlap {
  none = 'none',
  some = 'some',
};

export const makeAtlas = (
  width: number,
  height: number,
) => {
  let anchors = [] as Anchor[];
  let edges = [] as Edges[];

  const map = new Map<number, AtlasMapping>();

  let lastR = 0;
  let lastB = 0;

  const getNextAvailable = (w: number, h: number, debug: boolean = false) => {
    let n = anchors.length;

    let anchor: Anchor | null = null;
    let index = -1;
    let max = 0;

    for (let i = 0; i < n; ++i) {
      const a = anchors[i];
      const {pt: [x, y], shadow, caret} = a;
      if (!caret) continue;

      const [cw, ch] = caret;

      const sx = Math.max(0, getCornerX(edges, i)) || cw;
      const sy = Math.max(0, getCornerY(edges, i)) || ch;

      if (w <= cw && h <= ch) {
        const fx = (w <= sx ? w / sx : w / cw);
        const fy = (h <= sy ? h / sy : h / ch);

        const s = x === lastR ? 1.0 : y === lastB ? 0.75 : 0.5;
        const f = 1.0 - (Math.min(x / width, y / height) + (x / width * y / height)) * .25;
        const d = s * f * fx * fy;
        if (debug) console.log({s, f, d, x, y})
        if (d > max) {
          anchor = a;
          index = i;
          max = d;
        }
      }
    }

    return {anchor, index};
  }
 
  const resolveCarets = (anchors: Anchor[], edges: Edge[], rect: Rectangle) => {
    const [l, t, r, b] = rect;
    
    const splits: [number, number, number, number][] = [];

    for (let a of anchors) {
      if (a.caret === NEW_CARET) {
        a.caret = clipCaretToEdges(a.pt, edges);
      }
      else if (a.caret) {
        let [cw, ch] = a.caret;
        a.caret = clipCaretToEdges(a.pt, edges, a.caret);

        if (a.caret) {
          let [ncw, nch] = a.caret;
          let dx = ncw - cw;
          let dy = nch - ch;

          if (a.shadow === SPLIT_Y && dx) {
            splits.push([r + 1, a.pt[1], 0, 1]);
          }
          if (a.shadow === SPLIT_X && dy) {
          
            splits.push([a.pt[0], b + 1, 1, 0]);
          }
        }
      }
    }

    for (let [x, y, dx, dy] of splits) {
      console.log('split at', x, y, dx, dy)
      castSplit(anchors, edges, [x - dx * 2, y - dy * 2, x, y], dx, dy);
    }
  };
  
  const clipCaretToEdges = (
    [l, t]: [number, number],
    edges: Edge[],
    caret?: [number. number] | null,
  ) => {
    const c = caret ?? [width - l, height - t] as Caret;
    let [w, h] = c;

    for (const edge of edges) {
      const {a: [x, y], dx, dy} = edge;

      if (edge.dir === LEFT) {
        const yo = getRangeOverlap(t, t + h, y - 1, y);
        if (yo === Overlap.some) {
          const xo = getRangeOverlap(l, l + w, x + dx, x, x + dx);
          if (l === 210 && t === 700) console.log('clip X to', x, y, '@', xo, yo);
          if (xo !== Overlap.none) {
            h = Math.min(h, y - t);
          }
        }
      }
      if (edge.dir === DOWN) {
        const xo = getRangeOverlap(l, l + w, x - 1, x);
        if (xo === Overlap.some) {
          const yo = getRangeOverlap(t, t + h, y, y + dy);
          if (yo !== Overlap.none) {
            w = Math.min(w, x - l);
          }
        }        
      }
    }
    
    if (w <= 0 || h <= 0) return null;

    c[0] = w;
    c[1] = h;
    return c;
  };
  
  const insertAnchors = (
    anchors: Anchor[],
    edges: Edge[],
    index: number,
    rect: Rectangle,
  ) => {
    const [l, t, r, b] = rect;
    const w = r - l;
    const h = b - t;

    const oldAnchor  = anchors[index];
    const prevAnchor = anchors[index - 1];
    const nextAnchor = anchors[index + 1];

    const {x, y, shadow} = oldAnchor;
    
    const dx = getCornerX(edges, index);
    const dy = getCornerY(edges, index);

    const isShadowX = shadow === SPLIT_X;
    const isShadowY = shadow === SPLIT_Y;

    const p1 = prevAnchor.pt;
    const pa = (isShadowX) ? [l, t] : null;
    const pb = (isShadowX || dy !== h) ? [l, b] : null;
    const pc = [r, b];
    const pd = (isShadowY || dx !== w) ? [r, t] : null;
    const pe = (isShadowY) ? [l, t] : null;
    const p2 = nextAnchor.pt;

    const newCarets: Caret[] = [];
    if (pa) newCarets.push(null);
    if (pb) newCarets.push(NEW_CARET);
    if (pc) newCarets.push(null);
    if (pd) newCarets.push(NEW_CARET);
    if (pe) newCarets.push(null);

    const e1 = pa ? makeEdge(pa, pb) : null;
    const e2 = pb ? makeEdge(pb, pc) : null;
    const e3 = pd ? makeEdge(pc, pd) : null;
    const e4 = pe ? makeEdge(pd, pe) : null;

    const e0 = prevAnchor ? makeEdge(prevAnchor.pt, pa ?? pb ?? pc) : null;
    const e5 = nextAnchor ? makeEdge(pe ?? pd ?? pc, nextAnchor.pt) : null;

    console.log({pa, pb, pc, pd, pe, e1, e2, e3});

    const newEdges: Edge[] = [];
    if (e0) newEdges.push(e0);
    if (e1) newEdges.push(e1);
    if (e2) newEdges.push(e2);
    if (e3) newEdges.push(e3);
    if (e4) newEdges.push(e4);
    if (e5) newEdges.push(e5);

    const newAnchors: Anchor[] = newCarets.map((caret, i) => makeAnchor(newEdges[i], newEdges[i + 1], caret));

    anchors = anchors.slice();
    edges = edges.slice();

    const na = 1;
    const ne = +!!prevAnchor + +!!nextAnchor;

    const i = index - +!!prevAnchor;

    anchors = [
      ...anchors.slice(0, index),
      ...newAnchors,
      ...anchors.slice(index + na),
    ];

    edges = [
      ...edges.slice(0, i),
      ...newEdges,
      ...edges.slice(i + ne),
    ];

    resolveCarets(anchors, edges, rect);
    castSplit(anchors, edges, rect, dx, dy);

    return fixUp(anchors, edges);
  }
  
  const fixUp = (anchors: Anchor[], edges: Edge[]) => {
    let n = anchors.length;

    let newAnchors: Anchor[] = [];
    let newEdges: Edge[] = [];

    let measure: number[] = [];

    let last = null;
    for (let i = 0; i < n; ++i) {
      const a = anchors[i];
      
      const e1 = edges[i - 1];
      const e2 = edges[i];

      const degen = isDegen(e1, e2);
      const {shadow} = a;
      
      if (degen) {
        if (!shadow && last) last.shadow = undefined;
        measure.push(newEdges.length);
        continue;
      }

      if (newAnchors.length) newEdges.push(edges[i - 1]);
      newAnchors.push(a);
      last = a;
    }

    for (const i of measure) {
      newEdges[i] = measureEdge(newEdges[i], newAnchors, i);
    }

    if (newAnchors.length !== anchors.length) return fixUp(newAnchors, newEdges);
    return [newAnchors, newEdges];
  };

  const castSplit = (anchors: Anchor[], edges: Edge[], rect: Rectangle, dx: number, dy: number) => {
    let [l, t, r, b] = rect;
    const w = r - l;
    const h = b - t;

    if (dy < h) {
      let min = Infinity;
      let split = -1;
      let at = 0;

      let n = anchors.length - 1;
      for (let i = 0; i < n; ++i) {
        const ca = anchors[i];
        const cb = anchors[i + 1];

        const pa = ca.pt;
        const pb = cb.pt;
      
        const [ax, ay] = pa;
        const [bx, by] = pb;
        
        if (ax === bx && ax < l) {
          if (ay >= b && by < b) {
            const d = l - ax;
            if (d < 0 || d >= min) continue;
            min = d;
            split = i;
            at = ax;
          }
        }
      }

      if (split >= 0) {
        const pt = [at, b] as Point;

        const e1 = makeEdge(anchors[split].pt, pt);
        const e2 = makeEdge(pt, anchors[split + 1].pt);

        const a = makeAnchor(e1, e2, NEW_CARET, SPLIT_Y);
        a.caret = clipCaretToEdges(pt, edges);

        anchors.splice(split + 1, 0, a);
        edges.splice(split, 1, e1, e2);
      }
    }

    if (dx < w) {
      let min = Infinity;
      let split = -1;
      let at = 0;

      let n = anchors.length - 1;
      for (let i = 0; i < n; ++i) {
        const ca = anchors[i];
        const cb = anchors[i + 1];

        const pa = ca.pt;
        const pb = cb.pt;
      
        const [ax, ay] = pa;
        const [bx, by] = pb;

        if (ay === by && ay < t) {
          if (bx >= r && ax < r) {
            const d = t - ay;
            if (d < 0 || d >= min) continue;
            min = d;
            split = i;
            at = ay;
          }
        }
      }

      if (split >= 0) {
        const pt = [r, at] as Point;

        const e1 = makeEdge(anchors[split].pt, pt);
        const e2 = makeEdge(pt, anchors[split + 1].pt);

        const a = makeAnchor(e1, e2, NEW_CARET, SPLIT_Y);
        a.caret = clipCaretToEdges(pt, edges);

        anchors.splice(split + 1, 0, a);
        edges.splice(split, 1, e1, e2);
      }
    }
  };

  const place = (key: number, w: number, h: number) => {
    console.log('-----')
    if (map.get(key)) throw new Error("key mapped already", key);

    console.log({anchors, edges})

    const {anchor, index} = getNextAvailable(w, h, true);
    if (index < 0) {
      console.warn('atlas full?', index);
      getNextAvailable(w, h, true);
      return null;
    }

    const {pt: [x, y]} = anchor;
    const rect = [x, y, x + w, y + h];
    const uv = [rect[0] / width, rect[1] / height, rect[2] / width, rect[2] / height];

    lastR = x + w;
    lastB = y + h;

    [anchors, edges] = insertAnchors(anchors, edges, index, rect);
    console.log({anchors, edges})
    console.log({rect})

    const placement = {rect, uv};
    map.set(key, placement);
    return placement;
  };

  const debugAnchors = () => anchors;
  const debugPlacements = () => Array.from(map.keys()).map(k => map.get(k)!);
  
  const debugValidate = () => {
    const rects = debugPlacements().map(({rect}) => rect);
    
    const out: Caret[] = [];

    let n = rects.length;
    for (let i = 0; i < n; ++i) {
      const a = rects[i];
      for (let j = i + 1; j < n; ++j) {
        const b = rects[j];
        if (!(a[0] >= b[2] || b[0] >= a[2] || a[1] >= b[3] || b[1] >= a[3])) {
          console.warn(`Overlap detected ${a.join(',')} => ${b.join(',')}`);
          const x = Math.max(a[0], b[0]);
          const y = Math.max(a[1], b[1]);
          const dx = Math.min(a[2], b[2]) - x;
          const dy = Math.min(a[3], b[3]) - y;
          out.push({x, y, dx, dy});
        }
      }
    }

    return out;
  }

  const pt1: Point = [0, height];
  const pt2: Point = [0, 0];
  const pt3: Point = [width, 0];

  const e1 = makeEdge(pt1, pt2);
  const e2 = makeEdge(pt2, pt3);

  const a1 = makeAnchor(null, e1);
  const a2 = makeAnchor(e1, e2, [width, height]);
  const a3 = makeAnchor(e2, null);

  anchors.push(a1, a2, a3);
  edges.push(e1, e2);
  
  return {place, map, width, height, debugAnchors, debugPlacements, debugValidate};
};

const isDegen = (a?: Edge | null, b?: Edge | null) => {
  let degen = true;
  if (a && b) {
    if (a.dx && b.dx && a.dy && b.dy) {
      // diag vertex, keep
      degen = false;
    }
    else if (a.dx && b.dx) {
      if (a.dir === b.dir) {
        degen = false;
      }
    }
    else if (a.dy && b.dy) {
      if (a.dir === b.dir) {
        degen = false;
      }
    }
    else {
      degen = false;
    }
  }
  else if (a) {
    degen = (a.dx && a.dy);
  }
  else if (b) {
    degen = (b.dx && b.dy);
  }
  return degen;
}

const makeAnchor = (
  a: Edge | null,
  b: Edge | null,
  caret: Caret | null = null,
  shadow: null,
) => {
  let pt: Point | null = a?.b ?? b?.a ?? null;
  let x, y;
  if (pt) [x, y] = pt;
  
  return {x, y, pt, caret, shadow};
}

const makeEdge = (
  a: Point,
  b: Point,
) => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const dir = getDirection(dx, dy);
  return {a, b, dir, dx, dy};
};

const measureEdge = (edge: Edge, anchors: Anchor[], index: number) => {
  const a = anchors[index].pt;
  const b = anchors[index + 1].pt;

  const dx = b[0] - a[0];
  const dy = b[1] - a[1];

  const dir = getDirection(dx, dy);
  
  return {a, b, dx, dy, dir};
};

const getCornerX = (edges: Edge[], index: number) => {
  const a = edges[index - 1];
  const b = edges[index];
  return a?.dx || -b?.dx || 0;
};

const getCornerY = (edges: Edge[], index: number) => {
  const a = edges[index - 1];
  const b = edges[index];
  return a?.dy || -b?.dy || 0;
};

const getRangeOverlap = (minA: number, maxA: number, minB: number, maxB: number) => {
  if (maxA <= minB || maxB <= minA) return Overlap.none;
  return Overlap.some;
};

