import { esdt, esdt1d, resolveSDF } from './sdf-esdt';
import { makeSDFStage } from './sdf';

const INF = 1e10;

const fmt = (d: number[], w: number, h: number) => {
  const m: any[][] = [];
  for (let y = 0; y < h; y++) {
    const r: any[] = [];
    for (let x = 0; x < w; x++) {
      const v = +d[x + y * w];
      r.push(v > 1000 ? 'I' : v.toFixed(2));
    }
    m.push(r);
  }
  return m;
}

const sqr = (x: number) => x * x;

describe('edt', () => {
  it('edt1d pixel aligned', () => {
    
    const I = 1e10;
    const mask = [0, 0, 0, I, I, I, I, I, I, 0, 0, 0] as any;
    const xs   = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] as any;
    const ys   = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] as any;

    const offset = 0;
    const stride = 1;
    const length = mask.length;
    
    const f = [] as any;
    const z = [] as any;
    const b = [] as any;
    const t = [] as any;
    const v = [] as any;
    
    esdt1d(mask, xs, ys, offset, stride, length, f, z, b, t, v, 1);
    expect(xs).toEqual([0, 0, 0,-1,-2,-3, 3, 2, 1, 0, 0, 0])
  });

  it('edt1d fractional left', () => {
    
    const I = 1e10;
    const F = -0.25;
    const mask = [0, 0, 0, I, I, I, I, I, I, 0, 0, 0] as any;
    const xs   = [0, 0, F, 0, 0, 0, 0, 0, 0, F, 0, 0] as any;
    const ys   = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] as any;

    const offset = 0;
    const stride = 1;
    const length = mask.length;
    
    const f = [] as any;
    const z = [] as any;
    const b = [] as any;
    const t = [] as any;
    const v = [] as any;
    
    esdt1d(mask, xs, ys, offset, stride, length, f, z, b, t, v, 1);
    
    expect(xs).toEqual([0, 0, F,-1+F,-2+F,-3+F,3+F,2+F,1+F, 0, 0, 0])
  });

  it('edt1d signed pixel aligned', () => {
    
    const I = 1e10;
    const outer = [I, I, 0, 0, 0, 0, 0, 0, 0, 0, I, I] as any;
    const inner = [0, 0, 0, I, I, I, I, I, I, 0, 0, 0] as any;

    const xo    = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] as any;
    const yo    = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] as any;
    const xi    = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] as any;
    const yi    = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] as any;

    const offset = 0;
    const stride = 1;
    const length = outer.length;
    
    const f = [] as any;
    const z = [] as any;
    const b = [] as any;
    const t = [] as any;
    const v = [] as any;
    
    esdt1d(outer, xo, yo, offset, stride, length, f, z, b, t, v, 1);
    esdt1d(inner, xi, yi, offset, stride, length, f, z, b, t, v, -1);

    const ds: number[] = [];
    resolveSDF(xo, yo, xi, yi, (d: number, i: number) => {
      ds.push(d);
    });

    expect(ds).toEqual([2, 1, 0, -1, -2, -3, -3, -2, -1, 0, 1, 2]);
  });

  it('edt1d signed fractional left-left', () => {
    
    const I = 1e10;
    const outer = [I, I, 0, 0, 0, 0, 0, 0, 0, 0, I, I] as any;
    const inner = [0, 0, 0, I, I, I, I, I, I, 0, 0, 0] as any;

    const F = -0.25;

    const xo    = [0, 0, F, 0, 0, 0, 0, 0, 0, F, 0, 0] as any;
    const yo    = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] as any;
    const xi    = [0, 0, F, 0, 0, 0, 0, 0, 0, F, 0, 0] as any;
    const yi    = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] as any;

    const offset = 0;
    const stride = 1;
    const length = outer.length;
    
    const f = [] as any;
    const z = [] as any;
    const b = [] as any;
    const t = [] as any;
    const v = [] as any;
    
    esdt1d(outer, xo, yo, offset, stride, length, f, z, b, t, v, 1);
    esdt1d(inner, xi, yi, offset, stride, length, f, z, b, t, v, -1);

    const ds: number[] = [];
    resolveSDF(xo, yo, xi, yi, (d: number, i: number) => {
      ds.push(d);
    });
    
    expect(ds).toEqual([2+F, 1+F, +F, -1+F, -2+F, -3+F, -3-F, -2-F, -1-F, 0-F, 1-F, 2-F]);
  });

  it('edt1d signed fractional right-right', () => {
    
    const I = 1e10;
    const outer = [I, I, 0, 0, 0, 0, 0, 0, 0, 0, I, I] as any;
    const inner = [0, 0, 0, I, I, I, I, I, I, 0, 0, 0] as any;

    const F = 0.25;

    const xo    = [0, 0, F, 0, 0, 0, 0, 0, 0, F, 0, 0] as any;
    const yo    = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] as any;
    const xi    = [0, 0, F, 0, 0, 0, 0, 0, 0, F, 0, 0] as any;
    const yi    = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] as any;

    const offset = 0;
    const stride = 1;
    const length = outer.length;
    
    const f = [] as any;
    const z = [] as any;
    const b = [] as any;
    const t = [] as any;
    const v = [] as any;
    
    esdt1d(outer, xo, yo, offset, stride, length, f, z, b, t, v, 1);
    esdt1d(inner, xi, yi, offset, stride, length, f, z, b, t, v, -1);

    const ds: number[] = [];
    resolveSDF(xo, yo, xi, yi, (d: number, i: number) => {
      ds.push(d);
    });

    expect(ds).toEqual([2+F, 1+F, +F, -1+F, -2+F, -3+F, -3-F, -2-F, -1-F, 0-F, 1-F, 2-F]);
  });

  it('edt1d signed fractional left-right', () => {
    
    const I = 1e10;
    const outer = [I, I, 0, 0, 0, 0, 0, 0, 0, 0, I, I] as any;
    const inner = [0, 0, 0, I, I, I, I, I, I, 0, 0, 0] as any;

    const F = -0.25;

    const xo    = [0, 0, F, 0, 0, 0, 0, 0, 0,-F, 0, 0] as any;
    const yo    = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] as any;
    const xi    = [0, 0, F, 0, 0, 0, 0, 0, 0,-F, 0, 0] as any;
    const yi    = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] as any;

    const offset = 0;
    const stride = 1;
    const length = outer.length;
    
    const f = [] as any;
    const z = [] as any;
    const b = [] as any;
    const t = [] as any;
    const v = [] as any;
    
    esdt1d(outer, xo, yo, offset, stride, length, f, z, b, t, v, 1);
    esdt1d(inner, xi, yi, offset, stride, length, f, z, b, t, v, -1);

    const ds: number[] = [];
    resolveSDF(xo, yo, xi, yi, (d: number, i: number) => {
      ds.push(d);
    });
    
    expect(ds).toEqual([2+F, 1+F, +F, -1+F, -2+F, -3+F, -3+F, -2+F, -1+F, 0+F, 1+F, 2+F]);
  });

  it('edt1d signed fractional right-left', () => {
    
    const I = 1e10;
    const outer = [I, I, 0, 0, 0, 0, 0, 0, 0, 0, I, I] as any;
    const inner = [0, 0, 0, I, I, I, I, I, I, 0, 0, 0] as any;

    const F = 0.25;

    const xo    = [0, 0,-F, 0, 0, 0, 0, 0, 0, F, 0, 0] as any;
    const yo    = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] as any;
    const xi    = [0, 0,-F, 0, 0, 0, 0, 0, 0, F, 0, 0] as any;
    const yi    = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] as any;

    const offset = 0;
    const stride = 1;
    const length = outer.length;
    
    const f = [] as any;
    const z = [] as any;
    const b = [] as any;
    const t = [] as any;
    const v = [] as any;
    
    esdt1d(outer, xo, yo, offset, stride, length, f, z, b, t, v, 1);
    esdt1d(inner, xi, yi, offset, stride, length, f, z, b, t, v, -1);

    const ds: number[] = [];
    resolveSDF(xo, yo, xi, yi, (d: number, i: number) => {
      ds.push(d);
    });
    
    expect(ds).toEqual([2-F, 1-F, -F, -1-F, -2-F, -3-F, -3-F, -2-F, -1-F, 0-F, 1-F, 2-F]);
  });

  fit('edt2d transverse pixel aligned', () => {
    
    const I = 1e10;
    const mask = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] as any;
    const xs   = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] as any;
    const ys   = [0, 0, 0,-5,-6,-7,-7,-6,-5, 0, 0, 0] as any;

    const offset = 0;
    const stride = 1;
    const length = mask.length;
    
    const f = [] as any;
    const z = [] as any;
    const b = [] as any;
    const t = [] as any;
    const v = [] as any;
    
    esdt1d(mask, xs, ys, offset, stride, length, f, z, b, t, v, 1);
    
    console.log(fmt(xs, 12, 1));
    console.log(fmt(ys, 12, 1));
    
    // expect(xs).toEqual([0, 0, 0,-1,-2,-3, 3, 2, 1, 0, 0, 0])
  });
});
