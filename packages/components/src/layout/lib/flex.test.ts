import { LayoutState, LayoutResult, Rectangle, Point } from '../types';
import { makeFlexLayout } from './flex';

describe('flex layout', () => {

  const placeInBox = (results: LayoutResult[], layout: LayoutState) => {
    const [left, top, right, bottom] = layout;
    const shift = ([l, t, r, b]: LayoutState) => [l + left, t + top, r + left, b + top];
    return results.map((result: LayoutResult) => ({...result, box: shift(result.box)}));
  };

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
      element: null,
    };
  };
  
  it("resolves flex layout X", () => {
    const resolve = makeFlexLayout('x');
    const layout = [10, 20, 100, 100] as Rectangle;
    const handlers = [
      makeElement(50, 50),
      makeElement(20, 20),
    ];
    
    const {box, size, results} = resolve(layout, handlers)(layout);

    expect(size).toEqual([70, 50]);
    expect(box).toEqual([10, 20, 80, 70]);

    const applied = placeInBox(results, layout);
    expect(applied[0].box).toEqual([10, 20, 60, 70]);
    expect(applied[1].box).toEqual([60, 20, 80, 40]);
  });

  it("resolves flex layout Y", () => {
    const resolve = makeFlexLayout('y');
    const layout = [10, 20, 100, 100] as Rectangle;
    const handlers = [
      makeElement(50, 50),
      makeElement(20, 20),
    ];
    
    const {box, size, results} = resolve(layout, handlers)(layout);
    expect(size).toEqual([50, 70]);
    expect(box).toEqual([10, 20, 60, 90]);

    const applied = placeInBox(results, layout);
    expect(applied[0].box).toEqual([10, 20, 60, 70]);
    expect(applied[1].box).toEqual([10, 70, 30, 90]);

  });
});