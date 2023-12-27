import { transpileWGSL } from './shader';
import { WGSLModules } from './wgsl.test.data.ts';

describe('shader', () => {

  it('transpiles wgsl to ES', () => {

    const source = WGSLModules['getQuadVertex'];
    const resourcePath = '/getQuadVertex';

    const normal = transpileWGSL(source, resourcePath, true, false);
    const minified = transpileWGSL(source, resourcePath, true, true);

    expect(normal).toMatchSnapshot();
    expect(minified).toMatchSnapshot();

  });

  it('transpiles wgsl to CJS', () => {

    const source = WGSLModules['getQuadVertex'];
    const resourcePath = '/getQuadVertex';
    const normal = transpileWGSL(source, resourcePath, false, false);
    const minified = transpileWGSL(source, resourcePath, false, true);

    expect(normal).toMatchSnapshot();
    expect(minified).toMatchSnapshot();

  });

});