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
    grow: number = 0,
    shrink: number = 0,
  ) => (
    layout: LayoutState,
  ) => {
    const [l, t, r, b] = layout;
    return {
      key: ++ID,
      box: [l, t, l + width, t + height] as Rectangle,
      size: [width, height] as Point,
      grow,
      shrink,
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

  it("resolves flex layout X with grow", () => {
    const resolve = makeFlexLayout('x');
    const layout = [10, 20, 200, 100] as Rectangle;
    const handlers = [
      makeElement(40, 50, 1, 0),
      makeElement(20, 20, 1, 0),
    ];

    const {box, size, results} = resolve(layout, handlers)(layout);

    expect(size).toEqual([190, 50]);
    expect(box).toEqual([10, 20, 200, 70]);

    const applied = placeInBox(results, layout);
    expect(applied[0].box).toEqual([10, 20, 115, 70]);
    expect(applied[1].box).toEqual([115, 20, 200, 40]);
  });

  it("resolves flex layout X with shrink", () => {
    const resolve = makeFlexLayout('x');
    const layout = [10, 20, 100, 100] as Rectangle;
    const handlers = [
      makeElement(150, 50, 0, 1),
      makeElement(20, 20, 0, 1),
    ];

    const {box, size, results} = resolve(layout, handlers)(layout);

    expect(size).toEqual([90, 50]);
    expect(box).toEqual([10, 20, 100, 70]);

    const applied = placeInBox(results, layout);
    expect(applied[0].box).toEqual([10, 20, 89, 70]);
    expect(applied[1].box).toEqual([89, 20, 100, 40]);
  });

  it("resolves flex layout X with excessive shrink", () => {
    const resolve = makeFlexLayout('x');
    const layout = [10, 20, 100, 100] as Rectangle;
    const handlers = [
      makeElement(150, 50, 0, 1),
      makeElement(20, 20, 0, 3),
    ];

    const {box, size, results} = resolve(layout, handlers)(layout);

    expect(size).toEqual([90, 50]);
    expect(box).toEqual([10, 20, 100, 70]);

    const applied = placeInBox(results, layout);
    expect(applied[0].box).toEqual([10, 20, 100, 70]);
    expect(applied[1].box).toEqual([100, 20, 100, 40]);
  });

  it("resolves flex layout X with justify", () => {
    const resolve = makeFlexLayout('x', 'justify');
    const layout = [10, 20, 200, 100] as Rectangle;
    const handlers = [
      makeElement(40, 50),
      makeElement(20, 20),
    ];

    const {box, size, results} = resolve(layout, handlers)(layout);

    expect(size).toEqual([190, 50]);
    expect(box).toEqual([10, 20, 200, 70]);

    const applied = placeInBox(results, layout);
    expect(applied[0].box).toEqual([10, 20, 50, 70]);
    expect(applied[1].box).toEqual([180, 20, 200, 40]);
  });

  it("resolves flex layout X with between", () => {
    const resolve = makeFlexLayout('x', 'between');
    const layout = [10, 20, 200, 100] as Rectangle;
    const handlers = [
      makeElement(40, 50),
      makeElement(20, 20),
    ];

    const {box, size, results} = resolve(layout, handlers)(layout);

    expect(size).toEqual([190, 50]);
    expect(box).toEqual([10, 20, 200, 70]);

    const applied = placeInBox(results, layout);
    expect(applied[0].box).toEqual([43, 20, 83, 70]);
    expect(applied[1].box).toEqual([148, 20, 168, 40]);
  });
});