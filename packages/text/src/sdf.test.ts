import { edt, edt1d, edt1dSubpixel, edtSubpixel, edtSubpixelAlt, makeSDFStage, paintSubpixelOffsets } from './sdf';

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

describe('edt', () => {
  
  // edt1d doesn't work reliably if there are no grayscale pixels
  
  it('edt1d pixel aligned', () => {
    
    const grid = [0, 0, 0, INF, INF, INF, INF, INF, 0, 0, 0] as any;
    const offset = 0;
    const stride = 1;
    const length = grid.length;
    
    const f = [] as any;
    const z = [] as any;
    const v = [] as any;
    
    edt1d(grid, offset, stride, length, f, z, v);
    
    const ds = grid.map((x: number) => Math.sqrt(x));
    expect(ds).toEqual([0, 0, 0, 1, 2, 3, 2, 1, 0, 0, 0])
  });

  it('edt1d signed pixel aligned', () => {
    
    const outer = [0, 0, 0, INF, INF, INF, INF, INF, 0, 0, 0] as any;
    const inner = outer.map((x: number) => INF - x);

    const offset = 0;
    const stride = 1;
    const length = outer.length;
    
    const f = [] as any;
    const z = [] as any;
    const v = [] as any;
    
    edt1d(outer, offset, stride, length, f, z, v);
    edt1d(inner, offset, stride, length, f, z, v);
    
    const ds = outer.map((_: number, i: number) => Math.sqrt(outer[i]) - Math.sqrt(inner[i]));

    //                       ------.        -------.
    //                             v               v
    expect(ds).toEqual([-3, -2, -1, 1, 2, 3, 2, 1, -1, -2, -3]);
  });
  
  it('edt2d pixel aligned', () => {
    
    const I = INF;
    const inner = [
      0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0,
      0, 0, I, I, 0, 0,
      0, 0, I, I, 0, 0,
      0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0,
    ] as any;
    const outer = inner.map((x: number) => I - x);

    const wp = 6;
    const hp = 6;
    
    const f = [] as any;
    const z = [] as any;
    const v = [] as any;
    
    edt(outer, 0, 0, wp, hp, wp, f, z, v);
    edt(inner, 0, 0, wp, hp, wp, f, z, v);
    
    const ds = outer.map((x: number, i: number) =>
      Math.max(0, Math.sqrt(outer[i]) - 0.5) -
      Math.max(0, Math.sqrt(inner[i]) - 0.5));

    console.log(fmt(ds, wp, hp));
  });
  
  ////////////////////////////////

    
  it('edt1d subpixel no shift', () => {
    
    const grid = [0, 0, 0, INF, INF, INF, INF, INF, 0, 0, 0] as any;
    const shift = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] as any;

    const offset = 0;
    const stride = 1;
    const length = grid.length;
    
    const f = [] as any;
    const z = [] as any;
    const v = [] as any;
    const b = [] as any;
    
    edt1dSubpixel(grid, shift, offset, stride, length, f, z, v, b);

    const ds = grid.map((x: number) => Math.sqrt(x));
    expect(ds).toEqual([0, 0, 0, 1, 2, 3, 2, 1, 0, 0, 0])
  });

  it('edt1d subpixel half-pixel', () => {
    
    const I = INF;
    const H = 0.5;
    const grid  = [0, 0, 0, I, I, I, I, I, 0, 0, 0] as any;
    const shift = [0, 0, H, 0, 0, 0, 0, 0, -H, 0, 0] as any;

    const offset = 0;
    const stride = 1;
    const length = grid.length;
    
    const f = [] as any;
    const z = [] as any;
    const v = [] as any;
    const b = [] as any;
    
    edt1dSubpixel(grid, shift, offset, stride, length, f, z, v, b);

    const ds = grid.map((x: number) => Math.sqrt(x));
    expect(ds).toEqual([0, 0, 0, 0.5, 1.5, 2.5, 1.5, 0.5, 0, 0, 0])
  });

  it('edt1d subpixel quarter-pixel', () => {
    
    const I = INF;
    const Q = 0.25;
    const grid  = [0, 0, 0, I, I, I, I, I, 0, 0, 0] as any;
    const shift = [0, 0, Q, 0, 0, 0, 0, 0, -Q, 0, 0] as any;

    const offset = 0;
    const stride = 1;
    const length = grid.length;
    
    const f = [] as any;
    const z = [] as any;
    const v = [] as any;
    const b = [] as any;
    
    edt1dSubpixel(grid, shift, offset, stride, length, f, z, v, b);

    console.log(fmt(grid.map(Math.sqrt), 11, 1))

    const ds = grid.map((x: number) => Math.sqrt(x));
    expect(ds).toEqual([0, 0, 0, 0.75, 1.75, 2.75, 1.75, 0.75, 0, 0, 0])
  });

  it('edt1d subpixel signed pixel aligned', () => {
    
    const I = INF;
    const H = 0.5;
    const outer = [I, I, I, 0, 0, 0, 0, 0, I, I, I] as any;
    const inner = [0, 0, 0, I, I, I, I, I, 0, 0, 0] as any;

    const shift1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] as any;
    const shift2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] as any;

    const offset = 0;
    const stride = 1;
    const length = outer.length;
    
    const f = [] as any;
    const z = [] as any;
    const v = [] as any;
    const b = [] as any;
    
    edt1dSubpixel(outer, shift1, offset, stride, length, f, z, v, b);
    edt1dSubpixel(inner, shift2, offset, stride, length, f, z, v, b);
    
    const ds = outer.map((_: number, i: number) => 
      Math.max(0, Math.sqrt(outer[i]) - 0.5) -
      Math.max(0, Math.sqrt(inner[i]) - 0.5));

    expect(ds).toEqual([2.5, 1.5, 0.5, -0.5, -1.5, -2.5, -1.5, -0.5, 0.5, 1.5, 2.5]);
  });
  
  it('edt1d subpixel signed half-pixel', () => {
    
    const I = INF;
    const outer = [I, I, I, 0, 0, 0, 0, 0, I, I, I] as any;
    const inner = [0, 0, 0, I, I, I, I, I, 0, 0, 0] as any;

    const H = 0.5;
    const shift1 = [0, 0, 0, H, 0, 0, 0, -H, 0, 0, 0] as any;
    const shift2 = [0, 0, H, 0, 0, 0, 0, 0, -H, 0, 0] as any;

    const offset = 0;
    const stride = 1;
    const length = outer.length;
    
    const f = [] as any;
    const z = [] as any;
    const v = [] as any;
    const b = [] as any;
    
    edt1dSubpixel(outer, shift1, offset, stride, length, f, z, v, b);
    edt1dSubpixel(inner, shift2, offset, stride, length, f, z, v, b);
    
    const ds = outer.map((_: number, i: number) => 
      Math.max(0, Math.sqrt(outer[i]) - 0.5) -
      Math.max(0, Math.sqrt(inner[i]) - 0.5));
      
    expect(ds).toEqual([3, 2, 1, 0, -1, -2, -1, 0, 1, 2, 3]);
  });
  
  it('edt1d subpixel signed half-pixel opposite', () => {
    
    const I = INF;
    const outer = [I, I, I, I, 0, 0, 0, I, I, I, I] as any;
    const inner = [0, 0, 0, 0, I, I, I, 0, 0, 0, 0] as any;

    const H = 0.5;
    const shift1 = [0, 0, 0, 0, -H, 0, H, 0, 0, 0, 0] as any;
    const shift2 = [0, 0, 0, -H, 0, 0, 0, H, 0, 0, 0] as any;

    const offset = 0;
    const stride = 1;
    const length = outer.length;
    
    const f = [] as any;
    const z = [] as any;
    const v = [] as any;
    const b = [] as any;
    
    edt1dSubpixel(outer, shift1, offset, stride, length, f, z, v, b);
    edt1dSubpixel(inner, shift2, offset, stride, length, f, z, v, b);
    
    const ds = outer.map((_: number, i: number) => 
      Math.max(0, Math.sqrt(outer[i]) - 0.5) -
      Math.max(0, Math.sqrt(inner[i]) - 0.5));
      
    expect(ds).toEqual([3, 2, 1, 0, -1, -2, -1, 0, 1, 2, 3]);
  });
  
  
  it('edt1d subpixel signed half-pixel same', () => {
    
    const I = INF;
    const outer = [I, I, I, I, 0, 0, 0, 0, I, I, I] as any;
    const inner = [0, 0, 0, 0, I, I, I, I, 0, 0, 0] as any;

    const H = 0.5;
    const shift1 = [0, 0, 0, 0, -H, 0, 0, -H, 0, 0, 0] as any;
    const shift2 = [0, 0, 0, -H, 0, 0, 0, 0, -H, 0, 0] as any;

    const offset = 0;
    const stride = 1;
    const length = outer.length;
    
    const f = [] as any;
    const z = [] as any;
    const v = [] as any;
    const b = [] as any;
    
    edt1dSubpixel(outer, shift1, offset, stride, length, f, z, v, b);
    edt1dSubpixel(inner, shift2, offset, stride, length, f, z, v, b);
    
    const ds = outer.map((_: number, i: number) => 
      Math.max(0, Math.sqrt(outer[i]) - 0.5) -
      Math.max(0, Math.sqrt(inner[i]) - 0.5));
      
    expect(ds).toEqual([3, 2, 1, 0, -1, -2, -1, 0, 1, 2, 3]);
  });

  it('edt1d subpixel signed quarter-pixel', () => {
    
    const I = INF;
    const outer = [I, I, I, 0, 0, 0, 0, 0, I, I, I] as any;
    const inner = [0, 0, 0, I, I, I, I, I, 0, 0, 0] as any;

    const Q = 0.25;
    const shift1 = [0, 0, 0, Q, 0, 0, 0, -Q, 0, 0, 0] as any;
    const shift2 = [0, 0, Q, 0, 0, 0, 0, 0, -Q, 0, 0] as any;

    const offset = 0;
    const stride = 1;
    const length = outer.length;
    
    const f = [] as any;
    const z = [] as any;
    const v = [] as any;
    const b = [] as any;
    
    edt1dSubpixel(outer, shift1, offset, stride, length, f, z, v, b);
    edt1dSubpixel(inner, shift2, offset, stride, length, f, z, v, b);
    
    const ds = outer.map((_: number, i: number) => 
      Math.max(0, Math.sqrt(outer[i]) - 0.5) -
      Math.max(0, Math.sqrt(inner[i]) - 0.5));      

    expect(ds).toEqual([2.75, 1.75, 0.75, -0.25, -1.25, -2.25, -1.25, -0.25, 0.75, 1.75, 2.75]);
  });

  it('edt1d subpixel signed fractional pixel outer', () => {
    
    const I = INF;
    const outer = [I, I, I, 0, 0, 0, 0, 0, I, I, I] as any;
    const inner = [0, 0, 0, I, I, I, I, I, 0, 0, 0] as any;

    const F = 0.07;
    const shift1 = [0, 0, 0, -F, 0, 0, 0, F, 0, 0, 0] as any;
    const shift2 = [0, 0, -F, 0, 0, 0, 0, 0, F, 0, 0] as any;

    const offset = 0;
    const stride = 1;
    const length = outer.length;
    
    const f = [] as any;
    const z = [] as any;
    const v = [] as any;
    const b = [] as any;
    
    edt1dSubpixel(outer, shift1, offset, stride, length, f, z, v, b);
    edt1dSubpixel(inner, shift2, offset, stride, length, f, z, v, b);
    
    const ds = outer.map((_: number, i: number) => 
      Math.max(0, Math.sqrt(outer[i]) - 0.5) -
      Math.max(0, Math.sqrt(inner[i]) - 0.5));      

    expect(ds.map((x: number) => Math.round(x * 100) / 100)).toEqual([2.43, 1.43, 0.43, -0.57, -1.57, -2.57, -1.57, -0.57, 0.43, 1.43, 2.43]);
  });

  it('gets subpixel offsets', () => {
    
    const H = 0.5;
    const Q = 0.25;
    
    const data = [
      0, 0, 0, 0, 0, 0,
      0, Q, H, H, Q, 0,
      0, H, 1, 1, H, 0,
      0, H, 1, 1, H, 0,
      0, Q, H, H, Q, 0,
      0, 0, 0, 0, 0, 0,
    ];
    
    const sdf = makeSDFStage(6);
    const {xo, yo} = sdf;
    paintSubpixelOffsets(sdf, data, 6, 6, 0);
  });

});
