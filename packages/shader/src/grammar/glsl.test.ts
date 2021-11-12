import { SyntaxNode } from '@lezer/common';
import { parser } from './glsl';

const formatASTNode = (node: SyntaxNode) => {
  const {type} = node;
  let child = node.firstChild;
  let inner = [] as string[];
  while (child) {
    inner.push(formatASTNode(child));
    child = child.nextSibling;
  }
  const space = inner.length ? ' ' : '';
  return `(${type.name}${space}${inner.join(" ")})`;
}

const formatAST = (node: SyntaxNode, program: string, depth: number = 0) => {
  const {type, from ,to} = node;
  const prefix = '  '.repeat(depth);

  let child = node.firstChild;
  
  const text = program.slice(node.from, node.to).replace(/\n/g, "⮐")
  let out = [] as string[];
  
  let line = `${prefix}${type.name}`;
  const n = line.length;
  line += ' '.repeat(60 - n);
  line += text;
  out.push(line);

  while (child) {
    out.push(formatAST(child, program, depth + 1));
    child = child.nextSibling;
  }
  return out.join("\n");
}

`
float foo = 1.0;
#define WAT

struct light {
 float intensity;
 vec3 position;
} lightVar;
void main();
void main() {
  int bar = wat(5, 6);
  int x = 4 + 5 + +6;
  struct s { } x;
  gl_FragColor = vec4(0.1, 0.2, 0.3, 1.0);
}
`

const PROGRAM = `
float foo = 1.0;
#define WAT

struct light {
 float intensity;
 vec3 position;
} lightVar;
void main();
void main() {
  int bar = wat(5, 6);
  int x = 4 + 5 + +6;
  struct s { } x;
  gl_FragColor = vec4(0.1, 0.2, 0.3, 1.0);
}
`;

describe("glsl parser", () => {
  it("parses", () => {
    const text = PROGRAM;
    const parsed = parser.parse(text);
    console.log(formatASTNode(parsed.topNode));
    console.log(formatAST(parsed.topNode, text));
  });
});