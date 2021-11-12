import { SyntaxNode } from '@lezer/common';
import { parser } from './glsl';

const formatASTNode = (node: SyntaxNode) => {
  const {type, length} = node;
  let child = node.firstChild;
  let inner = [] as string[];
  while (child) {
    inner.push(formatASTNode(child));
    child = child.nextSibling;
  }
  const space = inner.length ? ' ' : '';
  return `(${type.name}${space}${inner.join(" ")})`;
}

const formatAST = (node: SyntaxNode, depth: number = 0) => {
  const {type, length} = node;
  const prefix = '  '.repeat(depth);

  let child = node.firstChild;
  let out = [`${prefix}${type.name}`];
  while (child) {
    out.push(formatAST(child, depth + 1));
    child = child.nextSibling;
  }
  return out.join("\n");
}

`
float foo = 1.0;
#define WAT
int bar = wat(5, 6);
struct light {
 float intensity;
 vec3 position;
} lightVar;
void main() {
  gl_FragColor = vec4(0.1, 0.2, 0.3, 1.0);
}
`;

const PROGRAM = `
float foo = 1.0;
`;

describe("glsl parser", () => {
  it("parses", () => {
    const parsed = parser.parse(PROGRAM);
    console.log(formatASTNode(parsed.topNode));
    console.log(formatAST(parsed.topNode));
  });
});