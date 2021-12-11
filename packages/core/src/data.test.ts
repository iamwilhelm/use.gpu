import {
  copyNumberArrays, copyNestedNumberArray, copyNumberArrayChunked,
  copyDataArrays, copyDataArrayChunked,
} from './data';

describe('data', () => {

  it('copies nested vec2 number array', () => {
    const data = [[1, 10], [2, 20], [3, 30]];
    const dst = [0, 0, 0, 0, 0, 0];
    const accessor = (o: any) => [o.x, o.y];

    copyNestedNumberArray(data, dst, 2);
    expect(dst).toEqual([1, 10, 2, 20, 3, 30]);
  });
  
  it('copies multiple number arrays into one', () => {
    const src = [[1, 2, 3], [4], [5, 6]];
    const dst = [0, 0, 0, 0, 0, 0];

    copyNumberArrays(src, dst);
    expect(dst).toEqual([1, 2, 3, 4, 5, 6]);
  });
  
  it('copies multiple data arrays into one', () => {
    const src = [{xs: [1, 2, 3]}, {xs: [4]}, {xs: [5, 6]}];
    const dst = [0, 0, 0, 0, 0, 0];

    copyDataArrays(src, dst, 1, (o: any) => o.xs);
    expect(dst).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('copies number array into repeated chunks', () => {
    const src = [1, 2, 3];
    const dst = [0, 0, 0, 0, 0, 0];

    copyNumberArrayChunked(src, dst, 1, [3, 1, 2]);
    expect(dst).toEqual([1, 1, 1, 2, 3, 3]);
  });

  it('copies vec2 array into repeated chunks', () => {
    const src = [1, 10, 2, 20, 3, 30];
    const dst = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    copyNumberArrayChunked(src, dst, 2, [3, 1, 2]);
    expect(dst).toEqual([1, 10, 1, 10, 1, 10, 2, 20, 3, 30, 3, 30]);
  });

  it('copies vec4 array into repeated chunks', () => {
    const src = [1, 10, 2, 20, 3, 30, 4, 40];
    const dst = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    copyNumberArrayChunked(src, dst, 4, [3, 2]);
    expect(dst).toEqual([1, 10, 2, 20, 1, 10, 2, 20, 1, 10, 2, 20, 3, 30, 4, 40, 3, 30, 4, 40]);
  });
  
  it('copies number data array into repeated chunks', () => {
    const data = [{x: 1}, {x: 2}, {x: 3}];
    const dst = [0, 0, 0, 0, 0, 0];
    const accessor = (o: any) => o.x;

    copyDataArrayChunked(data, dst, 1, [3, 1, 2], accessor);
    expect(dst).toEqual([1, 1, 1, 2, 3, 3]);
  });

  it('copies vec2 data array into repeated chunks', () => {
    const data = [{x: 1, y: 10}, {x: 2, y: 20}, {x: 3, y: 30}];
    const dst = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const accessor = (o: any) => [o.x, o.y];

    copyDataArrayChunked(data, dst, 2, [3, 1, 2], accessor);
    expect(dst).toEqual([1, 10, 1, 10, 1, 10, 2, 20, 3, 30, 3, 30]);
  });

  it('copies vec4 array into repeated chunks', () => {
    const data = [{x: 1, y: 10, z: 2, w: 20}, {x: 3, y: 30, z: 4, w: 40}];
    const dst = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const accessor = (o: any) => [o.x, o.y, o.z, o.w];

    copyDataArrayChunked(data, dst, 4, [3, 2], accessor);
    expect(dst).toEqual([1, 10, 2, 20, 1, 10, 2, 20, 1, 10, 2, 20, 3, 30, 4, 40, 3, 30, 4, 40]);
  });
  
});