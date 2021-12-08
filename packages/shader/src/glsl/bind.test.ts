import { GLSLModules } from '@use-gpu/glsl';
import { bindBundle } from './bind';
import { loadModule } from './shader';
import { linkBundle } from './link';
import { formatAST } from '../util/tree'; 
import { addASTSerializer } from '../test/snapshot';

addASTSerializer(expect);

describe("bind", () => {
  
  it("binds an external", () => {
    
    const codeMain = `
    vec4 getColor();
    void main() {
      vec4 v;
      v.xyz = vec3(1.0, 0.0, 0.0);
      gl_FragColor = getColor();
    }
    `

    const codeSub = `
    vec4 getSubColor();
    
    vec4 colorUsed() { return vec4(0.0, 0.1, 0.2, 0.0); }
    vec4 colorNotUsed() { return vec4(0.0, 0.1, 0.2, 1.0); }

    #pragma export
    vec4 getColor() {
      return getSubColor() + colorUsed();
    }
    `
    
    const codeColor = `
    #pragma export
    vec4 getColor() { return vec4(1.0, 0.0, 1.0, 1.0); }
    `
    
    const module = loadModule(codeMain, 'main');
    const sub = loadModule(codeSub, 'sub');
    const getColor = loadModule(codeColor, 'getColor');

    const links = {"getSubColor:getColor": getColor};
    const defines = {'TEST': true};

    {
      const linked = linkBundle(sub, links, defines);
      expect(linked).toMatchSnapshot();
    }
    
    {
      const bound = bindBundle(sub, links, defines, 'key');
      const linked = linkBundle(bound);
      expect(linked).toMatchSnapshot();
    }

    {
      const linked = linkBundle(module, {getColor: sub, "getSubColor:getColor": getColor}, defines);
      expect(linked).toMatchSnapshot();
    }

    {
      const bound = bindBundle(sub, links, defines, 'key');
      const linked = linkBundle(module, {getColor: bound});
      expect(linked).toMatchSnapshot();
    }

  });

});