import { edt1d } from './sdf';

describe('edt', () => {
  
  it('edt', () => {
    
    const grid = [0, 0, 0, 0];
    const offset = 0;
    const stride = 1;
    const length = grid.length;
    
    const f = [];
    const z = [];
    const v = [];
    
    edt1d(grid, offset, stride, length, f, z, v);
    
    console.log(grid);
  });
  
});
