import { LayoutState, Rectangle, Point, Margin } from '../types';
import { makeBlockLayout } from './block';

describe('block layout', () => {
  
  let ID = 0;
  const makeElement = (
    width: number,
    height: number,
  ) => (
    layout: LayoutState,
  ) => {
    const [l, t, r, b] = layout;
    return {
      key: ++ID,
      box: [l, t, l + width, t + height] as Rectangle,
      size: [width, height] as Point,
      grow: 0,
      shrink: 0,
      margin: [0, 0, 0, 0] as Margin,
      element: null,
    };
  };
  
  it("resolves block layout X", () => {
    const resolve = makeBlockLayout('x');
    const layout = [10, 20, 100, 100] as Rectangle;
    const handlers = [
      makeElement(50, 50),
      makeElement(20, 20),
    ];
    
    const {box, size, results} = resolve(layout, handlers)(layout);
    expect(box).toEqual([10, 20, 80, 100]);
    expect(size).toEqual([70, 50]);
  });

  it("resolves block layout Y", () => {
    const resolve = makeBlockLayout('y');
    const layout = [10, 20, 100, 100] as Rectangle;
    const handlers = [
      makeElement(50, 50),
      makeElement(20, 20),
    ];
    
    const {box, size, results} = resolve(layout, handlers)(layout);
    expect(box).toEqual([10, 20, 100, 90]);
    expect(size).toEqual([50, 70]);
  });
});