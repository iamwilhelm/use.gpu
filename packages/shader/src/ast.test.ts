import { GLSLModules } from '@use-gpu/glsl';
import { parseGLSL } from './shader';
import { makeASTParser } from './ast';
import { addASTSerializer } from './test/snapshot';

addASTSerializer(expect);

describe('ast', () => {

  it('extracts test declarations', () => {
    const code = `
      float x, y;
      int a = 3, b = 1, c, d;
    `;

    const tree = parseGLSL(code);
    const {extractDeclarations} = makeASTParser(code, tree);

    const declarations = extractDeclarations();
    expect(declarations).toMatchSnapshot();
  });
  
  it('extracts quad vertex imports', () => {
    const code = GLSLModules['instance/quad/vertex'];

    const tree = parseGLSL(code);
    const {extractImports} = makeASTParser(code, tree);

    const imports = extractImports();
    expect(imports).toMatchSnapshot();
  });
  
  it('extracts quad vertex functions', () => {
    const code = GLSLModules['instance/quad/vertex'];

    const tree = parseGLSL(code);
    const {extractFunctions} = makeASTParser(code, tree);

    const functions = extractFunctions();
    expect(functions).toMatchSnapshot();
  });

  it('extracts quad vertex declarations', () => {
    const code = GLSLModules['instance/quad/vertex'];

    const tree = parseGLSL(code);
    const {extractDeclarations} = makeASTParser(code, tree);

    const declarations = extractDeclarations();
    expect(declarations).toMatchSnapshot();
  });

  it('extracts quad fragment declarations', () => {
    const code = GLSLModules['instance/quad/fragment'];

    const tree = parseGLSL(code);
    const {extractDeclarations} = makeASTParser(code, tree);

    const declarations = extractDeclarations();
    expect(declarations).toMatchSnapshot();
  });

  it('extracts use view declarations', () => {
    const code = GLSLModules['use/view'];

    const tree = parseGLSL(code);
    const {extractDeclarations} = makeASTParser(code, tree);

    const declarations = extractDeclarations();
    expect(declarations).toMatchSnapshot();
  });
  
  it('extracts use view symbol table', () => {
    const code = GLSLModules['use/view'];

    const tree = parseGLSL(code);
    const {extractSymbolTable} = makeASTParser(code, tree);

    const symbolTable = extractSymbolTable();
    expect(symbolTable).toMatchSnapshot();
  });

  fit('extracts use types symbol table', () => {
    const code = GLSLModules['use/types'];

    const tree = parseGLSL(code);
    const {extractSymbolTable} = makeASTParser(code, tree);

    const symbolTable = extractSymbolTable();
    expect(symbolTable).toMatchSnapshot();
  });
});
